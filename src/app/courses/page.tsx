'use client';

import { useState, useEffect } from 'react';
import CourseCard from '@/components/CourseCard';
import PageLayout from '@/components/PageLayout';

interface Course {
  _id: string;
  title: string;
  description: string;
  image: string;
  instructorName: string;
  videos: Array<{
    title: string;
    url: string;
    bio: string;
  }>;
  price: number;
  hasAccess: boolean;
  createdAt: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchQuery, selectedCategory, courses]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('/api/courses', {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data.courses);
      setFilteredCourses(data.courses);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch courses');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    const filtered = courses.filter(course => {
      const matchesSearch = 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructorName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || 
        (selectedCategory === 'Newest' && course.createdAt) ||
        (selectedCategory === 'Oldest' && course.createdAt);

      return matchesSearch && matchesCategory;
    });

    // Sort by date if needed
    if (selectedCategory === 'Newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (selectedCategory === 'Oldest') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    setFilteredCourses(filtered);
  };

  const categories = ['All', 'Newest', 'Oldest'];

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
    <PageLayout>
      <div className="relative min-h-screen bg-gradient-to-br from-violet-900/20 to-black/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">Meditation Courses</h1>
            <p className="text-violet-200 mb-8">Begin your journey to mindfulness</p>
            
            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by course title or instructor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white placeholder-white/50"
                  />
                  <svg
                    className="absolute right-3 top-3.5 h-5 w-5 text-white/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-violet-600 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {error && (
            <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              {error}
            </div>
          )}
          
          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course._id} className="group hover:transform hover:scale-105 transition-all duration-300">
                <CourseCard
                  id={course._id}
                  title={course.title}
                  description={course.description}
                  instructorName={course.instructorName}
                  image={course.image}
                  videoCount={course.videos.length}
                  price={course.price}
                  hasAccess={course.hasAccess}
                  href={`/courses/${course._id}`}
                />
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/70 text-lg">
                {courses.length === 0 
                  ? 'No courses available at the moment.'
                  : 'No courses found matching your search criteria.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
} 