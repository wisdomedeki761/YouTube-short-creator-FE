'use client';

import React, { useState } from 'react';
import { Upload, X, FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/ui/Input';
import { validateVideoFile } from '@/utils/validators';
import { apiClient } from '@/lib/api';
import { useUserStore } from '@/store/userStore';
import toast from 'react-hot-toast';
import { formatFileSize } from '@/utils/helpers';

interface VideoUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'regular' | 'filler';
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ isOpen, onClose, mode = 'regular' }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { fetchVideos } = useUserStore();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validation = validateVideoFile(selectedFile);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    setFile(selectedFile);
    if (!title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    const validation = validateVideoFile(droppedFile);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    setFile(droppedFile);
    if (!title) {
      setTitle(droppedFile.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      if (mode === 'filler') {
        await apiClient.uploadFillerVideo(file, (progress) => {
          setUploadProgress(progress);
        });

        toast.success('Filler video uploaded successfully!');
        setUploadProgress(100);
        await new Promise(resolve => setTimeout(resolve, 1000));
        handleClose();
        return;
      }

      // Upload regular video - backend starts processing in background
      await apiClient.uploadVideo(
        file,
        { title: title || undefined },
        (progress) => {
          setUploadProgress(progress);
        }
      );

      // Close modal immediately - processing progress shows on video cards
      toast.success('Video uploaded! Processing in background...');
      await fetchVideos();
      handleClose();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Upload failed');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (isUploading) {
      toast.error('Please wait for upload to complete');
      return;
    }

    setFile(null);
    setTitle('');
    setUploadProgress(0);
    setIsUploading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'filler' ? 'Upload Filler Video' : 'Upload Video'}
      size="lg"
      preventClose={isUploading}
    >
      <div className="space-y-6">
        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors border-gray-300 hover:border-primary-400"
          >
            <input
              type="file"
              accept="video/mp4,video/mov,video/avi,video/mkv"
              onChange={handleFileSelect}
              className="hidden"
              id="video-upload"
            />
            <label htmlFor="video-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-lg font-medium text-gray-900">
                Drag & drop a video file
              </p>
              <p className="mt-2 text-sm text-gray-500">or click to browse</p>
              <p className="mt-1 text-xs text-gray-400">
                Supported: MP4, MOV, AVI, MKV (max 2GB)
              </p>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
              <FileVideo className="h-10 w-10 text-primary-600" />
              <div className="flex-1">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFile(null)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {mode === 'regular' && (
              <Input
                label="Video Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                disabled={isUploading}
              />
            )}
            {mode === 'filler' && (
              <p className="text-sm text-gray-500">
                Filler videos are automatically named (e.g., filler-video-001)
              </p>
            )}

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full transition-all bg-primary-600"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                isLoading={isUploading}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
