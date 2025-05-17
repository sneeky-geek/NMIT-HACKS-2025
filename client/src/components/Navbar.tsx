import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Home, Scroll, Trash2, Wallet, LogIn, LogOut, Trophy, User, SearchCheck, Briefcase, Coins, AlertTriangle } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userTokens, setUserTokens] = useState<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  
  // Fetch user tokens when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // If tokens are available in user object, use them
      if (user.tokens !== undefined) {
        setUserTokens(user.tokens);
      } else {
        // Otherwise fetch from API
        const fetchTokens = async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) return;
            
            const response = await fetch('http://localhost:3000/api/tokens/balance', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              setUserTokens(data.tokens);
            }
          } catch (error) {
            console.error('Error fetching tokens:', error);
          }
        };
        
        fetchTokens();
      }
    }
  }, [isAuthenticated, user]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Public routes available to all users
  const publicRoutes = [
    { name: "Home", path: "/", icon: <Home className="w-4 h-4" /> },
  ];
  
  // Protected routes only for authenticated users
  const protectedRoutes = [
    { name: "CivicScroll", path: "/civic-scroll", icon: <Scroll className="w-4 h-4" /> },
    { name: "Smart Dustbin", path: "/smart-dustbin", icon: <Trash2 className="w-4 h-4" /> },
    { name: "Civic Wallet", path: "/civic-wallet", icon: <Wallet className="w-4 h-4" /> },
    { name: "FactCheck", path: "/fact-check", icon: <SearchCheck className="w-4 h-4" /> },
    { name: "Missions", path: "/missions", icon: <Trophy className="w-4 h-4" /> },
  ];
  
  // Combine routes based on authentication status
  const routes = isAuthenticated 
    ? [...publicRoutes, ...protectedRoutes]
    : publicRoutes;

  const itemVariants = {
    closed: { opacity: 0, y: 10 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled 
        ? "bg-background/90 backdrop-blur-md shadow-sm border-b border-border/50" 
        : "bg-background/70 backdrop-blur-sm"
    )}>
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="flex items-center space-x-2 group">
          <img src="/logo.png" alt="CiviX Logo" className="h-16 w-auto transform transition-transform group-hover:scale-110 duration-300" />
          <span className="font-poppins font-semibold text-lg tracking-tight">CiviX</span>
        </Link>

        {/* Desktop navigation - only shown when user is logged in */}
        {isAuthenticated && (
          <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-2">
            {routes.map((route) => {
              const isActive = location.pathname === route.path;
              return (
                <Link
                  key={route.path}
                  to={route.path}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-foreground/70 hover:text-foreground hover:bg-accent"
                  )}
                >
                  {route.icon}
                  <span>{route.name}</span>
                </Link>
              );
            })}
          </div>
        )}

        <div className="flex items-center space-x-3">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <>
              {/* Token display for authenticated users */}
              {user?.userType === 'user' && (
                <div className="hidden md:flex items-center mr-2">
                  <div className="bg-amber-100 dark:bg-amber-950 rounded-full px-3 py-0.5 flex items-center gap-1 shadow-sm border border-amber-200 dark:border-amber-900">
                    <Coins className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" />
                    <span className="text-amber-700 dark:text-amber-400 text-sm font-medium">
                      {userTokens !== null ? userTokens : '...'}
                    </span>
                  </div>
                </div>
              )}

              {/* My Work icon for users who have volunteered */}
              {user?.userType === 'user' && user?.volunteeredEvents && user.volunteeredEvents.length > 0 && (
                <div className="hidden md:block mr-2">
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 p-0 rounded-full"
                    onClick={() => navigate('/my-work')}
                    title="My Volunteering Work"
                  >
                    <Briefcase className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {/* My Dashboard button for NGO users */}
              {user?.userType === 'ngo' && (
                <div className="hidden md:block mr-2">
                  <Button 
                    size="sm"
                    variant="secondary"
                    className="flex items-center gap-1.5 font-medium px-4 rounded-full shadow-sm hover:shadow-md"
                    onClick={() => navigate('/ngo-dashboard')}
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>My Dashboard</span>
                  </Button>
                </div>
              )}

              <div className="hidden md:flex">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="font-medium px-4 rounded-full shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 flex items-center gap-1.5"
                    >
                      <User className="w-4 h-4" />
                      <span>{user?.firstName || 'Account'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user?.userType === 'ngo' ? 'NGO Account' : 'User Account'}
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate(user?.userType === 'ngo' ? '/ngo-dashboard' : '/dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  
                  {/* Only show My Work for regular users */}
                  {user?.userType === 'user' && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/my-work')}>
                        <Briefcase className="w-4 h-4 mr-2" /> My Work
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/complaints')}>
                        <AlertTriangle className="w-4 h-4 mr-2" /> Report Issues
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    logout();
                    navigate('/');
                  }} className="text-red-500">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
            </>
          ) : (
            <Link to="/login" className="hidden md:flex">
              <Button 
                size="sm" 
                className="font-medium px-4 rounded-full shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Button>
            </Link>
          )}
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full hover:bg-accent"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-background/98 backdrop-blur-lg md:hidden"
        >
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-accent"
                onClick={() => setIsOpen(false)}
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex flex-col space-y-4 mt-12 items-start px-4">
              {isAuthenticated && routes.map((route, index) => {
                const isActive = location.pathname === route.path;
                return (
                  <motion.div
                    key={route.path}
                    initial="closed"
                    animate="open"
                    variants={itemVariants}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="w-full"
                  >
                    <Link
                      to={route.path}
                      className={cn(
                        "flex items-center gap-3 py-3 px-4 rounded-lg w-full text-lg font-medium transition-colors",
                        isActive 
                          ? "text-primary bg-primary/10" 
                          : "text-foreground/80 hover:text-foreground hover:bg-accent/50"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="p-2 rounded-md bg-muted flex items-center justify-center">
                        {route.icon}
                      </div>
                      {route.name}
                    </Link>
                  </motion.div>
                );
              })}
              {/* Special items for users */}
              {isAuthenticated && user?.userType === 'user' && (
                <motion.div
                  initial="closed"
                  animate="open"
                  variants={itemVariants}
                  transition={{ duration: 0.4, delay: routes.length * 0.1 }}
                  className="w-full mt-4"
                >
                  <Link
                    to="/complaints"
                    className="flex items-center gap-3 py-3 px-4 rounded-lg w-full text-lg font-medium transition-colors bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="p-2 rounded-md bg-amber-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    Report Issues
                  </Link>
                </motion.div>
              )}
              
              {isAuthenticated && (
                <motion.div
                  initial="closed"
                  animate="open"
                  variants={itemVariants}
                  transition={{ duration: 0.4, delay: (routes.length + 1) * 0.1 }}
                  className="w-full mt-4"
                >
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="flex items-center gap-3 py-3 px-4 rounded-lg w-full text-lg font-medium text-red-500 transition-colors hover:bg-red-500/10"
                  >
                    <div className="p-2 rounded-md bg-red-500/10 flex items-center justify-center">
                      <LogOut className="w-4 h-4 text-red-500" />
                    </div>
                    Logout
                  </button>
                </motion.div>
              )}
              {!isAuthenticated && (
                <motion.div
                  initial="closed"
                  animate="open"
                  variants={itemVariants}
                  transition={{ duration: 0.4, delay: routes.length * 0.1 }}
                  className="w-full mt-6"
                >
                  <Button 
                    onClick={() => navigate('/login')}
                    className="w-full mt-4 py-6 rounded-lg flex items-center justify-center gap-2 text-lg"
                  >
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
