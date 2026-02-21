'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Modal } from '@/components/common/Modal';
import { VideoUploader } from '@/components/dashboard/VideoUploader';
import { Plus, Trash2, Play, RefreshCw } from 'lucide-react';
import { formatFileSize } from '@/utils/helpers';
import toast from 'react-hot-toast';

interface FillerVideo {
  id: string;
  filename: string;
  fileSize: number;
  createdAt: string;
  timesUsed?: number;
}

export default function AdminFillerVideosPage() {
  const [videos, setVideos] = useState<FillerVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const videosData = await apiClient.getFillerVideos();
      console.log('Fetched filler videos:', videosData); // Debug log
      // Ensure it's an array
      const videosArray = Array.isArray(videosData) ? videosData : [];
      console.log('Setting videos array:', videosArray); // Debug log
      setVideos(videosArray);
      
      // Don't show toast on initial load, only on refresh
      // if (videosArray.length > 0) {
      //   toast.success(`Loaded ${videosArray.length} filler video(s)`);
      // }
    } catch (error: any) {
      console.error('Fetch filler videos error:', error);
      toast.error(error.message || 'Failed to fetch filler videos');
      setVideos([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this filler video?')) return;
    try {
      await apiClient.deleteFillerVideo(id);
      toast.success('Filler video deleted');
      fetchVideos();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete filler video');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Filler Videos</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage filler videos used in processing</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchVideos}
            disabled={loading}
            title="Refresh list"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Upload Filler Video
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : !Array.isArray(videos) || videos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No filler videos uploaded yet.</p>
            <Button 
              className="mt-4" 
              onClick={() => setIsUploadModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Upload Your First Filler Video
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{videos.length}</span> filler video{videos.length !== 1 ? 's' : ''}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video, index) => (
              <Card key={video.id || video.filename || `video-${index}`}>
                <CardHeader>
                  <CardTitle className="text-base truncate" title={video.filename}>
                    {video.filename || 'Unknown Video'}
                  </CardTitle>
                </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video w-full rounded bg-gray-100 flex items-center justify-center">
                  <Play className="h-12 w-12 text-gray-400" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Size:</span>
                    <span className="text-gray-900">{formatFileSize(video.fileSize)}</span>
                  </div>
                  {video.timesUsed !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Times Used:</span>
                      <span className="text-gray-900">{video.timesUsed}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Uploaded:</span>
                    <span className="text-gray-900">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDelete(video.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
          </div>
        </>
      )}

      <VideoUploader
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          // Refresh videos list after closing modal
          setTimeout(() => {
            fetchVideos();
          }, 500);
        }}
        mode="filler"
      />
    </div>
  );
}

