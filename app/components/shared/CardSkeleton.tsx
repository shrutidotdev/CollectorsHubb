export default function CardSkeleton({ count }: { count: number }) {
  return (
    <div className="product-grid" aria-label="Loading listings" role="status">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton skeleton-image" />
          <div className="skeleton skeleton-line short" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line medium" />
        </div>
      ))}
    </div>
  );
}
