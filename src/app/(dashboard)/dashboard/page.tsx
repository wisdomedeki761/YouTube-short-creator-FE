'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Video, Upload, CheckCircle, Clock } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

export default function DashboardPage() {
  const { videos, loading, fetchVideos } = useUserStore();

  useEffect(() => {
    fetchVideos({ limit: 5 });
  }, [fetchVideos]);

  const stats = {
    total: videos.length,
    completed: videos.filter((v) => v.status === 'completed').length,
    processing: videos.filter((v) => v.status === 'processing').length,
    pending: videos.filter((v) => v.status === 'pending_approval').length,
  };

  const recentVideos = videos.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back! Here&apos;s an overview of your videos.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link href="/videos?upload=true">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Video
          </Button>
        </Link>
        <Link href="/videos">
          <Button variant="outline">View All Videos</Button>
        </Link>
      </div>

      {/* Recent Videos */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Videos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSpinner />
          ) : recentVideos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No videos yet. Upload your first video!</p>
          ) : (
            <div className="space-y-4">
              {recentVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{video.title || video.filename}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(video.createdAt)} • {video.status}
                    </p>
                  </div>
                  <Link href={`/videos/${video.id}`}>
                    <Button variant="ghost" size="sm">View</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

