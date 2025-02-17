'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SearchResult {
  _id: string;
  title: string;
  type: 'course';
  image: string;
  description?: string;
}

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const searchItems = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.results);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchItems, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
        aria-label="Search"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

            {/* Modal */}
            <div className="inline-block w-full max-w-2xl my-8 text-left align-middle transition-all transform">
              <div className="relative bg-gray-800/90 rounded-xl shadow-2xl">
                {/* Search Input */}
                <div className="p-4 border-b border-gray-700">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Search courses..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-white placeholder-gray-400"
                    />
                    {loading && (
                      <div className="absolute right-3 top-3">
                        <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto p-2">
                  {results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {results.map((result) => (
                        <Link
                          key={result._id}
                          href={`/courses/${result._id}`}
                          onClick={() => {
                            setIsOpen(false);
                            setQuery('');
                          }}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
                        >
                          <img
                            src={result.image || '/default-thumbnail.png'}
                            alt={result.title}
                            className="w-20 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium truncate">
                              {result.title}
                            </h4>
                            <p className="text-sm text-gray-400">Course</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : query.length >= 2 ? (
                    <div className="p-4 text-gray-400 text-center">
                      No results found
                    </div>
                  ) : (
                    <div className="p-4 text-gray-400 text-center">
                      Start typing to search...
                    </div>
                  )}
                </div>

                {/* Close button */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 