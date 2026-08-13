export default function PostSkeleton() {
  return (
    <div className="post-grid" aria-label="Loading community posts" role="status">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="skeleton-card post-skeleton" key={index}>
          <div className="skeleton skeleton-profile" />
          <div className="skeleton skeleton-image" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line medium" />
        </div>
      ))}
    </div>
  );
}
