import PageLayout from '@/components/PageLayout';

export default function TermsOfService() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Terms of Service
        </h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="mb-4">
              By accessing and using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Use License
            </h2>
            <p className="mb-4">
              Upon purchasing our courses or accessing our content, you are granted a limited, non-exclusive, non-transferable license to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access and view the content for personal, non-commercial use</li>
              <li>Participate in course activities</li>
              <li>Download materials specifically made available for download</li>
            </ul>
          </section>

          {/* Add more sections as needed */}
        </div>
      </div>
    </PageLayout>
  );
} 