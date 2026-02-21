export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000');
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Video Editor';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
} as const;

export const VIDEO_FILE_TYPES = ['.mp4', '.mov', '.avi', '.mkv'];
export const MAX_VIDEO_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
export const MIN_VIDEO_DURATION = 10; // 10 seconds
export const MAX_VIDEO_DURATION = 300; // 5 minutes

export const VIDEO_STATUS_COLORS = {
  processing: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  pending_approval: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
  failed: 'bg-gray-100 text-gray-800',
  posted: 'bg-purple-100 text-purple-800',
} as const;

