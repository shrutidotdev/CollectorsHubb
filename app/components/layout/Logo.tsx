import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/marketplace" className="brand" aria-label="Curio home">
      <span className="brand-mark" aria-hidden="true">
        C
      </span>
      <span>curio</span>
    </Link>
  );
}
