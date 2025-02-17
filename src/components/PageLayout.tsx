import Navbar from './Navbar';
import Footer from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 text-white">
      <Navbar />
      <main className={`min-h-[calc(100vh-64px-320px)] text-gray-900 dark:text-white ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
} 