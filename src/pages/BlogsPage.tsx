
import { useState } from "react";
import { BlogCard } from "../components/BlogCard";

const allBlogs = [
  {
    id: "1",
    title: "The Beauty of Anime Landscapes",
    description: "Exploring the artistic brilliance behind anime's most stunning natural scenery and how they enhance storytelling through visual atmosphere.",
    imageUrl: "/lovable-uploads/8a58d71c-a9ad-45da-8e75-a4c73b036533.png",
    date: "April 5, 2025",
    author: "Miyuki Tanaka"
  },
  {
    id: "2",
    title: "Character Design Philosophy",
    description: "Understanding what makes anime characters so memorable and impactful, from visual design elements to personality traits that resonate with audiences.",
    imageUrl: "/lovable-uploads/09815684-8765-4beb-8048-734dc1fca570.png",
    date: "April 3, 2025",
    author: "Haruto Sato"
  },
  {
    id: "3",
    title: "Emotions Through Animation",
    description: "How anime conveys complex emotions through simple yet powerful techniques, creating moments that stay with viewers long after the credits roll.",
    imageUrl: "/lovable-uploads/82ada9d2-2b20-4ea9-b7a3-3f1f7413f221.png",
    date: "April 2, 2025",
    author: "Aiko Yamamoto"
  },
  {
    id: "4",
    title: "Seasonal Anime: Winter 2025 Preview",
    description: "A comprehensive look at the most anticipated anime releasing in the winter season. From sequels to exciting new IPs, this winter is packed with content for every anime fan.",
    imageUrl: "/lovable-uploads/8b31bbea-16cf-4f18-b8aa-deb5b879c981.png",
    date: "April 1, 2025",
    author: "Kazuki Nakamura"
  },
  {
    id: "5",
    title: "The Evolution of Shonen Protagonists",
    description: "Tracking how shonen protagonists have changed over the decades, from Dragon Ball's Goku to modern interpretations. Is the traditional shonen hero still relevant in today's anime landscape?",
    imageUrl: "/lovable-uploads/40b32c5b-f3a1-4bbc-9151-abf0117c6d24.png",
    date: "March 27, 2025",
    author: "Yuki Tanaka"
  },
  {
    id: "6",
    title: "Anime Music: Beyond the Opening Theme",
    description: "A deep dive into the important role that soundtrack and background music play in creating atmosphere and emotional impact in anime series.",
    imageUrl: "/lovable-uploads/50fa3c92-e6c0-4ca2-bd5b-24d86ea04299.png",
    date: "March 20, 2025",
    author: "Hana Watanabe"
  },
  {
    id: "7",
    title: "Studio Spotlight: MAPPA's Rise to Fame",
    description: "How MAPPA went from a small studio to one of the industry's giants, analyzing their production style and what makes their adaptations so successful.",
    imageUrl: "/lovable-uploads/5c2336a0-649b-4dd4-8297-2f7291555417.png",
    date: "March 15, 2025",
    author: "Ren Suzuki"
  },
  {
    id: "8",
    title: "Anime Aesthetics: Visual Symbolism",
    description: "Exploring the rich tradition of visual symbolism in anime and how directors use imagery to convey deeper meanings and themes.",
    imageUrl: "/lovable-uploads/a6e68b80-cd93-4903-9bff-8a75a90d7666.png",
    date: "March 10, 2025",
    author: "Sakura Ito"
  }
];

const BlogsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredBlogs = allBlogs.filter((blog) => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Explore Our Blogs</h1>
        <p className="text-muted-foreground max-w-2xl">
          Discover in-depth articles, reviews, and analysis on your favorite anime series and films
        </p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search blogs..."
            className="w-full rounded-md border border-input bg-background px-4 py-3 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No blogs found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog.id} {...blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogsPage;
