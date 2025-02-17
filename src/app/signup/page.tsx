'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/utils/auth';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';

export default function Signup() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    submit: '',
  });

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData(prev => ({ ...prev, password }));
    setErrors(prev => ({ ...prev, password: validatePassword(password) }));
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    setFormData(prev => ({ ...prev, confirmPassword }));
    setErrors(prev => ({
      ...prev,
      confirmPassword: confirmPassword !== formData.password ? 'Passwords do not match' : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = formData.password !== formData.confirmPassword 
      ? 'Passwords do not match' 
      : '';

    setErrors({
      password: passwordError,
      confirmPassword: confirmPasswordError,
      submit: '',
    });

    if (passwordError || confirmPasswordError) {
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Store token in localStorage or sessionStorage
      localStorage.setItem('token', data.token);
      
      // Redirect to home page
      window.location.href = '/';
      
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Failed to create account',
      }));
    }
  };

  return (
    <PageLayout>
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-white mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white placeholder-white/50"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-white mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white placeholder-white/50"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-white mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 bg-white/10 border ${errors.password ? 'border-red-500' : 'border-white/20'} rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white placeholder-white/50`}
                placeholder="Create a password"
                required
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-medium text-white mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full px-4 py-2 bg-white/10 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/20'} rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white placeholder-white/50`}
                placeholder="Confirm your password"
                required
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!!errors.password || !!errors.confirmPassword}
            >
              Create Account
            </button>
          </form>

          <p className="mt-8 text-center text-white">
            Already have an account?{' '}
            <Link 
              href="/login"
              className="text-violet-300 hover:text-violet-200 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
} 