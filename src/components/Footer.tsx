import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-violet-100 dark:border-violet-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
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
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Join our community of mindful practitioners and begin your journey to inner peace and wellness.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/courses" className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors">
                  Courses
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} MindfulSpace. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400">
                <span className="sr-only">Twitter</span>
                {/* Add Twitter Icon */}
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400">
                <span className="sr-only">Instagram</span>
                {/* Add Instagram Icon */}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 