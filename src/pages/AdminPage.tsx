
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, addDoc, serverTimestamp, getDocs, doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Edit, Trash, Image, AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [isFeatured, setIsFeatured] = useState(false);
  const [isLatest, setIsLatest] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

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
        tags: doc.data().tags || [],
        likes: doc.data().likes || []
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
        
        // Set category checkboxes based on tags
        setIsFeatured(blogData.tags?.includes("featured") || false);
        setIsLatest(blogData.tags?.includes("latest") || false);
        
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

  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;
    
    try {
      await deleteDoc(doc(db, "blogs", blogToDelete));
      toast.success("Blog deleted successfully!");
      fetchBlogs(); // Refresh blog list
      setBlogToDelete(null); // Close dialog
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
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
    
    // Create a proper markdown image that will be parsed correctly
    const imageMarkdown = `\n![Image](${imageUrl})\n`;
    
    setContent(prevContent => {
      return prevContent + imageMarkdown;
    });
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setContent("");
    setImageUrl("");
    setAuthor("Admin");
    setTags([]);
    setIsFeatured(false);
    setIsLatest(false);
    setIsEditing(false);
    setSearchParams({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create a copy of tags array
      let updatedTags = [...tags];
      
      // Manage special category tags
      if (isFeatured && !updatedTags.includes("featured")) {
        updatedTags.push("featured");
      } else if (!isFeatured && updatedTags.includes("featured")) {
        updatedTags = updatedTags.filter(tag => tag !== "featured");
      }
      
      if (isLatest && !updatedTags.includes("latest")) {
        updatedTags.push("latest");
      } else if (!isLatest && updatedTags.includes("latest")) {
        updatedTags = updatedTags.filter(tag => tag !== "latest");
      }

      const blogData = {
        title,
        description,
        content,
        imageUrl,
        author,
        tags: updatedTags,
        date: isEditing ? serverTimestamp() : serverTimestamp(),
        likes: []
      };

      if (isEditing && editId) {
        // Update existing blog
        const blogRef = doc(db, "blogs", editId);
        const blogSnap = await getDoc(blogRef);
        if (blogSnap.exists()) {
          const existingLikes = blogSnap.data().likes || [];
          await updateDoc(blogRef, { 
            ...blogData,
            likes: existingLikes  // Preserve existing likes
          });
        } else {
          await updateDoc(blogRef, blogData);
        }
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

  // Helper to check if a tag is a "category" tag we manage separately
  const isSpecialCategoryTag = (tag: string) => {
    return tag === "featured" || tag === "latest";
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
            
            <div className="space-y-3">
              <Label>Blog Categories</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={isFeatured}
                    onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                  />
                  <Label htmlFor="isFeatured" className="font-normal cursor-pointer">
                    Featured Blog (show in Featured section)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isLatest"
                    checked={isLatest}
                    onCheckedChange={(checked) => setIsLatest(checked as boolean)}
                  />
                  <Label htmlFor="isLatest" className="font-normal cursor-pointer">
                    Latest Blog (show in Latest section)
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.filter(tag => !isSpecialCategoryTag(tag)).map((tag, index) => (
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
                  placeholder="Add a tag (e.g., action, romance, shonen)"
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
                placeholder="Write your blog content here. Use the Insert Image button to add images between paragraphs."
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
                        <span key={index} className={`px-2 py-0.5 rounded-full text-xs ${
                          tag === 'featured' ? 'bg-green-500/30 text-green-200' : 
                          tag === 'latest' ? 'bg-blue-500/30 text-blue-200' : 
                          'bg-secondary/50'
                        }`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
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
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setBlogToDelete(blog.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!blogToDelete} onOpenChange={(open) => !open && setBlogToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this blog?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBlog} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPage;
