import { Grid2X2, Moon, ShoppingBag, Sun, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";

export default function Header({
  theme,
  onToggleTheme,
  collectionCount,
}: {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  collectionCount: number;
}) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          <NavLink to="/marketplace">
            <ShoppingBag size={17} /> Marketplace
          </NavLink>
          <NavLink to="/community">
            <Users size={17} /> Community
          </NavLink>
          <NavLink to="/collection">
            <Grid2X2 size={17} /> My collection
            <span className="nav-count">{collectionCount}</span>
          </NavLink>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
          </button>
          <button className="profile-button" aria-label="Open profile">
            SS
          </button>
        </div>
      </div>
    </header>
  );
}
