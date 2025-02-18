import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-white/80 dark:bg-gray-800/80 border-t border-violet-100 dark:border-violet-900 pt-16 pb-12 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="flex items-center gap-3 group mb-6">
                <Image
                  src="/logo.svg"
                  alt="MindfulSpace Logo"
                  width={40}
                  height={40}
                  className="dark:invert transform group-hover:scale-110 transition-transform"
                />
                <span className="font-bold text-2xl text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  MindfulSpace
                </span>
              </Link>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-600 dark:text-gray-400 max-w-md text-lg leading-relaxed"
            >
              Join our community of mindful practitioners and begin your journey to inner peace and wellness.
            </motion.p>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/courses" 
                  className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="relative overflow-hidden">
                    <span className="inline-block transform group-hover:-translate-y-full transition-transform duration-200">Courses</span>
                    <span className="inline-block absolute top-full left-0 transform group-hover:-translate-y-full transition-transform duration-200">Courses</span>
                  </span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
              <li>
                <Link 
                  href="/profile" 
                  className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="relative overflow-hidden">
                    <span className="inline-block transform group-hover:-translate-y-full transition-transform duration-200">Profile</span>
                    <span className="inline-block absolute top-full left-0 transform group-hover:-translate-y-full transition-transform duration-200">Profile</span>
                  </span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
              <li>
                <Link 
                  href="/settings" 
                  className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="relative overflow-hidden">
                    <span className="inline-block transform group-hover:-translate-y-full transition-transform duration-200">Settings</span>
                    <span className="inline-block absolute top-full left-0 transform group-hover:-translate-y-full transition-transform duration-200">Settings</span>
                  </span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-6 text-lg">Resources</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/blog" 
                  className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors group inline-flex items-center gap-2"
                >
                  Blog
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors group inline-flex items-center gap-2"
                >
                  FAQ
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/support" 
                  className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors group inline-flex items-center gap-2"
                >
                  Support
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-6 text-lg">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors group inline-flex items-center gap-2">
                  Privacy Policy
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors group inline-flex items-center gap-2">
                  Terms of Service
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors group inline-flex items-center gap-2">
                  Contact Us
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-8 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} MindfulSpace. All rights reserved.
            </p>
            <div className="flex gap-6">
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transform hover:scale-110 transition-all"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-600 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transform hover:scale-110 transition-all"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.07-1.17-.053-1.815-.249-2.235-.413-.556-.217-.961-.477-1.38-.896-.42-.422-.675-.82-.899-1.382-.165-.422-.36-1.057-.421-2.227-.059-1.265-.074-1.646-.074-4.85s.015-3.585.074-4.85c.061-1.17.256-1.805.421-2.227.224-.562.479-.96.899-1.381.419-.419.824-.679 1.38-.896.42-.164 1.065-.36 2.235-.413 1.274-.057 1.649-.07 4.859-.07zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zm0 2.16a4 4 0 110 8 4 4 0 010-8zm6.4-4.8a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
                </svg>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}