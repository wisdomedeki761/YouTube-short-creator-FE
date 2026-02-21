'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Download, Trash2, Eye } from 'lucide-react';
import { Video } from '@/types/video';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatDuration, formatFileSize } from '@/utils/helpers';
import { VIDEO_STATUS_COLORS } from '@/lib/constants';
import { cn } from '@/utils/helpers';

interface VideoCardProps {
  video: Video;
  onDelete?: (id: string) => void;
  viewMode?: 'grid' | 'list';
  processingProgress?: number;
  processingMessage?: string;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onDelete,
  viewMode = 'grid',
  processingProgress,
  processingMessage,
}) => {
  const statusColor = VIDEO_STATUS_COLORS[video.status] || VIDEO_STATUS_COLORS.processing;
  const isProcessing = video.status === 'processing';
  const progress = processingProgress ?? video.processingProgress ?? 0;

  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow">
        <div className="relative h-20 w-32 flex-shrink-0 rounded overflow-hidden bg-gray-100">
          {video.thumbnail ? (
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Play className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{video.title || 'Untitled Video'}</h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <span>{formatDate(video.createdAt)}</span>
            {video.duration && <span>• {formatDuration(video.duration)}</span>}
            {video.fileSize && <span>• {formatFileSize(video.fileSize)}</span>}
          </div>
          {isProcessing && progress > 0 && (
            <div className="mt-2 w-full max-w-xs">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{processingMessage || 'Processing...'}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full transition-all duration-300 bg-blue-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn(statusColor)}>{video.status}</Badge>
          <Link href={`/videos/${video.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          {video.status === 'completed' && (
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(video.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/videos/${video.id}`}>
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
          {video.thumbnail ? (
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Play className="h-12 w-12 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>
      </Link>
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-medium text-gray-900 line-clamp-2 flex-1">
            {video.title || 'Untitled Video'}
          </h3>
          <Badge className={cn('ml-2', statusColor)}>{video.status}</Badge>
        </div>

        {/* Processing progress bar */}
        {isProcessing && progress > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{processingMessage || 'Processing...'}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full transition-all duration-300 bg-blue-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mb-3 space-y-1 text-sm text-gray-500">
          <p>{formatDate(video.createdAt)}</p>
          {video.duration && <p>Duration: {formatDuration(video.duration)}</p>}
          {video.fileSize && <p>Size: {formatFileSize(video.fileSize)}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/videos/${video.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
          </Link>
          {video.status === 'completed' && (
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(video.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
