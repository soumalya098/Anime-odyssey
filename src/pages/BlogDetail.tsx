
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Mock blog data - in a real app, this would come from a database
const blogPosts = [
  {
    id: "1",
    title: "The Beauty of Anime Landscapes",
    description: "Exploring the artistic brilliance behind anime's most stunning natural scenery.",
    content: `
      <p>When we think of what makes anime special, characters and storylines often come to mind first. But there's another element that deserves just as much recognition: the breathtaking landscapes that serve as backdrops to our favorite series.</p>
      
      <p>From the rural countryside of "My Neighbor Totoro" to the post-apocalyptic vistas of "Attack on Titan," anime landscapes do more than just set a scene—they tell stories, evoke emotions, and sometimes even function as characters in their own right.</p>
      
      <h2>The Makoto Shinkai Effect</h2>
      
      <p>No discussion of anime landscapes would be complete without mentioning director Makoto Shinkai, whose films like "Your Name" and "Weathering With You" have redefined what's possible in animated scenery. Shinkai's hyperrealistic style captures light, weather, and urban environments with a detail that borders on photographic, yet remains distinctly artistic.</p>
      
      <p>What makes Shinkai's work particularly interesting is how he uses these gorgeous settings. The breathtaking skyscapes in "Your Name" aren't just pretty pictures—they represent the cosmic distance between the protagonists, creating visual poetry that enhances the narrative.</p>
      
      <h2>Nature as Character</h2>
      
      <p>Studio Ghibli films, particularly those directed by Hayao Miyazaki, take a different approach. In works like "Princess Mononoke" and "Spirited Away," natural landscapes are imbued with personality and agency. Forests feel alive, rivers have spirits, and mountains seem to watch over human characters with ancient wisdom.</p>
      
      <p>This approach reflects Shinto influences and ecological themes central to Miyazaki's work, where the distinction between landscape and character often intentionally blurs.</p>
      
      <h2>Technical Mastery</h2>
      
      <p>What makes anime landscapes particularly special is the technical skill involved in their creation. Unlike live-action films, every element must be deliberately drawn or rendered. This means that weather effects, lighting, perspective, and atmosphere are all conscious artistic choices.</p>
      
      <p>Consider the rain scenes in "Garden of Words," where each droplet is animated with meticulous attention, or the way sunlight filters through leaves in "Mushishi." These details require incredible patience and skill, but the emotional payoff for viewers is immense.</p>
      
      <h2>Cultural Significance</h2>
      
      <p>Many anime landscapes also serve as cultural preservation. As Japan undergoes continuous modernization, anime often captures traditional settings, rural areas, and historical periods that might otherwise fade from public consciousness.</p>
      
      <p>Series like "Showa Genroku Rakugo Shinju" or films like "In This Corner of the World" recreate historical periods with careful attention to architectural and environmental details, serving an almost documentary function alongside their narrative purposes.</p>
      
      <h2>Conclusion</h2>
      
      <p>The next time you watch your favorite anime, take a moment to look beyond the characters and story. Notice how the sky is rendered, how light plays across buildings, or how nature is depicted. These elements aren't just backgrounds—they're fundamental components of the storytelling art that makes anime so powerful and distinctive.</p>
      
      <p>In the most masterful works, the line between character and environment blurs, creating worlds that feel complete and immersive. That's the true beauty of anime landscapes: they don't just show us where the story happens; they're an essential part of the story itself.</p>
    `,
    imageUrl: "/lovable-uploads/8a58d71c-a9ad-45da-8e75-a4c73b036533.png",
    date: "April 5, 2025",
    author: "Miyuki Tanaka",
    likes: 124,
    relatedPosts: ["2", "3", "6"]
  },
  {
    id: "2",
    title: "Character Design Philosophy",
    description: "Understanding what makes anime characters so memorable and impactful.",
    content: `
      <p>Character design in anime is a sophisticated art form that balances artistic expression, narrative function, and cultural context. The most iconic anime characters aren't just visually striking—they're designed to communicate personality, background, and development through visual cues.</p>
      
      <h2>Visual Shorthand</h2>
      
      <p>One of anime's strengths is its use of visual shorthand. Hair color, style, and eye design aren't just aesthetic choices—they often communicate essential character traits. Blue hair might suggest calmness or melancholy, while spiky designs often indicate energy or aggression.</p>
      
      <p>This extends to clothing and accessories as well. A character's outfit can tell us about their profession, social status, personality, and even their character arc before they speak a single line of dialogue.</p>
      
      <h2>The Importance of Silhouette</h2>
      
      <p>Great anime character designers understand the power of silhouette. Characters need to be instantly recognizable from their outline alone—a principle shared with character design in Western animation and video games.</p>
      
      <p>This attention to distinctive silhouettes is why we can immediately recognize characters like Spike Spiegel, Sailor Moon, or Goku from just their shadows or simplified forms.</p>
      
      <h2>Color Psychology</h2>
      
      <p>Color choices in anime character design are rarely random. Colors are selected for their psychological impact and symbolic associations. Red often signifies passion or danger, purple frequently suggests nobility or mystery, and green might represent growth or envy.</p>
      
      <p>These color associations can be reinforced or subverted throughout a series as characters develop, with color palettes sometimes changing to reflect character growth.</p>
      
      <h2>Cultural Context</h2>
      
      <p>Anime character design is also deeply influenced by Japanese cultural aesthetics and symbolism. Everything from traditional clothing elements to the significance of certain colors or animals draws on a rich cultural heritage that adds depth for viewers familiar with these references.</p>
      
      <h2>Evolution and Innovation</h2>
      
      <p>What's particularly fascinating about anime character design is how it has evolved over decades while maintaining distinctive traits that make it recognizably "anime." From the rounded simplicity of early Astro Boy to the complex detail of modern productions, we can trace clear evolutionary lines while seeing constant innovation.</p>
      
      <p>Today's character designers continue to push boundaries, experimenting with new styles, influences, and techniques while respecting the traditions that made anime character design so powerful in the first place.</p>
      
      <h2>Conclusion</h2>
      
      <p>The philosophy behind anime character design reminds us that great visual design isn't just about creating something that looks cool—it's about communicating story, personality, and emotion through visual means.</p>
      
      <p>The next time you find yourself drawn to an anime character, take a moment to analyze why. What visual elements make them memorable? How do their design choices reflect their role in the story? Understanding these principles can deepen our appreciation of anime as an art form that combines visual storytelling with narrative in uniquely powerful ways.</p>
    `,
    imageUrl: "/lovable-uploads/09815684-8765-4beb-8048-734dc1fca570.png",
    date: "April 3, 2025",
    author: "Haruto Sato",
    likes: 98,
    relatedPosts: ["1", "3", "7"]
  },
  {
    id: "3",
    title: "Emotions Through Animation",
    description: "How anime conveys complex emotions through simple yet powerful techniques.",
    content: `<p>Content for this blog post would go here...</p>`,
    imageUrl: "/lovable-uploads/82ada9d2-2b20-4ea9-b7a3-3f1f7413f221.png",
    date: "April 2, 2025",
    author: "Aiko Yamamoto",
    likes: 87,
    relatedPosts: ["1", "2", "4"]
  }
];

interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  date: string;
  author: string;
  likes: number;
  relatedPosts: string[];
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [liked, setLiked] = useState(false);
  
  useEffect(() => {
    // Find the blog post based on id
    const foundBlog = blogPosts.find(post => post.id === id);
    
    if (foundBlog) {
      setBlog(foundBlog);
      
      // Get related blogs
      const related = blogPosts.filter(post => 
        foundBlog.relatedPosts.includes(post.id)
      ).slice(0, 3);
      
      setRelatedBlogs(related);
    }
    
    // Reset like status when blog changes
    setLiked(false);
    
    // Scroll to top when blog changes
    window.scrollTo(0, 0);
  }, [id]);
  
  const handleLike = () => {
    setLiked(!liked);
    // In a real app, this would update a database
  };
  
  if (!blog) {
    return (
      <div className="container py-12 text-center">
        <div className="animate-pulse">
          <h2 className="text-2xl font-bold">Loading blog post...</h2>
        </div>
      </div>
    );
  }

  return (
    <article className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${blog.imageUrl})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center text-sm md:text-base text-muted-foreground gap-x-4">
              <span>{blog.date}</span>
              <span className="hidden md:inline">•</span>
              <span>By {blog.author}</span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill={liked ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {liked ? blog.likes + 1 : blog.likes} likes
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Blog Content */}
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <p className="text-xl mb-8 text-muted-foreground">
                {blog.description}
              </p>
              
              <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
            </div>
            
            <div className="border-t border-border pt-8 mt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 rounded-full px-4 py-2 ${
                      liked 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    } transition-colors`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill={liked ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{liked ? "Liked" : "Like"}</span>
                  </button>
                  
                  <div className="flex items-center text-muted-foreground">
                    <span className="text-sm">{liked ? blog.likes + 1 : blog.likes} likes</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    to="/blogs"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Back to blogs
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="rounded-lg border border-border p-6">
              <h3 className="text-xl font-bold mb-4">About the Author</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-lg font-bold">
                  {blog.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium">{blog.author}</h4>
                  <p className="text-sm text-muted-foreground">Anime Enthusiast</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                A passionate writer and anime fan with deep knowledge of the medium and its cultural impact.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Related Articles</h3>
              <div className="space-y-4">
                {relatedBlogs.map((relatedBlog) => (
                  <Link
                    key={relatedBlog.id}
                    to={`/blog/${relatedBlog.id}`}
                    className="group block"
                  >
                    <div className="flex space-x-4">
                      <div 
                        className="h-20 w-20 flex-shrink-0 rounded-md bg-cover bg-center"
                        style={{ backgroundImage: `url(${relatedBlog.imageUrl})` }}
                      ></div>
                      <div>
                        <h4 className="font-medium group-hover:text-primary transition-colors">
                          {relatedBlog.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {relatedBlog.date}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogDetail;
