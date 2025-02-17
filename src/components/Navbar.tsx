'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import { isAuthenticated } from '@/utils/auth';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated()) {
        setUser(null);
        return;
      }

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch user');

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-violet-100 dark:border-violet-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg" // You'll need to add your logo
              alt="Meditation App Logo"
              width={32}
              height={32}
              className="dark:invert"
            />
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              MindfulSpace
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-8">
            <Link 
              href="/courses" 
              className="text-gray-600 hover:text-violet-600 dark:text-gray-300 dark:hover:text-violet-400 transition-colors"
            >
              Courses
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            <SearchBar />
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <Image
                    src={user.avatar || '/Default-Avatar.jpg'}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <svg
                    className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''} text-white`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="text-gray-600 hover:text-violet-600 dark:text-gray-300 dark:hover:text-violet-400 transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  href="/signup"
                  className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-full transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 