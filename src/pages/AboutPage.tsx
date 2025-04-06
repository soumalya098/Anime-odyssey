
const AboutPage = () => {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About Anime Odyssey</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-8 text-center">
            A blog for anime enthusiasts, by enthusiasts, dedicated to exploring the rich and diverse world of Japanese animation.
          </p>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="mb-4">
              At Anime Odyssey, we believe in the power of anime to inspire, entertain, and bring people together. Our mission is to create a welcoming space for fans to discover new series, engage in thoughtful discussions, and celebrate the art form we all love.
            </p>
            <p>
              Whether you're a seasoned otaku or just beginning your anime journey, our content is crafted to enhance your appreciation and understanding of this unique medium.
            </p>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">What We Cover</h2>
            <ul className="space-y-2 list-disc pl-6">
              <li>In-depth analysis of both classic and current anime series</li>
              <li>Profiles on influential creators, studios, and industry trends</li>
              <li>Explorations of anime's artistic elements, from animation techniques to music</li>
              <li>Cultural context and the impact of anime globally</li>
              <li>Reviews and recommendations for every type of anime fan</li>
              <li>Community discussions and fan theories</li>
            </ul>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Team</h2>
            <p className="mb-4">
              Our writers and editors are passionate fans who bring diverse perspectives and expertise to every article. From animation professionals to cultural scholars to dedicated viewers, our team approaches anime with both enthusiasm and critical insight.
            </p>
            <p>
              We're committed to creating content that respects the depth and complexity of anime while remaining accessible and engaging for readers of all backgrounds.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
            <p className="mb-4">
              Anime Odyssey is more than just a blog—it's a community. We encourage readers to engage with our content, share their own insights, and connect with fellow fans.
            </p>
            <p>
              Follow us on social media, subscribe to our newsletter, or reach out through our contact page. We're always excited to hear from fellow anime enthusiasts!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
