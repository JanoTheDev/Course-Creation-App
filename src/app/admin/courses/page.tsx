'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import AdminProtected from '@/components/AdminProtected';

interface Course {
  _id?: string;
  title: string;
  description: string;
  image: string;
  instructorName: string;
  privacy: 'public' | 'unlisted' | 'private';
  videos: Array<{
    title: string;
    url: string;
    bio: string;
  }>;
  createdAt?: string;
  price: number;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const searchLower = search.toLowerCase();
    const filtered = courses.filter(course => 
      course.title.toLowerCase().includes(searchLower) ||
      course.instructorName.toLowerCase().includes(searchLower)
    );
    setFilteredCourses(filtered);
  }, [search, courses]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('/api/admin/courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch courses');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
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

  return (
    <AdminProtected>
      <PageLayout>
        <AdminLayout>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl font-bold text-white">Courses</h1>
              <div className="flex gap-4 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search courses or instructors..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white flex-1 sm:w-64"
                />
                <Link
                  href="/admin/courses/new"
                  className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  Create Course
                </Link>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-gray-800 rounded-lg overflow-hidden border border-white/10 hover:border-violet-500/50 transition-colors"
                >
                  <div className="aspect-video relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        course.privacy === 'private' 
                          ? 'bg-red-500/20 text-red-300'
                          : course.privacy === 'unlisted'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-green-500/20 text-green-300'
                      }`}>
                        {course.privacy}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-white mb-2">{course.title}</h2>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300">{course.instructorName}</span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {course.videos.length} video{course.videos.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
                      <button
                        onClick={() => router.push(`/admin/courses/${course._id}`)}
                        className="text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        Manage Course
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">
                  {courses.length === 0 
                    ? 'No courses have been created yet.'
                    : 'No courses match your search.'}
                </p>
              </div>
            )}
          </div>
        </AdminLayout>
      </PageLayout>
    </AdminProtected>
  );
}