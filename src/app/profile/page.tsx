'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { User } from '@/types/user';
import Image from 'next/image';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    const mockUser = {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/default-avatar.png',
      createdAt: new Date(),
    };
    setUser(mockUser);
  }, []);

  if (!user) return null;

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center md:flex-row md:items-start gap-8">
            <div className="relative w-32 h-32">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 bg-violet-600 p-2 rounded-full text-white hover:bg-violet-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
              <p className="text-gray-400 mb-6">{user.email}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-1">Member Since</h3>
                  <p className="text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-1">Courses Completed</h3>
                  <p className="text-gray-400">12</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 