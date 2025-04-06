
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-secondary dark:bg-secondary/50 mt-auto">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col">
            <Link to="/" className="flex items-center text-xl font-display font-bold mb-4">
              <span className="text-primary">Anime</span>
              <span>Odyssey</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Dive into the world of anime with us! Discover new series, share your thoughts, and join our community.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:col-span-2">
            <div className="flex flex-col space-y-2">
              <h3 className="text-lg font-medium">Pages</h3>
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link to="/blogs" className="text-muted-foreground hover:text-foreground transition-colors">Blogs</Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </div>
            
            <div className="flex flex-col space-y-2">
              <h3 className="text-lg font-medium">Connect</h3>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Instagram</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Discord</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Anime Odyssey. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
