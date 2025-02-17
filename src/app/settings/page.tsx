'use client';

import { useState } from 'react';
import PageLayout from '@/components/PageLayout';

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
  });

  const [theme, setTheme] = useState('system');

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
        
        <div className="space-y-8">
          {/* Account Settings */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Password
                </label>
                <button className="text-violet-400 hover:text-violet-300 transition-colors">
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Notifications</h2>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                  className="rounded border-white/20 bg-white/10 text-violet-500 focus:ring-violet-500"
                />
                <span className="ml-2 text-white">Email Notifications</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
                  className="rounded border-white/20 bg-white/10 text-violet-500 focus:ring-violet-500"
                />
                <span className="ml-2 text-white">Push Notifications</span>
              </label>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Appearance</h2>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 