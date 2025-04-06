
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Blog {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  content: string;
  date: any;
  author: string;
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      
      try {
        const blogRef = doc(db, "blogs", id);
        const blogSnap = await getDoc(blogRef);
        
        if (blogSnap.exists()) {
          setBlog({
            id: blogSnap.id,
            ...blogSnap.data()
          } as Blog);
        } else {
          setError("Blog not found");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const formatDate = (date: any) => {
    if (!date) return "No date";
    if (date.toDate) {
      const d = date.toDate();
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(d);
    }
    return "Invalid date";
  };

  if (loading) {
    return (
      <div className="container py-16 flex justify-center">
        <p>Loading blog...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-muted-foreground mb-6">{error || "Blog not found"}</p>
        <Link to="/blogs" className="anime-button inline-block">
          <span className="relative z-10">Back to Blogs</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            to="/blogs" 
            className="inline-flex items-center text-primary hover:underline"
          >
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blogs
          </Link>
        </div>
        
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-anime-pink via-anime-purple to-anime-blue">
            {blog.title}
          </h1>
          
          <div className="flex items-center text-muted-foreground mb-8">
            <span>By {blog.author}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(blog.date)}</span>
          </div>
          
          <div className="relative aspect-video mb-8 overflow-hidden rounded-lg">
            <img 
              src={blog.imageUrl || "/placeholder.svg"} 
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="leading-relaxed whitespace-pre-line">
            {blog.content}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
