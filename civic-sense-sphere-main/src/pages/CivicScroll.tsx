
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { mockPosts, type CivicPost } from "@/components/mock-data";
import { Bookmark, Heart, MessageSquare, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const CivicScroll = () => {
  const [posts, setPosts] = useState<CivicPost[]>(mockPosts);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleBookmark = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, bookmarked: !post.bookmarked }
          : post
      )
    );
    
    const post = posts.find(p => p.id === postId);
    if (post) {
      toast({
        title: post.bookmarked ? "Removed from bookmarks" : "Added to bookmarks",
        description: post.title
      });
    }
  };

  const toggleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">CivicScroll</h1>
            <p className="text-muted-foreground mb-8">
              Stay informed with personalized civic content curated for you
            </p>
            
            <div className="mb-8">
              <Input 
                type="text" 
                placeholder="Search for posts, topics, or tags..." 
                className="w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
                <TabsTrigger value="environment">Environment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="space-y-6">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        onBookmark={toggleBookmark} 
                        onLike={toggleLike} 
                      />
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No posts matching your search</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="bookmarked">
                <div className="space-y-6">
                  {filteredPosts.filter(post => post.bookmarked).length > 0 ? (
                    filteredPosts
                      .filter(post => post.bookmarked)
                      .map((post) => (
                        <PostCard 
                          key={post.id} 
                          post={post} 
                          onBookmark={toggleBookmark} 
                          onLike={toggleLike}
                        />
                      ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No bookmarked posts</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="community">
                <div className="space-y-6">
                  {filteredPosts.filter(post => post.tags.includes("community")).length > 0 ? (
                    filteredPosts
                      .filter(post => post.tags.includes("community"))
                      .map((post) => (
                        <PostCard 
                          key={post.id} 
                          post={post} 
                          onBookmark={toggleBookmark} 
                          onLike={toggleLike}
                        />
                      ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No community posts</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="environment">
                <div className="space-y-6">
                  {filteredPosts.filter(post => post.tags.includes("environment")).length > 0 ? (
                    filteredPosts
                      .filter(post => post.tags.includes("environment"))
                      .map((post) => (
                        <PostCard 
                          key={post.id} 
                          post={post} 
                          onBookmark={toggleBookmark} 
                          onLike={toggleLike}
                        />
                      ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No environment posts</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <footer className="py-8 border-t">
        <div className="container px-4 mx-auto">
          <div className="text-center text-sm text-muted-foreground">
            © 2025 CiviX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

interface PostCardProps {
  post: CivicPost;
  onBookmark: (id: string) => void;
  onLike: (id: string) => void;
}

const PostCard = ({ post, onBookmark, onLike }: PostCardProps) => {
  return (
    <Card className="overflow-hidden hover-scale">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="text-sm text-muted-foreground">
              By {post.author} • {post.date}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onBookmark(post.id)}
          >
            <Bookmark 
              className={`h-5 w-5 ${post.bookmarked ? "fill-primary" : ""}`} 
            />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {post.image && (
          <div className="aspect-video mb-4 overflow-hidden rounded-md">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
            />
          </div>
        )}
        
        <p className="mb-4">{post.content}</p>
        
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-3 flex justify-between">
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onLike(post.id)}>
            <Heart className="h-4 w-4 mr-1" />
            {post.likes}
          </Button>
          <Button variant="ghost" size="sm">
            <MessageSquare className="h-4 w-4 mr-1" />
            Comment
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          <Share className="h-4 w-4 mr-1" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CivicScroll;
