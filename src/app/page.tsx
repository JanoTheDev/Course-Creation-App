'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import CourseCard from '@/components/CourseCard';
import Link from 'next/link';

interface Course {
  _id: string;
  title: string;
  description: string;
  image: string;
  instructorName: string;
  privacy: 'public' | 'unlisted' | 'private';
  price: number;
  videos: Array<{
    title: string;
    url: string;
    bio: string;
  }>;
  createdAt: string;
  hasAccess: boolean;
}

export default function HomePage() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch('/api/courses', {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        if (!response.ok) throw new Error('Failed to fetch courses');
        
        const data = await response.json();
        
        // Get courses with most videos as featured
        const featured = [...data.courses]
          .sort((a, b) => b.videos.length - a.videos.length)
          .slice(0, 6); // Show more featured courses since we removed latest
        
        setFeaturedCourses(featured);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
      <div className="min-h-screen bg-gradient-to-br from-violet-900/20 to-black/20">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-violet-900/50 to-black/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                Premium Learning Experience
              </h1>
              <p className="text-xl text-violet-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                Access high-quality courses from industry experts. Start your journey today with our curated selection of premium content.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/courses"
                  className="inline-block bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-lg transition-colors text-lg font-medium shadow-lg hover:shadow-xl"
                >
                  Browse Courses
                </Link>
                <Link
                  href="/about"
                  className="inline-block bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg transition-colors text-lg font-medium backdrop-blur-sm"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Featured Courses */}
          <section>
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Featured Courses</h2>
                <p className="text-violet-300">Explore our most popular and comprehensive courses</p>
              </div>
              <Link 
                href="/courses" 
                className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors font-medium"
              >
                View All Courses
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <div 
                  key={course._id} 
                  className="group hover:transform hover:scale-105 transition-all duration-300"
                >
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

            {featuredCourses.length === 0 && (
              <div className="text-center py-12 bg-white/5 rounded-lg">
                <p className="text-gray-400 text-lg">
                  No courses available at the moment.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
