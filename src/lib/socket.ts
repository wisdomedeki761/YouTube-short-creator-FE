import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { API_URL } from './constants';

let socket: Socket | null = null;

export interface VideoProgress {
  videoId: string;
  stage: string;
  progress: number;
  message: string;
  timestamp: string;
}

export interface VideoError {
  videoId: string;
  message: string;
  timestamp: string;
}

/**
 * Get or create the Socket.io connection
 */
export function getSocket(): Socket | null {
  // Return existing connected socket
  if (socket?.connected) return socket;

  // Disconnect and clear old socket if it exists but isn't connected
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  const token = useAuthStore.getState().token;
  if (!token) return null;

  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || API_URL || 'http://localhost:8080';

  socket = io(wsUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    console.log('✅ WebSocket connected');
  });

  socket.on('disconnect', () => {
    console.log('🔌 WebSocket disconnected');
  });

  socket.on('connect_error', (err) => {
    console.warn('⚠️  WebSocket connection error:', err.message);
  });

  return socket;
}

/**
 * Subscribe to video processing progress
 */
export function subscribeToProgress(
  videoId: string,
  onProgress: (data: VideoProgress) => void,
  onError?: (data: VideoError) => void
): () => void {
  const s = getSocket();
  if (!s) return () => {};

  // Join video room
  s.emit('subscribe:video', videoId);

  const progressHandler = (data: VideoProgress) => {
    if (data.videoId === videoId) {
      onProgress(data);
    }
  };

  const errorHandler = (data: VideoError) => {
    if (data.videoId === videoId && onError) {
      onError(data);
    }
  };

  s.on('video:progress', progressHandler);
  s.on('video:error', errorHandler);

  // Return cleanup function
  return () => {
    s.emit('unsubscribe:video', videoId);
    s.off('video:progress', progressHandler);
    s.off('video:error', errorHandler);
  };
}

/**
 * Disconnect WebSocket
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
