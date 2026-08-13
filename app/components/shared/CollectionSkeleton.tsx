export default function CollectionSkeleton() {
  return (
    <div className="collection-list" aria-label="Loading collection" role="status">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="skeleton-collection" key={index}>
          <div className="skeleton skeleton-square" />
          <div><div className="skeleton skeleton-line" /><div className="skeleton skeleton-line short" /></div>
        </div>
      ))}
    </div>
  );
}
