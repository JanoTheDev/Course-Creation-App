import Link from 'next/link';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  instructorName: string;
  image: string;
  videoCount: number;
  price: number;
  hasAccess?: boolean;
  href: string;
}

export default function CourseCard({
  id,
  title,
  description,
  instructorName,
  image,
  videoCount,
  price = 0,
  hasAccess = false,
  href
}: CourseCardProps) {
  return (
    <Link href={href} className="block">
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-white/10 hover:border-violet-500/50 transition-colors">
        <div className="aspect-video relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          {price > 0 && (
            <div className="absolute top-2 right-2">
              {hasAccess ? (
                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Purchased
                </span>
              ) : (
                <span className="px-3 py-1 bg-violet-500 text-white rounded-full text-sm font-medium">
                  ${price.toFixed(2)}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">{instructorName}</span>
            <span className="text-sm text-gray-400">
              {videoCount} video{videoCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
} 