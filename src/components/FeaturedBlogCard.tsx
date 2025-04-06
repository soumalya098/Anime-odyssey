
import { Link } from "react-router-dom";

interface FeaturedBlogCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
}

export const FeaturedBlogCard = ({ id, title, description, imageUrl, author }: FeaturedBlogCardProps) => {
  return (
    <Link 
      to={`/blog/${id}`}
      className="group relative isolate flex flex-col justify-end overflow-hidden rounded-2xl px-8 pb-8 pt-40 max-w-sm mx-auto animate-fade-in"
    >
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
      <h3 className="z-10 mt-3 text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      <div className="z-10 gap-y-1 overflow-hidden text-sm leading-6 text-muted-foreground line-clamp-2">
        {description}
      </div>
      <div className="z-10 mt-3 text-sm font-medium text-white/80">
        By {author}
      </div>
    </Link>
  );
};
