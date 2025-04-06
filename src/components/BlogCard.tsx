
import { Link } from "react-router-dom";

interface BlogCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  author: string;
}

export const BlogCard = ({ id, title, description, imageUrl, date, author }: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`} className="blog-card group relative flex flex-col overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl animate-fade-in">
      <div 
        className="relative aspect-video w-full overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="card-overlay"></div>
      </div>
      <div className="relative flex flex-1 flex-col p-6">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <span>{date}</span>
          <span className="mx-2">•</span>
          <span>{author}</span>
        </div>
        <h3 className="text-xl font-bold leading-tight text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground line-clamp-2 flex-1">
          {description}
        </p>
        <div className="mt-4 flex items-center">
          <span className="text-sm font-medium text-primary inline-flex items-center">
            Read more
            <svg
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};
