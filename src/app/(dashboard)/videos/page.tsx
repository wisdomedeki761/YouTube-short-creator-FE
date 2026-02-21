'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { VideoCard } from '@/components/dashboard/VideoCard';
import { VideoUploader } from '@/components/dashboard/VideoUploader';
import { ApprovalGuard } from '@/components/auth/ApprovalGuard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/common/Pagination';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Upload, Grid, List } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { subscribeToProgress, VideoProgress } from '@/lib/socket';
import toast from 'react-hot-toast';

interface VideoProgressState {
  [videoId: string]: {
    progress: number;
    message: string;
  };
}

export default function VideosPage() {
  const searchParams = useSearchParams();
  const { videos, loading, fetchVideos } = useUserStore();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(
    searchParams.get('upload') === 'true'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [videoProgress, setVideoProgress] = useState<VideoProgressState>({});
  const unsubscribesRef = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    fetchVideos({ status: statusFilter !== 'all' ? statusFilter : undefined, search });
  }, [statusFilter, search, fetchVideos]);

  // Subscribe to WebSocket progress for all processing videos
  useEffect(() => {
    const processingVideos = videos.filter((v) => v.status === 'processing');

    // Subscribe to new processing videos
    processingVideos.forEach((video) => {
      if (!unsubscribesRef.current.has(video.id)) {
        const unsubscribe = subscribeToProgress(
          video.id,
          (data: VideoProgress) => {
            setVideoProgress((prev) => ({
              ...prev,
              [data.videoId]: {
                progress: data.progress,
                message: data.message,
              },
            }));

            // If processing is complete, refresh videos list
            if (data.stage === 'complete' || data.progress >= 100) {
              fetchVideos();
              // Cleanup subscription
              const unsub = unsubscribesRef.current.get(video.id);
              if (unsub) {
                unsub();
                unsubscribesRef.current.delete(video.id);
              }
            }
          }
        );
        unsubscribesRef.current.set(video.id, unsubscribe);
      }
    });

    // Cleanup subscriptions for videos that are no longer processing
    unsubscribesRef.current.forEach((unsub, videoId) => {
      const stillProcessing = processingVideos.some((v) => v.id === videoId);
      if (!stillProcessing) {
        unsub();
        unsubscribesRef.current.delete(videoId);
      }
    });
  }, [videos, fetchVideos]);

  // Cleanup all subscriptions on unmount
  useEffect(() => {
    return () => {
      unsubscribesRef.current.forEach((unsub) => unsub());
      unsubscribesRef.current.clear();
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      await apiClient.deleteVideo(id);
      toast.success('Video deleted');
      fetchVideos();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete video');
    }
  };

  const filteredVideos = videos.filter((video) => {
    if (statusFilter !== 'all' && video.status !== statusFilter) return false;
    if (search && !video.title?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <ApprovalGuard>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Videos</h1>
          <p className="mt-2 text-gray-600">Manage and view all your videos</p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Video
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <Input
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'processing', label: 'Processing' },
              { value: 'completed', label: 'Completed' },
              { value: 'pending_approval', label: 'Pending Approval' },
              { value: 'rejected', label: 'Rejected' },
            ]}
            className="w-48"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Video List */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredVideos.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">No videos found. Upload your first video!</p>
        </div>
      ) : (
        <>
          <div
            className={
              viewMode === 'grid'
                ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
                : 'space-y-4'
            }
          >
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                viewMode={viewMode}
                onDelete={handleDelete}
                processingProgress={videoProgress[video.id]?.progress}
                processingMessage={videoProgress[video.id]?.message}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      <VideoUploader
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
      </div>
    </ApprovalGuard>
  );
}
