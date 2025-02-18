'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import CourseCard from '@/components/CourseCard';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
        
        const featured = [...data.courses]
          .sort((a, b) => b.videos.length - a.videos.length)
          .slice(0, 6);
        
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
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-violet-900/10 to-black/10">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-violet-900/30 to-black/30 py-20 lg:py-32">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="text-center space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                Elevate Your Learning <br />
                <span className="bg-gradient-to-r from-violet-400 to-violet-600 text-transparent bg-clip-text">Experience</span>
              </h1>
              <p className="text-xl md:text-2xl text-violet-200 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
                Access high-quality courses from industry experts. Transform your skills with our curated selection of premium content.
              </p>
              <div className="flex gap-6 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/courses"
                    className="inline-flex items-center bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-xl transition-colors text-lg font-medium shadow-lg hover:shadow-violet-500/25"
                  >
                    Browse Courses
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/about"
                    className="inline-flex items-center bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl transition-colors text-lg font-medium backdrop-blur-sm border border-white/10"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Featured Courses */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-16">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold text-white mb-2">Featured Courses</h2>
                <p className="text-lg text-violet-300 font-light">Explore our most comprehensive learning paths</p>
              </div>
              <Link 
                href="/courses" 
                className="group flex items-center gap-3 text-violet-400 hover:text-violet-300 transition-colors font-medium text-lg"
              >
                View All Courses
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course, index) => (
                <motion.div 
                  key={course._id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group hover:transform hover:scale-[1.02] transition-all duration-300"
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
                </motion.div>
              ))}
            </div>

            {featuredCourses.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm"
              >
                <p className="text-gray-400 text-xl font-light">
                  No courses available at the moment.
                </p>
              </motion.div>
            )}
          </motion.section>
        </div>
      </div>
    </PageLayout>
  );
}