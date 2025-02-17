'use client';

import { useState, useRef, useCallback } from 'react';

interface VideoUploadProps {
  onVideoUploaded: (url: string) => void;
}

export default function VideoUpload({ onVideoUploaded }: VideoUploadProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxFileSize = 800 * 1024 * 1024; // 800MB

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      setError('Please upload a video file');
      return;
    }

    if (file.size > maxFileSize) {
      setError(`File size must be less than ${formatBytes(maxFileSize)}`);
      return;
    }

    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(Math.round(progress));
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          onVideoUploaded(data.url);
          setUrl('');
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            setUploadProgress(0);
          }, 3000);
        } else {
          throw new Error('Upload failed');
        }
      };

      xhr.onerror = () => {
        throw new Error('Upload failed');
      };

      xhr.open('POST', '/api/videos/upload');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload video');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!url) {
        throw new Error('Please enter a video URL');
      }

      try {
        new URL(url);
      } catch {
        throw new Error('Please enter a valid URL');
      }

      onVideoUploaded(url);
      setUrl('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save video URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          w-full h-32 border-2 border-dashed rounded-lg 
          flex flex-col items-center justify-center cursor-pointer 
          transition-all duration-200
          ${isDragging 
            ? 'border-violet-500 bg-violet-500/10' 
            : 'border-gray-600 hover:border-violet-500'
          }
          ${showSuccess ? 'border-green-500 bg-green-500/10' : ''}
        `}
      >
        {loading ? (
          <div className="w-full px-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 text-center">
              {formatBytes(maxFileSize * (1 - uploadProgress / 100))} remaining
            </div>
          </div>
        ) : showSuccess ? (
          <div className="flex items-center gap-2 text-green-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Upload successful!</span>
          </div>
        ) : (
          <>
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-400">
              Drag & drop a video file or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Maximum file size: {formatBytes(maxFileSize)}
            </p>
          </>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-900 text-gray-400">Or paste a URL</span>
        </div>
      </div>

      <div className="space-y-2" onSubmit={handleUrlSubmit}>
        <input
          type="text"
          placeholder="Video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white"
        />
        <button
          type="button"
          onClick={handleUrlSubmit}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Video URL
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
        className="hidden"
      />

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
} 