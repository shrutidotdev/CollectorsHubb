import { Grid2X2, ShoppingBag, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      <NavLink to="/marketplace">
        <ShoppingBag size={20} /> <span>Market</span>
      </NavLink>
      <NavLink to="/community">
        <Users size={20} /> <span>Community</span>
      </NavLink>
      <NavLink to="/collection">
        <Grid2X2 size={20} /> <span>Collection</span>
      </NavLink>
    </nav>
  );
}
