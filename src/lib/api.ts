import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_URL, API_TIMEOUT, STORAGE_KEYS } from './constants';
import { useAuthStore } from '@/store/authStore';
import type { ApiResponse, PaginatedResponse, FilterOptions } from '@/types/api';
import type { Video, VideoMetadata } from '@/types/video';
import type { User, ApiKey } from '@/types/user';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add token
    this.client.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Try to refresh token
          try {
            await useAuthStore.getState().refreshToken();
            const token = useAuthStore.getState().token;
            if (token && error.config) {
              error.config.headers.Authorization = `Bearer ${token}`;
              return this.client.request(error.config);
            }
          } catch {
            useAuthStore.getState().logout();
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async login(email: string, password: string): Promise<ApiResponse> {
    const response = await this.client.post('/api/auth/login', { email, password });
    return response.data;
  }

  async loginWithGoogle(token: string): Promise<ApiResponse> {
    const response = await this.client.post('/api/auth/google', { token });
    return response.data;
  }

  async register(email: string, password: string, username?: string): Promise<ApiResponse> {
    const response = await this.client.post('/api/auth/register', { email, password, username });
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/api/auth/logout');
    useAuthStore.getState().logout();
  }

  async refreshToken(): Promise<ApiResponse> {
    const response = await this.client.post('/api/auth/refresh');
    return response.data;
  }

  async requestPasswordReset(email: string): Promise<ApiResponse> {
    const response = await this.client.post('/api/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    const response = await this.client.post('/api/auth/reset-password', { token, newPassword });
    return response.data;
  }

  // Video methods
  async getVideos(filters?: FilterOptions, page = 1, limit = 10): Promise<PaginatedResponse<Video>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.sortBy && { sortBy: filters.sortBy }),
      ...(filters?.sortOrder && { sortOrder: filters.sortOrder }),
    });
    const response = await this.client.get(`/api/videos?${params.toString()}`);
    return response.data;
  }

  async getVideoById(id: string): Promise<Video> {
    const response = await this.client.get(`/api/videos/${id}`);
    return response.data?.data || response.data;
  }

  async uploadVideo(
    file: File, 
    metadata?: VideoMetadata,
    onProgress?: (progress: number) => void
  ): Promise<Video> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('video', file);
      if (metadata) {
        formData.append('metadata', JSON.stringify(metadata));
      }
      
      // Get token for authorization
      const token = useAuthStore.getState().token;
      const apiUrl = API_URL || 'http://localhost:8080';
      
      // Use XMLHttpRequest for upload progress tracking
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = Math.round((e.loaded * 100) / e.total);
          onProgress(percentComplete);
        }
      });
      
      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            const videoData = data.body?.data || data.data || data;
            resolve(videoData);
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            const errorMsg = errorData.body?.error?.message || errorData.message || 'Upload failed';
            reject(new Error(errorMsg));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      });
      
      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });
      
      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });
      
      // Open and send request
      xhr.open('POST', `${apiUrl}/api/videos/upload`);
      xhr.setRequestHeader('Authorization', token ? `Bearer ${token}` : '');
      // Don't set Content-Type - let browser set it with boundary
      xhr.send(formData);
    });
  }

  async approveVideo(
    id: string,
    platforms: string[],
    youtubeAccounts?: string[],
    facebookAccounts?: string[],
    title?: string,
    description?: string
  ): Promise<any> {
    const response = await this.client.post(`/api/videos/${id}/approve`, {
      platforms,
      youtubeAccounts: youtubeAccounts || undefined,
      facebookAccounts: facebookAccounts || undefined,
      title: title || undefined,
      description: description || undefined
    });
    return response.data?.data || response.data;
  }

  async rejectVideo(id: string): Promise<Video> {
    const response = await this.client.post(`/api/videos/${id}/reject`);
    return response.data;
  }

  async deleteVideo(id: string): Promise<void> {
    await this.client.delete(`/api/videos/${id}`);
  }

  async downloadVideo(id: string): Promise<{ downloadUrl: string }> {
    const response = await this.client.get(`/api/videos/${id}/download`);
    return response.data?.data || response.data;
  }

  // User methods
  async getProfile(): Promise<User> {
    const response = await this.client.get('/api/users/profile');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.client.put('/api/users/profile', data);
    return response.data;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse> {
    const response = await this.client.post('/api/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  }

  // API Keys methods
  async getApiKeys(): Promise<ApiKey[]> {
    const response = await this.client.get('/api/users/api-keys');
    // Backend returns: { body: { success: true, data: [...] } }
    const data = response.data?.body?.data || response.data?.data || response.data || [];
    return Array.isArray(data) ? data : [];
  }

  async addApiKey(platform: 'youtube' | 'facebook', key: string): Promise<ApiKey> {
    const response = await this.client.post('/api/users/api-keys', { platform, apiKey: key });
    // Backend returns: { body: { success: true, data: {...} } }
    return response.data?.body?.data || response.data?.data || response.data;
  }

  async deleteApiKey(id: string): Promise<void> {
    await this.client.delete(`/api/users/api-keys/${id}`);
  }

  async testApiKey(id: string): Promise<ApiResponse> {
    const response = await this.client.post(`/api/users/api-keys/${id}/test`);
    return response.data;
  }

  async updateAccountTag(accountId: string, tag: string): Promise<ApiKey> {
    const response = await this.client.put(`/api/users/api-keys/${accountId}/tag`, { tag });
    return response.data?.data || response.data;
  }

  async startYouTubeOAuth(clientId: string, clientSecret: string, redirectUri: string): Promise<{ authUrl: string }> {
    const response = await this.client.post('/api/users/youtube/oauth/start', {
      clientId,
      clientSecret,
      redirectUri,
    });
    return response.data?.data || response.data;
  }

  async completeYouTubeOAuth(code: string, clientId: string, clientSecret: string, redirectUri: string, accountTag?: string): Promise<ApiKey> {
    const response = await this.client.post('/api/users/youtube/oauth/callback', {
      code,
      clientId,
      clientSecret,
      redirectUri,
      accountTag,
    });
    return response.data?.data || response.data;
  }

  async addYouTubeManual(clientId: string, clientSecret: string, accessToken: string, refreshToken: string, accountTag?: string): Promise<ApiKey> {
    const response = await this.client.post('/api/users/api-keys/youtube/manual', {
      clientId,
      clientSecret,
      accessToken,
      refreshToken,
      accountTag,
    });
    return response.data?.data || response.data;
  }

  // Admin methods
  async getUsers(filters?: FilterOptions, page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.search && { search: filters.search }),
    });
    const response = await this.client.get(`/api/admin/users?${params.toString()}`);
    return response.data;
  }

  async approveUser(userId: string): Promise<User> {
    const response = await this.client.post(`/api/admin/users/${userId}/approve`);
    return response.data?.data || response.data;
  }

  async rejectUser(userId: string): Promise<User> {
    const response = await this.client.post(`/api/admin/users/${userId}/reject`);
    return response.data?.data || response.data;
  }

  async revokeUser(userId: string): Promise<User> {
    const response = await this.client.post(`/api/admin/users/${userId}/revoke`);
    return response.data?.data || response.data;
  }

  async getFillerVideos(): Promise<any[]> {
    const response = await this.client.get('/api/admin/filler-videos');
    console.log('Filler videos response:', response.data); // Debug log
    // Backend returns: { body: { success: true, data: [...] } }
    const data = response.data?.body?.data || response.data?.data || response.data || [];
    const videosArray = Array.isArray(data) ? data : [];
    console.log('Parsed filler videos:', videosArray); // Debug log
    return videosArray;
  }

  async uploadFillerVideo(file: File, onProgress?: (progress: number) => void): Promise<any> {
    const formData = new FormData();
    formData.append('video', file);
    const response = await this.client.post('/api/admin/filler-videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutes for large videos
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return response.data;
  }

  async deleteFillerVideo(id: string): Promise<void> {
    await this.client.delete(`/api/admin/filler-videos/${id}`);
  }

  async reorderFillerVideos(order: string[]): Promise<void> {
    await this.client.put('/api/admin/filler-videos/reorder', { order });
  }

  async getStats(dateRange?: { start: string; end: string }): Promise<any> {
    const params = dateRange
      ? new URLSearchParams({
          start: dateRange.start,
          end: dateRange.end,
        })
      : '';
    const response = await this.client.get(`/api/admin/stats?${params.toString()}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();

