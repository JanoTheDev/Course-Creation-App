'use client';

import { useEffect, useState, use } from 'react';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';

interface Course {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  privacy: string;
  instructor: {
    _id: string;
    name: string;
    image: string;
  };
  videoCount: number;
  hasAccess: boolean;
}

export default function PurchasePage({ params }: { params: Promise<{ id: string }> }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(`/api/courses/${resolvedParams.id}`, {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch course');
        }
        
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        
        setCourse(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch course');
        console.error('Failed to fetch course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (error || !course) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-400">{error || 'Course not found'}</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-xl p-8 border border-white/10">
          <h1 className="text-2xl font-bold text-white mb-6">Purchase Course</h1>
          
          <div className="mb-8">
            <h2 className="text-xl text-white mb-2">{course.title}</h2>
            <p className="text-gray-400 mb-4">{course.description}</p>
            <div className="text-2xl font-bold text-violet-400">${course.price.toFixed(2)}</div>
          </div>

          <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">How to Purchase</h3>
            <p className="text-gray-300 mb-4">
              To purchase this course, please contact us via WhatsApp. We'll guide you through the payment process.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=I'm interested in purchasing the course: ${course.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
              Contact on WhatsApp
            </a>
          </div>

          <Link
            href={`/courses`}
            className="text-violet-400 hover:text-violet-300 transition-colors"
          >
            ← Back to courses
          </Link>
        </div>
      </div>
    </PageLayout>
  );
} 