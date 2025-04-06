
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
  tags: string[];
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
            ...blogSnap.data(),
            tags: blogSnap.data().tags || []
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

  // Function to render content with embedded images
  const renderContent = (content: string) => {
    if (!content) return null;
    
    // Regular expression to find image markdown ![alt](url)
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    
    // Split the content by image markdown
    const parts = content.split(imgRegex);
    const matches = content.match(imgRegex) || [];
    
    // If no images found, just return the content as is
    if (matches.length === 0) {
      return <p className="whitespace-pre-line">{content}</p>;
    }
    
    // Build the rendered content with images
    const result = [];
    let matchIndex = 0;
    
    for (let i = 0; i < parts.length; i++) {
      // Add text part
      if (parts[i]) {
        result.push(
          <p key={`text-${i}`} className="whitespace-pre-line">
            {parts[i]}
          </p>
        );
      }
      
      // Add image if we have a match
      if (matches[matchIndex]) {
        // Extract URL from ![alt](url)
        const imgMatch = /!\[([^\]]*)\]\(([^)]+)\)/.exec(matches[matchIndex]);
        if (imgMatch && imgMatch[2]) {
          result.push(
            <div key={`img-${i}`} className="my-6">
              <img 
                src={imgMatch[2]} 
                alt={imgMatch[1] || "Blog image"}
                className="rounded-lg mx-auto max-h-[500px] object-contain"
              />
            </div>
          );
        }
        matchIndex++;
      }
    }
    
    return result;
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
          
          <div className="flex items-center text-muted-foreground mb-4">
            <span>By {blog.author}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(blog.date)}</span>
          </div>
          
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.tags.map((tag, index) => (
                <span key={index} className="bg-secondary/50 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="relative aspect-video mb-8 overflow-hidden rounded-lg">
            <img 
              src={blog.imageUrl || "/placeholder.svg"} 
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="leading-relaxed">
            {renderContent(blog.content)}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
