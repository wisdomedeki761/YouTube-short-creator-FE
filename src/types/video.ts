export type VideoStatus =
  | 'processing'
  | 'completed'
  | 'pending_approval'
  | 'rejected'
  | 'failed'
  | 'posted';

export interface Video {
  id: string;
  title: string;
  filename?: string;
  status: VideoStatus;
  processingProgress?: number;
  editedVideoUrl?: string | null;
  editedVideoIpfsHash?: string | null;
  youtubeUrl?: string | null;
  facebookUrl?: string | null;
  createdAt: string;
  updatedAt?: string;
  processedAt?: string | null;
  userId: string;
  duration?: number;
  fileSize?: number;
  thumbnail?: string;
}

export interface ProcessingLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
}

export interface PostedPlatform {
  platform: 'youtube' | 'facebook';
  url: string;
  postedAt: string;
}

export interface VideoMetadata {
  title?: string;
  description?: string;
  tags?: string[];
}

