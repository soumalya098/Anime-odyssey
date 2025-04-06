
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-anime-pink via-anime-purple to-anime-blue mb-6">
        404
      </h1>
      <p className="text-xl text-muted-foreground mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="anime-button">
        <span className="relative z-10">Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
