
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "./AuthDialog";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser, isAdmin } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Blogs", path: "/blogs" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Add admin link if user is admin
  if (isAdmin) {
    navLinks.push({ name: "Admin", path: "/admin" });
  }

  return (
    <header className="sticky top-0 z-50 w-full glassmorphism">
      <div className="container flex h-16 items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-xl font-display font-bold text-foreground"
        >
          <span className="text-primary">Anime</span>
          <span>Odyssey</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`navbar-link ${isActive(link.path) ? "active-link" : ""}`}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-4">
            <AuthDialog />
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <AuthDialog />
          <ThemeToggle />
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="container md:hidden">
          <nav className="flex flex-col space-y-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`navbar-link text-lg ${isActive(link.path) ? "active-link" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
