import { PackageOpen } from "lucide-react";

export default function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="state-card" role="alert">
      <span className="state-icon"><PackageOpen size={30} /></span>
      <h3>Something went off the shelf</h3>
      <p>{message} Your saved information is safe.</p>
      <button className="primary-button" onClick={onRetry}>Try again</button>
    </div>
  );
}
