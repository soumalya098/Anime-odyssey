
import { useEffect, useState } from "react";
import { HeroSection } from "../components/HeroSection";
import { FeaturedBlogCard } from "../components/FeaturedBlogCard";
import { BlogCard } from "../components/BlogCard";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit, where, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Helmet } from "react-helmet-async";

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

const HomePage = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsRef = collection(db, "blogs");
        
        // Get featured blogs - blogs that have 'featured' in their tags array
        const featuredQuery = query(
          blogsRef,
          where("tags", "array-contains", "featured"),
          orderBy("date", "desc"),
          limit(3)
        );
        
        const featuredSnapshot = await getDocs(featuredQuery);
        const featuredData: Blog[] = featuredSnapshot.docs.map(doc => {
          const data = doc.data() as DocumentData;
          return {
            id: doc.id,
            title: data.title || "",
            description: data.description || "",
            imageUrl: data.imageUrl || "",
            content: data.content || "",
            date: data.date,
            author: data.author || "",
            tags: Array.isArray(data.tags) ? data.tags : [],
            likes: Array.isArray(data.likes) ? data.likes : []
          };
        });
        
        console.log("Featured blogs fetched:", featuredData.length);
        
        // Get latest blogs - using another query for 'latest' tagged blogs
        const latestQuery = query(
          blogsRef,
          where("tags", "array-contains", "latest"),
          orderBy("date", "desc"),
          limit(4)
        );
        
        const latestSnapshot = await getDocs(latestQuery);
        const latestData: Blog[] = latestSnapshot.docs.map(doc => {
          const data = doc.data() as DocumentData;
          return {
            id: doc.id,
            title: data.title || "",
            description: data.description || "",
            imageUrl: data.imageUrl || "",
            content: data.content || "",
            date: data.date,
            author: data.author || "",
            tags: Array.isArray(data.tags) ? data.tags : [],
            likes: Array.isArray(data.likes) ? data.likes : []
          };
        });
        
        console.log("Latest blogs fetched:", latestData.length);

        // If no featured blogs, use most recent blogs instead
        const finalFeatured = featuredData.length > 0 
          ? featuredData 
          : await fetchRecentBlogs(blogsRef, 3, []);
        
        // If not enough latest blogs, fetch more recent ones excluding featured ones
        const finalLatest = latestData.length >= 4 
          ? latestData 
          : await fetchRecentBlogs(
              blogsRef, 
              4, 
              finalFeatured.map(blog => blog.id)
            );
        
        setFeaturedBlogs(finalFeatured);
        setRecentBlogs(finalLatest);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    // Helper function to fetch recent blogs excluding certain IDs
    const fetchRecentBlogs = async (blogsRef: any, count: number, excludeIds: string[]): Promise<Blog[]> => {
      try {
        const recentQuery = query(blogsRef, orderBy("date", "desc"), limit(10));
        const recentSnapshot = await getDocs(recentQuery);
        let recentData: Blog[] = recentSnapshot.docs.map(doc => {
          const data = doc.data() as DocumentData;
          return {
            id: doc.id,
            title: data.title || "",
            description: data.description || "",
            imageUrl: data.imageUrl || "",
            content: data.content || "",
            date: data.date,
            author: data.author || "",
            tags: Array.isArray(data.tags) ? data.tags : [],
            likes: Array.isArray(data.likes) ? data.likes : []
          };
        });
        
        // Filter out excluded IDs
        if (excludeIds.length > 0) {
          recentData = recentData.filter(blog => !excludeIds.includes(blog.id));
        }
        
        return recentData.slice(0, count);
      } catch (error) {
        console.error("Error fetching recent blogs:", error);
        return [];
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

  // Generate meta keywords from all blog tags
  const getAllTags = () => {
    const allTags = new Set<string>();
    [...featuredBlogs, ...recentBlogs].forEach(blog => {
      blog.tags.forEach(tag => {
        if (!["featured", "latest"].includes(tag)) {
          allTags.add(tag);
        }
      });
    });
    return Array.from(allTags).join(", ");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Anime Odyssey - Dive Into The World of Anime</title>
        <meta name="description" content="Explore our collection of anime reviews, analysis, and news. Discover featured posts and latest articles about your favorite anime series." />
        <meta name="keywords" content={`anime, manga, japanese animation, anime blog, ${getAllTags()}`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Anime Odyssey - Dive Into The World of Anime" />
        <meta property="og:description" content="Explore our collection of anime reviews, analysis, and news. Discover featured posts and latest articles about your favorite anime series." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Anime Odyssey",
            "url": window.location.origin,
            "description": "A modern anime blog exploring the artistry, culture, and stories of Japanese animation.",
            "publisher": {
              "@type": "Organization",
              "name": "Anime Odyssey Hub"
            }
          })}
        </script>
      </Helmet>
      
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
