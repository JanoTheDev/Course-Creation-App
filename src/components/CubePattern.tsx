export default function CubePattern() {
  return (
    <div className="absolute inset-0 w-full h-full -z-10">
      <div className="relative w-full h-full overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-4 p-4 transform -rotate-12 scale-125">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-full aspect-square bg-black/40 border border-violet-500/30 rounded-sm backdrop-blur-sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
} 