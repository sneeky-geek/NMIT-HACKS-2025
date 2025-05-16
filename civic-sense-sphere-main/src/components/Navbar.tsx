
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    { name: "Home", path: "/" },
    { name: "CivicScroll", path: "/civic-scroll" },
    { name: "Smart Dustbin", path: "/smart-dustbin" },
    { name: "Civic Wallet", path: "/civic-wallet" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-civiBlue flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="font-semibold text-lg">CiviX</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              {route.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button className="hidden md:flex">Sign In</Button>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background md:hidden transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
          <div className="flex flex-col space-y-6 mt-6">
            {routes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className="text-foreground/70 hover:text-foreground transition-colors text-lg"
                onClick={() => setIsOpen(false)}
              >
                {route.name}
              </Link>
            ))}
            <Button className="w-full mt-4">Sign In</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
