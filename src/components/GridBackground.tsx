export default function GridBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-1 opacity-50">
        {Array.from({ length: 192 }).map((_, i) => {
          const randomOpacity = Math.random();
          return (
            <div
              key={i}
              className="aspect-square"
              style={{
                background: `rgba(139, 92, 246, ${randomOpacity * 0.3})`,
                border: '1px solid rgba(139, 92, 246, 0.2)',
              }}
            />
          );
        })}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 backdrop-blur-sm" />
    </div>
  );
} 