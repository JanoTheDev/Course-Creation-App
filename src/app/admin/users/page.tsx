'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import AdminLayout from '@/components/AdminLayout';
import { useRouter } from 'next/navigation';
import AdminProtected from '@/components/AdminProtected';

interface Course {
  _id: string;
  title: string;
  privacy: 'public' | 'unlisted' | 'private';
}

interface User {
  _id: string;
  name: string;
  email: string;
  permissions?: string[];
  accessibleCourses?: Array<{
    courseId: string;
    grantedAt: string;
  }>;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [courseSearch, setCourseSearch] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const router = useRouter();

  const ITEMS_PER_PAGE = 20;

  const fetchUsers = async (page: number, searchQuery: string = '') => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(
        `/api/users?page=${page}&limit=${ITEMS_PER_PAGE}&search=${searchQuery}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
      setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('/api/courses?privacy=private,unlisted', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data.courses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, search);
    fetchCourses();
  }, [currentPage, search]);

  useEffect(() => {
    const searchLower = courseSearch.toLowerCase();
    const filtered = courses.filter(course => 
      course.title.toLowerCase().includes(searchLower)
    );
    setFilteredCourses(filtered);
  }, [courseSearch, courses]);

  const handleUpdatePermissions = async (userId: string, permissions: string[]) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editingUser?.name,
          permissions,
          accessibleCourses: selectedCourses
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      await fetchUsers(currentPage, search);
      setIsModalOpen(false);
      setEditingUser(null);
      setSelectedCourses([]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      await fetchUsers(currentPage, search);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete user');
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
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-4">User Management</h1>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white w-full max-w-md"
                />
              </div>
            </div>

            <div className="bg-white/5 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Permissions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        <div className="flex flex-wrap gap-1">
                          {(user.permissions || ['user']).map((permission, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-violet-500/20 text-violet-200 rounded-full text-xs"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setSelectedCourses(user.accessibleCourses?.map(ac => ac.courseId) || []);
                            setIsModalOpen(true);
                          }}
                          className="text-violet-400 hover:text-violet-300 transition-colors mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? 'bg-violet-600 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>

          {/* Edit User Modal */}
          {isModalOpen && editingUser && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    Edit User
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white"
                    />
                  </div>

                  {/* Email Display */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Email
                    </label>
                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300">
                      {editingUser.email}
                    </div>
                  </div>

                  {/* Permissions Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-3">
                      Permissions
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['admin', 'instructor', 'user', 'manage_courses', 'manage_instructors'].map((permission) => (
                        <label
                          key={permission}
                          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            editingUser.permissions?.includes(permission)
                              ? 'bg-violet-500/20 border border-violet-500/30'
                              : 'bg-white/5 border border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={editingUser.permissions?.includes(permission)}
                            onChange={(e) => {
                              const newPermissions = e.target.checked
                                ? [...(editingUser.permissions || []), permission]
                                : editingUser.permissions?.filter(p => p !== permission);
                              setEditingUser({ ...editingUser, permissions: newPermissions });
                            }}
                            className="rounded border-white/20 bg-white/5 text-violet-600 focus:ring-violet-500"
                          />
                          <span className="text-white text-sm capitalize">
                            {permission.replace('_', ' ')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Accessible Courses Section */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-200 mb-3">
                      Accessible Courses
                    </label>
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={courseSearch}
                      onChange={(e) => setCourseSearch(e.target.value)}
                      className="w-full px-4 py-2 mb-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white"
                    />
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {filteredCourses.map((course) => (
                        <label
                          key={course._id}
                          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedCourses.includes(course._id)
                              ? 'bg-violet-500/20 border border-violet-500/30'
                              : 'bg-white/5 border border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCourses.includes(course._id)}
                            onChange={(e) => {
                              setSelectedCourses(prev =>
                                e.target.checked
                                  ? [...prev, course._id]
                                  : prev.filter(id => id !== course._id)
                              );
                            }}
                            className="rounded border-white/20 bg-white/5 text-violet-600 focus:ring-violet-500"
                          />
                          <div className="flex-1">
                            <span className="text-white text-sm">{course.title}</span>
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${
                              course.privacy === 'private' 
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-yellow-500/20 text-yellow-300'
                            }`}>
                              {course.privacy}
                            </span>
                          </div>
                        </label>
                      ))}
                      {filteredCourses.length === 0 && (
                        <div className="text-gray-400 text-sm p-3">
                          No courses found
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdatePermissions(editingUser._id, editingUser.permissions || [])}
                      className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span>Save Changes</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AdminLayout>
      </PageLayout>
    </AdminProtected>
  );
} 