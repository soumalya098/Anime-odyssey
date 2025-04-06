
import { useState, useEffect } from "react";
import { BlogCard } from "../components/BlogCard";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
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

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsRef = collection(db, "blogs");
        const blogsQuery = query(blogsRef, orderBy("date", "desc"));
        const snapshot = await getDocs(blogsQuery);
        
        const blogsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Blog[];
        
        setBlogs(blogsData);
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
    <div className="container py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-anime-pink via-anime-purple to-anime-blue">
          Our Anime Blog Collection
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our latest articles, reviews, and thoughts on the world of anime
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <p>Loading blogs...</p>
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
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
          <p className="text-muted-foreground mb-4">No blogs available yet.</p>
        </div>
      )}
    </div>
  );
};

export default BlogsPage;
