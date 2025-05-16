import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeatureCard } from "@/components/FeatureCard";
import { Calendar, Coins, Info, Trash, Bookmark, BarChart3, Heart } from "lucide-react";

const Index = () => {
  const features = [
    {
      title: "CivicScroll",
      description: "Personalized civic content feed curated by AI, keeping you informed about your community.",
      icon: <Bookmark className="h-6 w-6" />
    },
    {
      title: "Smart Dustbin",
      description: "Scan QR codes on smart bins and earn civic coins for responsible waste disposal.",
      icon: <Trash className="h-6 w-6" />
    },
    {
      title: "Civic Coin Wallet",
      description: "Track your earned coins and redeem them for rewards or use them for donations.",
      icon: <Coins className="h-6 w-6" />
    },
    {
      title: "Behavior Tracker",
      description: "Monitor your civic score based on your community contributions and engagement.",
      icon: <BarChart3 className="h-6 w-6" />
    },
    {
      title: "Info Verifier",
      description: "Submit content for verification and earn rewards for sharing accurate information.",
      icon: <Info className="h-6 w-6" />
    },
    {
      title: "Mental Health Room",
      description: "Access resources for mental well-being, including guides and support services.",
      icon: <Heart className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        {/* Features Section */}
        <section className="py-20 bg-secondary/50">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Features</h2>
              <p className="text-muted-foreground">
                Explore the tools and services that make civic engagement rewarding and enjoyable.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  delay={0.1 * index}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground">
                CiviX makes civic engagement simple, rewarding, and impactful.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2">Engage</h3>
                <p className="text-muted-foreground">Participate in civic activities like proper waste disposal, information verification</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">Earn</h3>
                <p className="text-muted-foreground">Collect Civic Coins as rewards for your positive contributions to the community</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2">Benefit</h3>
                <p className="text-muted-foreground">Redeem coins for rewards or donate them to community causes</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join CiviX today and start your journey toward better civic engagement and a stronger community.
            </p>
            <button className="px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-white/90 transition-colors">
              Sign Up Now
            </button>
          </div>
        </section>
      </main>
      
      <footer className="py-8 border-t">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-civiBlue flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="font-semibold text-lg">CiviX</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 CiviX. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
