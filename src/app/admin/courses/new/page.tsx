'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import AdminLayout from '@/components/AdminLayout';
import ImageUpload from '@/components/ImageUpload';
import VideoUpload from '@/components/VideoUpload';
import AdminProtected from '@/components/AdminProtected';

interface Instructor {
  _id: string;
  name: string;
  image: string;
}

interface VideoUploadData {
  title: string;
  url: string;
  bio: string;
  editing?: boolean;
}

type CoursePrivacy = 'public' | 'unlisted' | 'private';

interface CourseFormData {
  title: string;
  description: string;
  image: string;
  instructorName: string;
  privacy: CoursePrivacy;
  videos: VideoUploadData[];
  price: number;
}

export default function NewCourse() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    image: '',
    instructorName: '',
    privacy: 'public',
    videos: [],
    price: 0,
  });
  const [currentVideo, setCurrentVideo] = useState({
    title: '',
    url: '',
    bio: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          videos: formData.videos.map(video => ({
            ...video,
            title: video.title.trim(),
            bio: video.bio.trim()
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create course');
      }

      router.push('/admin/courses');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const addVideo = () => {
    if (currentVideo.title && currentVideo.url && currentVideo.bio) {
      setFormData(prev => ({
        ...prev,
        videos: [...prev.videos, { ...currentVideo }]
      }));
      setCurrentVideo({ title: '', url: '', bio: '' });
    }
  };

  const removeVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  const startEditingVideo = (index: number) => {
    setFormData(prev => {
      const newVideos = [...prev.videos];
      newVideos[index] = { ...newVideos[index], editing: true };
      return { ...prev, videos: newVideos };
    });
  };

  const updateVideo = (index: number, updates: Partial<{ title: string; bio: string }>) => {
    setFormData(prev => {
      const newVideos = [...prev.videos];
      newVideos[index] = { ...newVideos[index], ...updates };
      return { ...prev, videos: newVideos };
    });
  };

  const saveVideoEdit = (index: number) => {
    setFormData(prev => {
      const newVideos = [...prev.videos];
      newVideos[index] = { 
        ...newVideos[index], 
        editing: false,
        title: newVideos[index].title.trim(),
        bio: newVideos[index].bio.trim()
      };
      return { ...prev, videos: newVideos };
    });
  };

  return (
    <AdminProtected>
      <PageLayout>
        <AdminLayout>
          <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">Create New Course</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white"
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Privacy Setting
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['public', 'unlisted', 'private'] as CoursePrivacy[]).map((privacy) => (
                        <label
                          key={privacy}
                          className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-colors ${
                            formData.privacy === privacy
                              ? 'bg-violet-500/20 border border-violet-500/30'
                              : 'bg-white/5 border border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <input
                            type="radio"
                            name="privacy"
                            value={privacy}
                            checked={formData.privacy === privacy}
                            onChange={(e) => setFormData({ ...formData, privacy: e.target.value as CoursePrivacy })}
                            className="sr-only"
                          />
                          <div className="flex items-center gap-2">
                            <svg 
                              className="w-4 h-4" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              {privacy === 'public' && (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              )}
                              {privacy === 'unlisted' && (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                />
                              )}
                              {privacy === 'private' && (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                              )}
                            </svg>
                            <span className="text-sm capitalize">{privacy}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      {formData.privacy === 'public' && 'Course will be visible to everyone'}
                      {formData.privacy === 'unlisted' && 'Course can only be accessed with a direct link'}
                      {formData.privacy === 'private' && 'Course is only visible to admins'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Instructor Name
                    </label>
                    <input
                      type="text"
                      value={formData.instructorName}
                      onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Price (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-400">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => {
                          const newPrice = parseFloat(e.target.value) || 0;
                          setFormData({
                            ...formData,
                            price: newPrice,
                            privacy: newPrice > 0 ? 'private' : formData.privacy
                          });
                        }}
                        className="w-full pl-8 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white"
                        required
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-400">
                      Set to 0 for free courses
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Course Thumbnail
                    </label>
                    <ImageUpload
                      onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
                      currentImage={formData.image}
                    />
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h3 className="text-lg font-medium text-white mb-4">Course Videos</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Video Title"
                          value={currentVideo.title}
                          onChange={(e) => setCurrentVideo({ ...currentVideo, title: e.target.value })}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white"
                        />
                        <textarea
                          placeholder="Video Description"
                          value={currentVideo.bio}
                          onChange={(e) => setCurrentVideo({ ...currentVideo, bio: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white"
                        />
                        <VideoUpload
                          onVideoUploaded={(url) => setCurrentVideo(prev => ({ ...prev, url }))}
                        />
                        <button
                          type="button"
                          onClick={addVideo}
                          disabled={!currentVideo.title || !currentVideo.url || !currentVideo.bio}
                          className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Add Video
                        </button>
                      </div>

                      {formData.videos.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium text-gray-200 mb-2">
                            Added Videos ({formData.videos.length})
                          </h4>
                          {formData.videos.map((video, index) => (
                            <div
                              key={index}
                              className="p-3 bg-white/5 rounded-lg space-y-2"
                            >
                              {video.editing ? (
                                <>
                                  <input
                                    type="text"
                                    value={video.title}
                                    onChange={(e) => updateVideo(index, { title: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white mb-2"
                                  />
                                  <textarea
                                    value={video.bio}
                                    onChange={(e) => updateVideo(index, { bio: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white"
                                  />
                                  <div className="flex justify-end gap-2 mt-2">
                                    <button
                                      type="button"
                                      onClick={() => saveVideoEdit(index)}
                                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors text-sm"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => removeVideo(index)}
                                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors text-sm"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 mr-4">
                                    <h4 className="text-white font-medium">{video.title}</h4>
                                    <p className="text-gray-400 text-sm line-clamp-1">{video.bio}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => startEditingVideo(index)}
                                      className="text-violet-400 hover:text-violet-300 transition-colors"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => removeVideo(index)}
                                      className="text-red-400 hover:text-red-300 transition-colors"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </AdminLayout>
      </PageLayout>
    </AdminProtected>
  );
} 