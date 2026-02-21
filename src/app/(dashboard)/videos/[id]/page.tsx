'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Video } from '@/types/video';
import { ApiKey } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { AccountSelector } from '@/components/dashboard/AccountSelector';
import { formatDate, formatDuration, formatFileSize } from '@/utils/helpers';
import { VIDEO_STATUS_COLORS } from '@/lib/constants';
import { cn } from '@/utils/helpers';
import { CheckCircle, XCircle, Download, Trash2, ArrowLeft, X, Youtube } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [showResultModal, setShowResultModal] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [selectedYoutubeAccounts, setSelectedYoutubeAccounts] = useState<string[]>([]);
  const [selectedFacebookAccounts, setSelectedFacebookAccounts] = useState<string[]>([]);

  useEffect(() => {
    if (params.id) {
      fetchVideo(params.id as string);
    }
  }, [params.id]);

  useEffect(() => {
    if (showApproveModal) {
      fetchApiKeys();
    }
  }, [showApproveModal]);

  const fetchApiKeys = async () => {
    try {
      const keys = await apiClient.getApiKeys();
      setApiKeys(keys);
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    }
  };

  const fetchVideo = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getVideoById(id);
      setVideo(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const handleApprove = async () => {
    if (!video || selectedPlatforms.length === 0) return;
    if (!videoTitle.trim()) {
      toast.error('Please enter a title for the video');
      return;
    }

    // Validate account selection
    if (selectedPlatforms.includes('youtube') && selectedYoutubeAccounts.length === 0) {
      toast.error('Please select at least one YouTube account');
      return;
    }
    if (selectedPlatforms.includes('facebook') && selectedFacebookAccounts.length === 0) {
      toast.error('Please select at least one Facebook account');
      return;
    }

    setApproving(true);
    setShowApproveModal(false);
    try {
      const result = await apiClient.approveVideo(
        video.id,
        selectedPlatforms,
        selectedYoutubeAccounts,
        selectedFacebookAccounts,
        videoTitle,
        videoDescription
      );
      setUploadResult(result);
      setShowResultModal(true);
      toast.success('Video posted successfully!', { duration: 3000 });
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve video');
    } finally {
      setApproving(false);
      setSelectedPlatforms([]);
      setSelectedYoutubeAccounts([]);
      setSelectedFacebookAccounts([]);
    }
  };

  const handleReject = async () => {
    if (!video) return;
    if (!confirm('Are you sure you want to reject this video? It will be deleted from storage.')) return;
    setRejecting(true);
    try {
      await apiClient.rejectVideo(video.id);
      toast.success('Video rejected and deleted from storage');
      router.push('/videos');
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject video');
    } finally {
      setRejecting(false);
    }
  };

  const handleDelete = async () => {
    if (!video) return;
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      await apiClient.deleteVideo(video.id);
      toast.success('Video deleted');
      router.push('/videos');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete video');
    }
  };

  const handleDownload = async () => {
    if (!video) return;
    try {
      const result = await apiClient.downloadVideo(video.id);
      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank');
        toast.success('Download started');
      } else {
        toast.error('Download URL not available');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to download video');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="space-y-4">
        <Link href="/videos">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Videos
          </Button>
        </Link>
        <ErrorAlert message={error || 'Video not found'} />
      </div>
    );
  }

  const statusColor = VIDEO_STATUS_COLORS[video.status] || VIDEO_STATUS_COLORS.processing;

  return (
    <div className="space-y-6">
      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Post Video To</h2>
              <button
                onClick={() => { setShowApproveModal(false); setSelectedPlatforms([]); }}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Enter video details and select platforms to post.
            </p>

            {/* Title and Description Fields */}
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video Title *
                </label>
                <Input
                  type="text"
                  placeholder="Enter video title"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">{videoTitle.length}/100</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Enter video description"
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  maxLength={500}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">{videoDescription.length}/500</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {/* YouTube Option */}
              <button
                onClick={() => togglePlatform('youtube')}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border-2 p-4 transition-all',
                  selectedPlatforms.includes('youtube')
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg',
                  selectedPlatforms.includes('youtube') ? 'bg-red-500' : 'bg-gray-100'
                )}>
                  <Youtube className={cn('h-5 w-5', selectedPlatforms.includes('youtube') ? 'text-white' : 'text-gray-500')} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">YouTube Shorts</p>
                  <p className="text-xs text-gray-500">Post as a YouTube Short</p>
                </div>
                <div className="ml-auto">
                  <div className={cn(
                    'h-5 w-5 rounded-full border-2 flex items-center justify-center',
                    selectedPlatforms.includes('youtube') ? 'border-red-500 bg-red-500' : 'border-gray-300'
                  )}>
                    {selectedPlatforms.includes('youtube') && (
                      <CheckCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
              </button>

              {/* Facebook Option */}
              <button
                onClick={() => togglePlatform('facebook')}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border-2 p-4 transition-all',
                  selectedPlatforms.includes('facebook')
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg',
                  selectedPlatforms.includes('facebook') ? 'bg-blue-600' : 'bg-gray-100'
                )}>
                  <svg className={cn('h-5 w-5', selectedPlatforms.includes('facebook') ? 'text-white' : 'text-gray-500')} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Facebook Reels</p>
                  <p className="text-xs text-gray-500">Post as a Facebook Reel</p>
                </div>
                <div className="ml-auto">
                  <div className={cn(
                    'h-5 w-5 rounded-full border-2 flex items-center justify-center',
                    selectedPlatforms.includes('facebook') ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  )}>
                    {selectedPlatforms.includes('facebook') && (
                      <CheckCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
              </button>
            </div>

            {/* YouTube Account Selection */}
            {selectedPlatforms.includes('youtube') && (
              <div className="space-y-3 mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Select YouTube Account(s) *
                </label>
                <AccountSelector
                  platform="youtube"
                  accounts={apiKeys}
                  selectedAccounts={selectedYoutubeAccounts}
                  onSelectionChange={setSelectedYoutubeAccounts}
                />
              </div>
            )}

            {/* Facebook Account Selection */}
            {selectedPlatforms.includes('facebook') && (
              <div className="space-y-3 mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Select Facebook Account(s) *
                </label>
                <AccountSelector
                  platform="facebook"
                  accounts={apiKeys}
                  selectedAccounts={selectedFacebookAccounts}
                  onSelectionChange={setSelectedFacebookAccounts}
                />
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setShowApproveModal(false); setSelectedPlatforms([]); }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleApprove}
                disabled={selectedPlatforms.length === 0}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Post to {selectedPlatforms.length === 0 ? '...' : selectedPlatforms.length === 2 ? 'Both' : selectedPlatforms[0] === 'youtube' ? 'YouTube' : 'Facebook'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {showResultModal && uploadResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Video Posted Successfully! 🎉</h2>
              <button
                onClick={() => {
                  setShowResultModal(false);
                  router.push('/videos');
                }}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* YouTube Results */}
              {uploadResult.youtube && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">YouTube Uploads</h3>
                  <div className="space-y-2">
                    {uploadResult.youtube.urls && uploadResult.youtube.urls.length > 0 ? (
                      uploadResult.youtube.urls.map((upload: any, idx: number) => (
                        <div key={idx} className="rounded-lg bg-red-50 p-3">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {upload.accountTag || upload.channelTitle || 'YouTube Account'}
                          </p>
                          <a
                            href={upload.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-red-600 hover:text-red-700 font-medium break-all flex items-center gap-2"
                          >
                            {upload.url}
                            <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      ))
                    ) : null}

                    {/* Show errors if any */}
                    {uploadResult.youtube.errors && uploadResult.youtube.errors.length > 0 && (
                      <div className="space-y-2">
                        {uploadResult.youtube.errors.map((error: any, idx: number) => (
                          <div key={idx} className="rounded-lg bg-red-100 p-3 border border-red-200">
                            <p className="text-sm font-medium text-red-900">
                              ❌ {error.accountTag || 'Account'}: {error.error}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Facebook Results */}
              {uploadResult.facebook && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Facebook Uploads</h3>
                  <div className="space-y-2">
                    {uploadResult.facebook.urls && uploadResult.facebook.urls.length > 0 ? (
                      uploadResult.facebook.urls.map((upload: any, idx: number) => (
                        <div key={idx} className="rounded-lg bg-blue-50 p-3">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {upload.accountTag || upload.channelTitle || 'Facebook Account'}
                          </p>
                          <a
                            href={upload.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium break-all flex items-center gap-2"
                          >
                            {upload.url}
                            <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      ))
                    ) : null}

                    {/* Show errors if any */}
                    {uploadResult.facebook.errors && uploadResult.facebook.errors.length > 0 && (
                      <div className="space-y-2">
                        {uploadResult.facebook.errors.map((error: any, idx: number) => (
                          <div key={idx} className="rounded-lg bg-blue-100 p-3 border border-blue-200">
                            <p className="text-sm font-medium text-blue-900">
                              ❌ {error.accountTag || 'Account'}: {error.error}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setShowResultModal(false);
                  router.push('/videos');
                }}
              >
                Back to Videos
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/videos">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{video.title || 'Untitled Video'}</h1>
            <p className="mt-1 text-gray-600">Video Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn(statusColor)}>{video.status}</Badge>
          {(video.status === 'completed' || video.status === 'pending_approval') && video.editedVideoUrl && (
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
          {video.status === 'pending_approval' && (
            <>
              <Button
                variant="secondary"
                onClick={() => setShowApproveModal(true)}
                isLoading={approving}
                disabled={approving || rejecting}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button variant="danger" onClick={handleReject} isLoading={rejecting} disabled={approving || rejecting}>
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </>
          )}
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <Card>
            <CardHeader>
              <CardTitle>Video Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                {video.editedVideoUrl ? (
                  <video
                    src={video.editedVideoUrl}
                    controls
                    className="w-full h-full object-contain rounded-lg"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <p className="text-gray-500">
                    {video.status === 'processing' ? 'Video is being processed...' : 'No preview available'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Platform Links */}
          {(video.youtubeUrl || video.facebookUrl) && (
            <Card>
              <CardHeader>
                <CardTitle>Posted To</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {video.youtubeUrl && (
                    <div className="flex items-center gap-3 rounded border border-gray-200 p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-red-500">
                        <Youtube className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">YouTube Shorts</p>
                        <a
                          href={video.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:underline"
                        >
                          {video.youtubeUrl}
                        </a>
                      </div>
                    </div>
                  )}
                  {video.facebookUrl && (
                    <div className="flex items-center gap-3 rounded border border-gray-200 p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
                        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Facebook Reels</p>
                        <a
                          href={video.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:underline"
                        >
                          {video.facebookUrl}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Video Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Title</p>
                <p className="mt-1 text-sm text-gray-900">{video.title || 'Untitled Video'}</p>
              </div>
              {video.duration && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p className="mt-1 text-sm text-gray-900">{formatDuration(video.duration)}</p>
                </div>
              )}
              {video.fileSize && (
                <div>
                  <p className="text-sm font-medium text-gray-500">File Size</p>
                  <p className="mt-1 text-sm text-gray-900">{formatFileSize(video.fileSize)}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="mt-1 text-sm text-gray-900 capitalize">{video.status.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="mt-1 text-sm text-gray-900">{formatDate(video.createdAt)}</p>
              </div>
              {video.updatedAt && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(video.updatedAt)}</p>
                </div>
              )}
              {video.processedAt && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Processed At</p>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(video.processedAt)}</p>
                </div>
              )}
              {video.status === 'processing' && video.processingProgress !== undefined && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Processing Progress</p>
                  <div className="mt-2">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${video.processingProgress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{video.processingProgress}%</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
