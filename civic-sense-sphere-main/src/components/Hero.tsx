
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-1/4 w-96 h-96 bg-civiBlue/5 dark:bg-civiLightBlue/5 rounded-full blur-3xl"></div>
        <div className="absolute left-1/4 bottom-1/4 w-96 h-96 bg-civiBlue/10 dark:bg-civiLightBlue/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-6 text-4xl md:text-6xl font-bold tracking-tight animate-fade-in">
            Building a Better Community Together
          </h1>
          <p className="mb-8 text-lg md:text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
            CiviX rewards civic engagement through gamification, digital rewards, and smart civic tools. Make your community better while earning civic coins.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button asChild size="lg" className="text-base">
              <Link to="/civic-scroll">Explore CivicScroll</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base">
              <Link to="/smart-dustbin">Try Smart Dustbin</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container px-4 mx-auto mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center p-6 bg-card rounded-xl card-shadow animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="text-4xl font-bold text-civiBlue dark:text-civiLightBlue">5K+</div>
            <div className="text-muted-foreground">Active Citizens</div>
          </div>
          <div className="flex flex-col items-center p-6 bg-card rounded-xl card-shadow animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <div className="text-4xl font-bold text-civiBlue dark:text-civiLightBlue">10K+</div>
            <div className="text-muted-foreground">Civic Actions</div>
          </div>
          <div className="flex flex-col items-center p-6 bg-card rounded-xl card-shadow animate-fade-in" style={{ animationDelay: "0.8s" }}>
            <div className="text-4xl font-bold text-civiBlue dark:text-civiLightBlue">50K+</div>
            <div className="text-muted-foreground">Civic Coins Earned</div>
          </div>
        </div>
      </div>
    </section>
  );
}
