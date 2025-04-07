
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Heart } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  content: string;
  date: any;
  author: string;
  tags: string[];
  likes?: string[];
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      
      try {
        const blogRef = doc(db, "blogs", id);
        const blogSnap = await getDoc(blogRef);
        
        if (blogSnap.exists()) {
          const blogData = {
            id: blogSnap.id,
            ...blogSnap.data(),
            tags: blogSnap.data().tags || [],
            likes: blogSnap.data().likes || []
          } as Blog;
          
          setBlog(blogData);
          
          // Check if current user has liked this blog
          if (currentUser && blogData.likes?.includes(currentUser.uid)) {
            setLiked(true);
          }
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
  }, [id, currentUser]);

  const handleLike = async () => {
    if (!currentUser) {
      toast.error("Please login to like this blog");
      return;
    }
    
    if (!blog || !id) return;
    
    try {
      const blogRef = doc(db, "blogs", id);
      
      if (liked) {
        // Unlike
        await updateDoc(blogRef, {
          likes: arrayRemove(currentUser.uid)
        });
        setLiked(false);
        setBlog(prev => {
          if (!prev) return null;
          return {
            ...prev,
            likes: prev.likes?.filter(uid => uid !== currentUser.uid) || []
          };
        });
        toast.success("Blog unliked");
      } else {
        // Like
        await updateDoc(blogRef, {
          likes: arrayUnion(currentUser.uid)
        });
        setLiked(true);
        setBlog(prev => {
          if (!prev) return null;
          return {
            ...prev,
            likes: [...(prev.likes || []), currentUser.uid]
          };
        });
        toast.success("Blog liked");
      }
    } catch (error) {
      console.error("Error updating like:", error);
      toast.error("Failed to update like status");
    }
  };

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

  // Improved function to render content with embedded images
  const renderContent = (content: string) => {
    if (!content) return null;
    
    // Regular expression to find image markdown ![alt](url)
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    
    // Initialize result array and last processed index
    const result = [];
    let lastIndex = 0;
    let match;
    let index = 0;
    
    // Iterate through all matches
    while ((match = imgRegex.exec(content)) !== null) {
      const matchIndex = match.index;
      
      // Add text before the image if there is any
      if (matchIndex > lastIndex) {
        const textBeforeImage = content.substring(lastIndex, matchIndex);
        if (textBeforeImage.trim()) {
          result.push(
            <p key={`text-${index}`} className="whitespace-pre-line">
              {textBeforeImage}
            </p>
          );
        }
      }
      
      // Add the image
      const imgUrl = match[2];
      const altText = match[1] || "Blog image";
      
      result.push(
        <div key={`img-${index}`} className="my-6">
          <img 
            src={imgUrl} 
            alt={altText}
            className="rounded-lg mx-auto max-h-[500px] object-contain"
          />
        </div>
      );
      
      // Update the last processed index to after the image markdown
      lastIndex = matchIndex + match[0].length;
      index++;
    }
    
    // Add any remaining text after the last image
    if (lastIndex < content.length) {
      const textAfterImages = content.substring(lastIndex);
      if (textAfterImages.trim()) {
        result.push(
          <p key="text-final" className="whitespace-pre-line">
            {textAfterImages}
          </p>
        );
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
            {blog?.title}
          </h1>
          
          <div className="flex items-center justify-between text-muted-foreground mb-4">
            <div className="flex items-center">
              <span>By {blog?.author}</span>
              <span className="mx-2">•</span>
              <span>{blog?.date ? formatDate(blog.date) : ""}</span>
            </div>
            
            <button 
              onClick={handleLike}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/30 hover:bg-secondary transition-colors"
              aria-label={liked ? "Unlike this blog" : "Like this blog"}
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
              <span>{blog.likes?.length || 0}</span>
            </button>
          </div>
          
          {blog?.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.tags.map((tag, index) => (
                <span key={index} className={`px-3 py-1 rounded-full text-sm ${
                  tag === 'featured' ? 'bg-green-500/30 text-green-200' : 
                  tag === 'latest' ? 'bg-blue-500/30 text-blue-200' : 
                  'bg-secondary/50'
                }`}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="relative aspect-video mb-8 overflow-hidden rounded-lg">
            <img 
              src={blog?.imageUrl || "/placeholder.svg"} 
              alt={blog?.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="leading-relaxed">
            {blog?.content ? renderContent(blog.content) : null}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
