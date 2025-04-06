
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, addDoc, serverTimestamp, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Edit, Image } from "lucide-react";

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

const AdminPage = () => {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [currentTab, setCurrentTab] = useState("create");

  // Load blogs for management
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Check if we're editing a blog
  useEffect(() => {
    if (editId) {
      loadBlogForEditing(editId);
      setCurrentTab("create");
    }
  }, [editId]);

  // Filter blogs based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = blogs.filter(
        blog => 
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredBlogs(filtered);
    } else {
      setFilteredBlogs(blogs);
    }
  }, [searchTerm, blogs]);

  const fetchBlogs = async () => {
    try {
      const blogsRef = collection(db, "blogs");
      const snapshot = await getDocs(blogsRef);
      const blogsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        tags: doc.data().tags || []
      })) as Blog[];
      setBlogs(blogsData);
      setFilteredBlogs(blogsData);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
    }
  };

  const loadBlogForEditing = async (id: string) => {
    try {
      const blogRef = doc(db, "blogs", id);
      const blogSnap = await getDoc(blogRef);
      
      if (blogSnap.exists()) {
        const blogData = blogSnap.data();
        setTitle(blogData.title || "");
        setDescription(blogData.description || "");
        setContent(blogData.content || "");
        setImageUrl(blogData.imageUrl || "");
        setAuthor(blogData.author || "Admin");
        setTags(blogData.tags || []);
        setIsEditing(true);
        toast.info("Blog loaded for editing");
      } else {
        toast.error("Blog not found");
      }
    } catch (error) {
      console.error("Error loading blog:", error);
      toast.error("Failed to load blog for editing");
    }
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const insertImageAtCursor = () => {
    const imageUrl = prompt("Enter image URL:");
    if (!imageUrl) return;
    
    const imageMarkup = `\n![Image](${imageUrl})\n`;
    setContent(prevContent => {
      return prevContent + imageMarkup;
    });
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setContent("");
    setImageUrl("");
    setAuthor("Admin");
    setTags([]);
    setIsEditing(false);
    setSearchParams({});
  };

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
        tags,
        date: isEditing ? serverTimestamp() : serverTimestamp(),
        likes: []
      };

      if (isEditing && editId) {
        // Update existing blog
        const blogRef = doc(db, "blogs", editId);
        await updateDoc(blogRef, blogData);
        toast.success("Blog updated successfully!");
      } else {
        // Create new blog
        await addDoc(collection(db, "blogs"), blogData);
        toast.success("Blog published successfully!");
      }
      
      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error(isEditing ? "Failed to update blog" : "Failed to publish blog");
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
      
      <Tabs defaultValue="create" value={currentTab} onValueChange={setCurrentTab} className="max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="create">
            {isEditing ? "Edit Blog" : "Create Blog"}
          </TabsTrigger>
          <TabsTrigger value="manage">Manage Blogs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="glassmorphism p-6 rounded-lg">
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
              <Label htmlFor="imageUrl">Cover Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <div key={index} className="bg-secondary px-3 py-1 rounded-full flex items-center gap-2">
                    <span>{tag}</span>
                    <button 
                      type="button" 
                      onClick={() => removeTag(tag)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag (e.g., featured, latest, action, romance)"
                />
                <Button 
                  type="button" 
                  onClick={addTag}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
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
              <div className="flex justify-between items-center">
                <Label htmlFor="content">Blog Content</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={insertImageAtCursor}
                >
                  <Image className="h-4 w-4 mr-2" />
                  Insert Image
                </Button>
              </div>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog content here. Use ![Image](URL) to embed images."
                required
                className="min-h-[300px] font-mono"
              />
            </div>
            
            <div className="flex justify-end gap-4">
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel Edit
                </Button>
              )}
              <Button 
                type="submit" 
                className="anime-button"
                disabled={isSubmitting}
              >
                <span className="relative z-10">
                  {isSubmitting 
                    ? (isEditing ? "Updating..." : "Publishing...") 
                    : (isEditing ? "Update Blog" : "Publish Blog")}
                </span>
              </Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="manage" className="glassmorphism p-6 rounded-lg">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search blogs by title, description, or tags"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map(blog => (
                <div key={blog.id} className="border border-border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{blog.title}</h3>
                    <div className="text-sm text-muted-foreground flex flex-wrap gap-2 mt-1">
                      {blog.tags.map((tag, index) => (
                        <span key={index} className="bg-secondary/50 px-2 py-0.5 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchParams({ edit: blog.id });
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "No blogs found matching your search" : "No blogs available yet"}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
