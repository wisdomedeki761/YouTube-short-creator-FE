'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Trash2, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const handleDownloadData = () => {
    toast.success('Data download initiated. You will receive an email shortly.');
  };

  const handleDeleteAccount = () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    if (!confirm('This will permanently delete all your data. Type DELETE to confirm.')) {
      return;
    }
    toast.error('Account deletion is not yet implemented');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Video Processing Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Video Processing Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Default Filler Video"
              options={[
                { value: 'auto', label: 'Auto-select' },
                { value: '1', label: 'Filler Video 1' },
                { value: '2', label: 'Filler Video 2' },
              ]}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="auto-post"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="auto-post" className="text-sm text-gray-700">
                Automatically post to platforms after processing
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="email-notifications"
                defaultChecked
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="email-notifications" className="text-sm text-gray-700">
                Email notifications
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="push-notifications"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="push-notifications" className="text-sm text-gray-700">
                Push notifications
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">Change Password</Button>
            <div className="text-sm text-gray-500">
              Last password change: Never
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Download all your data including videos, settings, and account information.
              </p>
              <Button variant="outline" onClick={handleDownloadData}>
                <Download className="mr-2 h-4 w-4" />
                Download My Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button variant="danger" onClick={handleDeleteAccount}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

