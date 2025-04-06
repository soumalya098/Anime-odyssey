
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navigate } from "react-router-dom";

const AdminPage = () => {
  const { isAdmin } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const blogData = {
        title,
        description,
        content,
        imageUrl,
        author,
        date: serverTimestamp(),
        likes: []
      };

      await addDoc(collection(db, "blogs"), blogData);
      
      toast.success("Blog published successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setContent("");
      setImageUrl("");
      setAuthor("Admin");
    } catch (error) {
      console.error("Error adding blog:", error);
      toast.error("Failed to publish blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-anime-pink via-anime-purple to-anime-blue">
        Admin Dashboard
      </h1>
      
      <div className="max-w-3xl mx-auto glassmorphism p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-6">Create New Blog Post</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Blog Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a short description"
              required
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Blog Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here"
              required
              className="min-h-[200px]"
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="anime-button"
              disabled={isSubmitting}
            >
              <span className="relative z-10">
                {isSubmitting ? "Publishing..." : "Publish Blog"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;
