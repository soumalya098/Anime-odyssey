
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "./AuthDialog";

export const HeroSection = () => {
  const { currentUser } = useAuth();

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center"></div>
      <div className="hero-overlay"></div>
      
      <div className="container relative z-10 mx-auto px-4 py-32 text-center">
        <h1 className="animate-fade-in text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-anime-pink via-anime-purple to-anime-blue">
          Welcome to Anime Odyssey
        </h1>
        <p className="animate-fade-in text-lg md:text-xl max-w-2xl mx-auto mb-8 text-foreground/90">
          Dive into the world of anime with us! Discover new series, share your thoughts, and join our community of passionate fans.
        </p>
        <div className="animate-fade-in flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/blogs" className="anime-button">
            <span className="relative z-10">Explore Blogs</span>
          </Link>
          
          {!currentUser ? (
            <AuthDialog />
          ) : (
            <Link to="/about" className="anime-button-outline">
              <span className="relative z-10">About Us</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
