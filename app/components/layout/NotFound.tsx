import { Compass, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="page-section not-found">
      <span className="state-icon"><Compass size={32} /></span>
      <span className="eyebrow">404 · Lost and found</span>
      <h1>This collectible has wandered off.</h1>
      <p>The page you are looking for may have been moved or is no longer available.</p>
      <Link to="/marketplace" className="primary-button"><Home size={17} /> Return to marketplace</Link>
    </section>
  );
}
