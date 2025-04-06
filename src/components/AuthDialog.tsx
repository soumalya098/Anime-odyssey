
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, UserPlus } from "lucide-react";

type AuthMode = "login" | "signup";

export const AuthDialog = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, currentUser } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
        toast.success("Successfully logged in!");
      } else {
        await signup(email, password);
        toast.success("Account created successfully!");
      }
      setOpen(false);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setEmail("");
    setPassword("");
  };

  if (currentUser) {
    return (
      <Button 
        onClick={() => {
          const { logout } = useAuth();
          logout();
          toast.success("Successfully logged out!");
        }}
        className="anime-button outline"
      >
        <span className="relative z-10">Logout</span>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="anime-button">
          <span className="relative z-10">
            {mode === "login" ? (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </>
            )}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glassmorphism">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-anime-pink via-anime-purple to-anime-blue">
            {mode === "login" ? "Welcome Back!" : "Join Anime Odyssey"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAuth} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="youremail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/50 backdrop-blur-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background/50 backdrop-blur-sm"
            />
          </div>

          <div className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="anime-button w-full"
              disabled={isLoading}
            >
              <span className="relative z-10">
                {isLoading ? "Processing..." : mode === "login" ? "Login" : "Sign Up"}
              </span>
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              onClick={toggleMode}
              className="w-full"
            >
              {mode === "login" ? "Need an account? Sign Up" : "Already have an account? Login"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
