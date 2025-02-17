'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import AdminLayout from '@/components/AdminLayout';
import VideoUpload from '@/components/VideoUpload';
import AdminProtected from '@/components/AdminProtected';

interface Course {
  _id: string;
  title: string;
  description: string;
  image: string;
  instructorName: string;
  privacy: 'public' | 'unlisted' | 'private';
  videos: Array<{
    title: string;
    url: string;
    bio: string;
    editing?: boolean;
  }>;
  price: number;
}

export default function ManageCourse({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentVideo, setCurrentVideo] = useState({
    title: '',
    url: '',
    bio: '',
  });
  const [formData, setFormData] = useState<Course>({
    _id: '',
    title: '',
    description: '',
    image: '',
    instructorName: '',
    privacy: 'public',
    videos: [],
    price: 0,
  });

  const resolvedParams = use(params);

  useEffect(() => {
    fetchCourse();
  }, [resolvedParams.id]);

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`/api/courses/${resolvedParams.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch course');
      
      const data = await response.json();
      setCourse(data);
      setFormData({
        _id: data._id,
        title: data.title || '',
        description: data.description || '',
        image: data.image || '',
        instructorName: data.instructorName || '',
        privacy: data.privacy || 'public',
        videos: data.videos || [],
        price: data.price || 0,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch course');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    // If price is greater than 0, force privacy to private
    const updatedFormData = {
      ...formData,
      privacy: formData.privacy
    };

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await fetch(`/api/courses/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedFormData),
      });

      // If we get here, the update was successful
      setEditMode(false);
      setCourse(updatedFormData);
      setFormData(updatedFormData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update course');
    }
  };

  const addVideo = () => {
    if (!course || !currentVideo.title || !currentVideo.url || !currentVideo.bio) return;
    
    const newVideo = {
      title: currentVideo.title.trim(),
      url: currentVideo.url,
      bio: currentVideo.bio.trim()
    };
    
    setCourse(prev => prev ? {
      ...prev,
      videos: [...prev.videos, newVideo]
    } : null);
    
    setFormData(prev => ({
      ...prev,
      videos: [...prev.videos, newVideo]
    }));
    
    setCurrentVideo({ 
      title: '', 
      url: '', 
      bio: '' 
    });
  };

  const removeVideo = (index: number) => {
    if (!course) return;
    
    const updatedVideos = course.videos.filter((_, i) => i !== index);
    
    setCourse(prev => prev ? {
      ...prev,
      videos: updatedVideos
    } : null);
    
    setFormData(prev => ({
      ...prev,
      videos: updatedVideos
    }));
  };

  const startEditingVideo = (index: number) => {
    if (!course) return;
    setCourse(prev => {
      if (!prev) return null;
      const newVideos = [...prev.videos];
      newVideos[index] = { ...newVideos[index], editing: true };
      return { ...prev, videos: newVideos };
    });
  };

  const updateVideo = (index: number, updates: Partial<{ title: string; bio: string }>) => {
    if (!course) return;
    setCourse(prev => {
      if (!prev) return null;
      const newVideos = [...prev.videos];
      newVideos[index] = { ...newVideos[index], ...updates };
      return { ...prev, videos: newVideos };
    });
  };

  const saveVideoEdit = (index: number) => {
    if (!course) return;
    setCourse(prev => {
      if (!prev) return null;
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

  const handleDeleteCourse = async () => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`/api/courses/${resolvedParams.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      router.push('/admin/courses');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete course');
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (!course) {
    return (
      <PageLayout>
        <AdminLayout>
          <div className="p-6">
            <div className="text-red-400">Course not found</div>
          </div>
        </AdminLayout>
      </PageLayout>
    );
  }

  return (
    <AdminProtected>
      <PageLayout>
        <AdminLayout>
          <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">
                {editMode ? 'Edit Course' : course.title}
              </h1>
              <div className="flex gap-4">
                <button
                  onClick={() => router.back()}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {editMode ? 'Cancel Editing' : 'Edit Course'}
                </button>
                <button
                  onClick={handleDeleteCourse}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Delete Course
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                {error}
              </div>
            )}

            {editMode ? (
              <form onSubmit={handleUpdateCourse} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      {(['public', 'unlisted', 'private'] as const).map((privacy) => (
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
                            onChange={(e) => setFormData({ ...formData, privacy: e.target.value as typeof privacy })}
                            className="sr-only"
                          />
                          <span className="text-sm capitalize">{privacy}</span>
                        </label>
                      ))}
                    </div>
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
                            privacy: formData.privacy
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
                          onVideoUploaded={(url) => {
                            setCurrentVideo(prev => ({ 
                              ...prev, 
                              url: url 
                            }));
                          }}
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

                      {course.videos.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium text-gray-200 mb-2">
                            Course Videos ({course.videos.length})
                          </h4>
                          {course.videos.map((video, index) => (
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

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
                  <button
                    type="submit"
                    className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <h2 className="text-lg font-medium text-white mb-2">Description</h2>
                  <p className="text-gray-300">{course.description}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h2 className="text-lg font-medium text-white mb-2">Instructor</h2>
                  <p className="text-gray-300">{course.instructorName}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h2 className="text-lg font-medium text-white mb-4">Videos</h2>
                  <div className="space-y-4">
                    {course.videos.map((video, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div>
                          <h3 className="text-white font-medium">{video.title}</h3>
                          <p className="text-gray-400 text-sm">{video.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </AdminLayout>
      </PageLayout>
    </AdminProtected>
  );
} 