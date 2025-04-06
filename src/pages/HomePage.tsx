
import { HeroSection } from "../components/HeroSection";
import { FeaturedBlogCard } from "../components/FeaturedBlogCard";
import { BlogCard } from "../components/BlogCard";
import { Link } from "react-router-dom";

const featuredBlogs = [
  {
    id: "1",
    title: "The Beauty of Anime Landscapes",
    description: "Exploring the artistic brilliance behind anime's most stunning natural scenery",
    imageUrl: "/lovable-uploads/8a58d71c-a9ad-45da-8e75-a4c73b036533.png",
    author: "Miyuki Tanaka"
  },
  {
    id: "2",
    title: "Character Design Philosophy",
    description: "Understanding what makes anime characters so memorable and impactful",
    imageUrl: "/lovable-uploads/09815684-8765-4beb-8048-734dc1fca570.png",
    author: "Haruto Sato"
  },
  {
    id: "3",
    title: "Emotions Through Animation",
    description: "How anime conveys complex emotions through simple yet powerful techniques",
    imageUrl: "/lovable-uploads/82ada9d2-2b20-4ea9-b7a3-3f1f7413f221.png",
    author: "Aiko Yamamoto"
  }
];

const recentBlogs = [
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
  }
];

const HomePage = () => {
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBlogs.map((blog) => (
            <FeaturedBlogCard key={blog.id} {...blog} />
          ))}
        </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {recentBlogs.map((blog) => (
              <BlogCard key={blog.id} {...blog} />
            ))}
          </div>
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
