'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { apiClient } from '@/lib/api';
import { ApprovalGuard } from '@/components/auth/ApprovalGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Modal } from '@/components/common/Modal';
import { Plus, Eye, EyeOff, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function ApiKeysPage() {
  const { apiKeys, loading, fetchApiKeys, addApiKey, deleteApiKey } = useUserStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [platform, setPlatform] = useState<'youtube' | 'facebook'>('youtube');
  const [authMode, setAuthMode] = useState<'oauth' | 'manual'>('oauth');

  // YouTube OAuth fields
  const [youtubeClientId, setYoutubeClientId] = useState('');
  const [youtubeClientSecret, setYoutubeClientSecret] = useState('');
  const [youtubeAccessToken, setYoutubeAccessToken] = useState('');
  const [youtubeRefreshToken, setYoutubeRefreshToken] = useState('');
  const [accountTag, setAccountTag] = useState('');

  // Facebook fields
  const [facebookAppId, setFacebookAppId] = useState('');
  const [facebookAppSecret, setFacebookAppSecret] = useState('');
  const [facebookAccessToken, setFacebookAccessToken] = useState('');

  const [isAdding, setIsAdding] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [oauthPopup, setOauthPopup] = useState<Window | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  // Handle OAuth callback messages from popup
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'youtube-oauth-callback') {
        const { code } = event.data;
        try {
          setIsAdding(true);
          const redirectUri = `${window.location.origin}/api-keys/oauth/callback`;

          await apiClient.completeYouTubeOAuth(
            code,
            youtubeClientId,
            youtubeClientSecret,
            redirectUri,
            accountTag.trim() || undefined
          );

          toast.success('YouTube authorized successfully!');
          setIsAddModalOpen(false);
          fetchApiKeys();

          if (oauthPopup && !oauthPopup.closed) {
            oauthPopup.close();
          }

          // Reset fields
          setYoutubeClientId('');
          setYoutubeClientSecret('');
          setYoutubeAccessToken('');
          setYoutubeRefreshToken('');
          setAccountTag('');
        } catch (error: any) {
          toast.error(error.message || 'Failed to complete authorization');
        } finally {
          setIsAdding(false);
          setOauthPopup(null);
        }
      } else if (event.data.type === 'youtube-oauth-error') {
        toast.error(`OAuth error: ${event.data.error}`);
        setIsAdding(false);
        if (oauthPopup && !oauthPopup.closed) {
          oauthPopup.close();
        }
        setOauthPopup(null);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [oauthPopup, youtubeClientId, youtubeClientSecret, fetchApiKeys]);

  const handleOAuthAuthorize = async () => {
    if (!youtubeClientId.trim() || !youtubeClientSecret.trim()) {
      toast.error('Please enter Client ID and Client Secret');
      return;
    }

    try {
      setIsAdding(true);
      const redirectUri = `${window.location.origin}/api-keys/oauth/callback`;

      // Send user's credentials to backend to initiate OAuth
      const { authUrl } = await apiClient.startYouTubeOAuth(
        youtubeClientId,
        youtubeClientSecret,
        redirectUri
      );

      const popup = window.open(
        authUrl,
        'youtube-oauth',
        'width=600,height=700,left=100,top=100'
      );

      if (popup) {
        setOauthPopup(popup);
      } else {
        toast.error('Failed to open authorization window. Check browser popup settings.');
        setIsAdding(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to start OAuth flow');
      setIsAdding(false);
    }
  };

  const handleAdd = async () => {
    if (platform === 'youtube') {
      if (authMode === 'oauth') {
        await handleOAuthAuthorize();
      } else {
        // Manual mode
        if (
          !youtubeClientId.trim() ||
          !youtubeClientSecret.trim() ||
          !youtubeAccessToken.trim() ||
          !youtubeRefreshToken.trim()
        ) {
          toast.error('Please enter all YouTube credentials');
          return;
        }

        setIsAdding(true);
        try {
          await apiClient.addYouTubeManual(
            youtubeClientId.trim(),
            youtubeClientSecret.trim(),
            youtubeAccessToken.trim(),
            youtubeRefreshToken.trim(),
            accountTag.trim() || undefined
          );

          toast.success('YouTube credentials added successfully');
          setIsAddModalOpen(false);
          fetchApiKeys();

          setYoutubeClientId('');
          setYoutubeClientSecret('');
          setYoutubeAccessToken('');
          setYoutubeRefreshToken('');
          setAccountTag('');
        } catch (error: any) {
          toast.error(error.message || 'Failed to add YouTube credentials');
        } finally {
          setIsAdding(false);
        }
      }
    } else if (platform === 'facebook') {
      if (!facebookAppId.trim() || !facebookAppSecret.trim() || !facebookAccessToken.trim()) {
        toast.error('Please enter App ID, App Secret, and Access Token for Facebook');
        return;
      }

      const credentials = JSON.stringify({
        appId: facebookAppId.trim(),
        appSecret: facebookAppSecret.trim(),
        accessToken: facebookAccessToken.trim(),
      });

      setIsAdding(true);
      try {
        await addApiKey(platform, credentials);
        toast.success('Facebook credentials added successfully');
        setIsAddModalOpen(false);
        setFacebookAppId('');
        setFacebookAppSecret('');
        setFacebookAccessToken('');
        setPlatform('youtube');
      } catch (error: any) {
        toast.error(error.message || 'Failed to add Facebook credentials');
      } finally {
        setIsAdding(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;
    try {
      await deleteApiKey(id);
      toast.success('API key deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete API key');
    }
  };

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setAuthMode('oauth');
    setYoutubeClientId('');
    setYoutubeClientSecret('');
    setYoutubeAccessToken('');
    setYoutubeRefreshToken('');
    setAccountTag('');
    setFacebookAppId('');
    setFacebookAppSecret('');
    setFacebookAccessToken('');
  };

  return (
    <ApprovalGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
          <p className="mt-2 text-gray-600">Manage your YouTube and Facebook credentials</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add API Key
        </Button>
      </div>

      {/* Add API Key Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={closeModal}
        title="Add API Key"
        className="max-w-2xl"
      >
        <div className="space-y-6">
          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
            <Select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as 'youtube' | 'facebook')}
              options={[
                { value: 'youtube', label: 'YouTube' },
                { value: 'facebook', label: 'Facebook' },
              ]}
            />
          </div>

          {/* YouTube OAuth Section */}
          {platform === 'youtube' && (
            <div className="space-y-4 border-t pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Authorization Method
                </label>
                <div className="space-y-2">
                  {/* OAuth2 Option */}
                  <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50" style={{borderColor: authMode === 'oauth' ? '#3b82f6' : '#e5e7eb', backgroundColor: authMode === 'oauth' ? '#eff6ff' : 'transparent'}}>
                    <input
                      type="radio"
                      name="authMode"
                      value="oauth"
                      checked={authMode === 'oauth'}
                      onChange={(e) => setAuthMode(e.target.value as 'oauth' | 'manual')}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-gray-900">OAuth2 Authorization Flow</p>
                      <p className="text-sm text-gray-500">Recommended: Enter your OAuth credentials, then authorize via Google login popup. Tokens are auto-refreshed.</p>
                    </div>
                  </label>

                  {/* Manual Option */}
                  <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50" style={{borderColor: authMode === 'manual' ? '#3b82f6' : '#e5e7eb', backgroundColor: authMode === 'manual' ? '#eff6ff' : 'transparent'}}>
                    <input
                      type="radio"
                      name="authMode"
                      value="manual"
                      checked={authMode === 'manual'}
                      onChange={(e) => setAuthMode(e.target.value as 'oauth' | 'manual')}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Manual Token Entry</p>
                      <p className="text-sm text-gray-500">Advanced: Get tokens from OAuth Playground and enter them directly. No authorization popup needed.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* OAuth Mode: Credentials + Authorization */}
              {authMode === 'oauth' && (
                <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-900 mb-4">
                    Get your OAuth credentials from{' '}
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline"
                    >
                      Google Cloud Console
                    </a>
                    . Then click authorize to login with Google and get access tokens.
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Name/Tag (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Main Channel, Backup Account"
                      value={accountTag}
                      onChange={(e) => setAccountTag(e.target.value)}
                      maxLength={50}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Give this account a name to identify it later
                    </p>
                  </div>

                  <Input
                    type="text"
                    placeholder="Client ID"
                    value={youtubeClientId}
                    onChange={(e) => setYoutubeClientId(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Client Secret"
                    value={youtubeClientSecret}
                    onChange={(e) => setYoutubeClientSecret(e.target.value)}
                  />

                  <Button
                    onClick={handleOAuthAuthorize}
                    isLoading={isAdding}
                    disabled={isAdding}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {isAdding ? 'Authorizing...' : 'Authorize with Google'}
                  </Button>
                </div>
              )}

              {/* Manual Mode: Client Credentials + Tokens */}
              {authMode === 'manual' && (
                <div className="space-y-4 bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-900 mb-4">
                    Get your OAuth tokens directly from{' '}
                    <a
                      href="https://developers.google.com/oauthplayground/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline"
                    >
                      OAuth2 Playground
                    </a>
                    {' '}or{' '}
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline"
                    >
                      Google Cloud Console
                    </a>
                    . No authorization popup needed - enter everything manually.
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Name/Tag (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Main Channel, Backup Account"
                      value={accountTag}
                      onChange={(e) => setAccountTag(e.target.value)}
                      maxLength={50}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Give this account a name to identify it later
                    </p>
                  </div>

                  <Input
                    type="text"
                    placeholder="Client ID"
                    value={youtubeClientId}
                    onChange={(e) => setYoutubeClientId(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Client Secret"
                    value={youtubeClientSecret}
                    onChange={(e) => setYoutubeClientSecret(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Access Token"
                    value={youtubeAccessToken}
                    onChange={(e) => setYoutubeAccessToken(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Refresh Token"
                    value={youtubeRefreshToken}
                    onChange={(e) => setYoutubeRefreshToken(e.target.value)}
                  />

                  <Button
                    onClick={handleAdd}
                    isLoading={isAdding}
                    disabled={isAdding}
                    className="w-full"
                  >
                    Add Credentials
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Facebook Section */}
          {platform === 'facebook' && (
            <div className="space-y-4 border-t pt-4">
              <Input
                type="text"
                placeholder="App ID"
                value={facebookAppId}
                onChange={(e) => setFacebookAppId(e.target.value)}
              />
              <Input
                type="password"
                placeholder="App Secret"
                value={facebookAppSecret}
                onChange={(e) => setFacebookAppSecret(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Access Token"
                value={facebookAccessToken}
                onChange={(e) => setFacebookAccessToken(e.target.value)}
              />
              <Button
                onClick={handleAdd}
                isLoading={isAdding}
                disabled={isAdding}
                className="w-full"
              >
                Add Credentials
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* API Keys List */}
      {loading ? (
        <LoadingSpinner />
      ) : apiKeys.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">No API keys added yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {apiKeys.map((key) => (
            <Card key={key.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={key.platform === 'youtube' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                        {key.platform}
                      </Badge>
                      {key.status === 'active' && (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      )}
                    </div>

                    {/* Account Tag and Channel Info */}
                    {key.accountTag && (
                      <p className="text-lg font-semibold text-gray-900 mb-1">
                        {key.accountTag}
                      </p>
                    )}
                    {key.channelTitle && (
                      <p className="text-sm text-gray-600 mb-1">
                        Channel: {key.channelTitle}
                      </p>
                    )}
                    {key.channelId && (
                      <p className="text-xs text-gray-500 font-mono mb-2">
                        ID: {key.channelId}
                      </p>
                    )}

                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Created:</span> {formatDate(key.createdAt)}
                      </p>
                      {key.lastUsed && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Last used:</span> {formatDate(key.lastUsed)}
                        </p>
                      )}
                      {key.usageCount !== undefined && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Uploads:</span> {key.usageCount || 0}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleVisibility(key.id)}
                    >
                      {visibleKeys.has(key.id) ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(key.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </ApprovalGuard>
  );
}
