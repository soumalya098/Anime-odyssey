
import { useState, useEffect } from "react";
import { BlogCard } from "../components/BlogCard";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
}

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsRef = collection(db, "blogs");
        const blogsQuery = query(blogsRef, orderBy("date", "desc"));
        const snapshot = await getDocs(blogsQuery);
        
        const blogsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "",
            description: data.description || "",
            imageUrl: data.imageUrl || "",
            content: data.content || "",
            date: data.date,
            author: data.author || "",
            tags: Array.isArray(data.tags) ? data.tags : []
          } as Blog;
        });
        
        setBlogs(blogsData);
        setFilteredBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = blogs.filter(
        blog => 
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
          blog.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlogs(filtered);
    } else {
      setFilteredBlogs(blogs);
    }
  }, [searchTerm, blogs]);

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
    blogs.forEach(blog => {
      blog.tags.forEach(tag => {
        if (!["featured", "latest"].includes(tag)) {
          allTags.add(tag);
        }
      });
    });
    return Array.from(allTags).join(", ");
  };

  return (
    <div className="container py-16">
      <Helmet>
        <title>Anime Blogs | Anime Odyssey</title>
        <meta name="description" content="Browse our complete collection of anime blog posts, reviews, and analysis." />
        <meta name="keywords" content={`anime blogs, manga reviews, ${getAllTags()}`} />
        <meta name="robots" content="index, follow" />
        
        <meta property="og:title" content="Anime Blogs | Anime Odyssey" />
        <meta property="og:description" content="Browse our complete collection of anime blog posts, reviews, and analysis." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Anime Blogs | Anime Odyssey",
            "description": "Browse our complete collection of anime blog posts, reviews, and analysis.",
            "url": window.location.href,
            "publisher": {
              "@type": "Organization",
              "name": "Anime Odyssey Hub"
            }
          })}
        </script>
      </Helmet>
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-anime-pink via-anime-purple to-anime-blue">
          Our Anime Blog Collection
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Explore our latest articles, reviews, and thoughts on the world of anime
        </p>
        
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search blogs by title, tags, author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <p>Loading blogs...</p>
        </div>
      ) : filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
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
          {searchTerm ? (
            <p className="text-muted-foreground mb-4">No blogs matching your search criteria.</p>
          ) : (
            <p className="text-muted-foreground mb-4">No blogs available yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogsPage;
