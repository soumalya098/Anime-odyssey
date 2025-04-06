
import { useEffect, useState } from "react";
import { HeroSection } from "../components/HeroSection";
import { FeaturedBlogCard } from "../components/FeaturedBlogCard";
import { BlogCard } from "../components/BlogCard";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
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

const HomePage = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsRef = collection(db, "blogs");
        
        // Get featured blogs (first 3)
        const featuredQuery = query(blogsRef, orderBy("date", "desc"), limit(3));
        const featuredSnapshot = await getDocs(featuredQuery);
        const featuredData = featuredSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Blog[];
        
        // Get recent blogs (next 4)
        const recentQuery = query(blogsRef, orderBy("date", "desc"), limit(7));
        const recentSnapshot = await getDocs(recentQuery);
        const allBlogs = recentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Blog[];
        
        // Exclude the first 3 (featured) blogs from recent blogs
        const recentData = allBlogs.slice(3, 7);
        
        setFeaturedBlogs(featuredData);
        setRecentBlogs(recentData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

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

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      
      <section className="container py-16">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Posts</h2>
          <p className="text-muted-foreground max-w-2xl">
            Discover our handpicked selection of the most captivating anime content
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <p>Loading featured blogs...</p>
          </div>
        ) : featuredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBlogs.map((blog) => (
              <FeaturedBlogCard 
                key={blog.id}
                id={blog.id}
                title={blog.title}
                description={blog.description}
                imageUrl={blog.imageUrl || "/placeholder.svg"}
                author={blog.author}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No featured blogs available yet.</p>
            <Link to="/admin" className="text-primary hover:underline">
              Create your first blog post!
            </Link>
          </div>
        )}
      </section>
      
      <section className="bg-secondary/30 py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Latest Articles</h2>
              <p className="text-muted-foreground max-w-2xl">
                Stay updated with our fresh content on all things anime
              </p>
            </div>
            <Link to="/blogs" className="mt-4 md:mt-0 inline-flex items-center text-primary hover:text-primary/80 transition-colors">
              View all articles
              <svg
                className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <p>Loading recent blogs...</p>
            </div>
          ) : recentBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {recentBlogs.map((blog) => (
                <BlogCard 
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  description={blog.description}
                  imageUrl={blog.imageUrl || "/placeholder.svg"}
                  date={formatDate(blog.date)}
                  author={blog.author}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No recent blogs available yet.</p>
            </div>
          )}
        </div>
      </section>
      
      <section className="container py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Join Our Anime Community</h2>
          <p className="text-muted-foreground mb-8">
            Connect with fellow anime enthusiasts, participate in discussions, and stay updated on the latest news and releases.
          </p>
          <Link to="/contact" className="anime-button inline-block">
            <span className="relative z-10">Get Started</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
