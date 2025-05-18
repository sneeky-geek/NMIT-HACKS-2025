import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Scroll, Recycle, Wallet, Target, ChevronUp, Users, Eye, Activity, TrendingUp, Calendar, Filter, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

// Mock data for dashboard charts and statistics
const mockActivityData = [
  { name: 'Jan', streams: 4, views: 24, followers: 5 },
  { name: 'Feb', streams: 5, views: 35, followers: 8 },
  { name: 'Mar', streams: 7, views: 45, followers: 10 },
  { name: 'Apr', streams: 6, views: 40, followers: 12 },
  { name: 'May', streams: 9, views: 60, followers: 15 }
];

const mockEngagementData = [
  { name: 'Comments', value: 45, color: '#a78bfa' },  // Purple to match site theme
  { name: 'Likes', value: 78, color: '#c084fc' },     // Lighter purple to match site theme
  { name: 'Shares', value: 23, color: '#8b5cf6' },    // Another purple shade to match site theme
];

const mockContributions = [
  { name: 'Mon', value: 3 },
  { name: 'Tue', value: 7 },
  { name: 'Wed', value: 5 },
  { name: 'Thu', value: 8 },
  { name: 'Fri', value: 12 },
  { name: 'Sat', value: 4 },
  { name: 'Sun', value: 6 }
];

const mockRecentActivities = [
  { id: 1, title: 'Thrown garbage in a bin', date: '2025-05-15', points: 10, category: 'Environment' },
  { id: 2, title: 'Planted a tree', date: '2025-05-12', points: 20, category: 'Environment' },
  { id: 3, title: 'Helped clean a park', date: '2025-05-10', points: 15, category: 'Community' },
  { id: 4, title: 'Participated in city planning', date: '2025-05-05', points: 25, category: 'Civic' }
];

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState('monthly');
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: 'Civic Scroll',
      description: 'Discover civic updates and community news',
      icon: <Scroll className="h-6 w-6 text-primary" />,
      path: '/civic-scroll'
    },
    {
      title: 'Smart Dustbin',
      description: 'Locate and use smart waste management solutions',
      icon: <Recycle className="h-6 w-6 text-primary" />,
      path: '/smart-dustbin'
    },
    {
      title: 'Civic Wallet',
      description: 'Manage your civic rewards and contributions',
      icon: <Wallet className="h-6 w-6 text-primary" />,
      path: '/civic-wallet'
    },
    {
      title: 'Missions',
      description: 'Join civic missions and NGO activities',
      icon: <Target className="h-6 w-6 text-primary" />,
      path: '/missions'
    }
  ];

  // Calculate total stats
  const totalStreams = mockActivityData.reduce((acc, curr) => acc + curr.streams, 0);
  const totalViews = mockActivityData.reduce((acc, curr) => acc + curr.views, 0);
  const totalFollowers = mockActivityData[mockActivityData.length - 1].followers;
  const totalEngagement = mockEngagementData.reduce((acc, curr) => acc + curr.value, 0);

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    }
  };

  const statsCards = [
    { title: 'Total Streams', value: totalStreams, icon: <Activity className="h-5 w-5 text-primary" />, color: 'from-primary/80 to-primary/60' },
    { title: 'Total Views', value: totalViews, icon: <Eye className="h-5 w-5 text-primary" />, color: 'from-primary/70 to-primary/50' },
    { title: 'Followers', value: totalFollowers, icon: <Users className="h-5 w-5 text-primary" />, color: 'from-primary/60 to-primary/40' },
    { title: 'Engagement', value: totalEngagement, icon: <TrendingUp className="h-5 w-5 text-primary" />, color: 'from-primary/50 to-primary/30' }
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-gradient-to-br dark:from-zinc-900 dark:to-zinc-800 relative">
      {/* Background elements similar to Hero section */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute right-1/4 top-1/4 w-[450px] h-[450px] bg-purple-400/15 dark:bg-purple-500/8 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute left-1/4 bottom-1/3 w-[400px] h-[400px] bg-purple-600/15 dark:bg-purple-600/8 rounded-full blur-3xl"></div>
        <div className="absolute left-1/3 top-1/3 w-10 h-10 bg-purple-400 rounded-full blur-md opacity-20 animate-float"></div>
        <div className="absolute right-1/3 bottom-1/4 w-12 h-12 bg-purple-500 rounded-full blur-md opacity-20 animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute right-1/2 top-1/2 w-8 h-8 bg-purple-300 rounded-full blur-sm opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
      </div>
      <Navbar />
      
      <div className="container px-4 mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* User Profile Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary/10 via-primary/5 to-background/80 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg mb-8"
          >
            {/* Header with user info */}
            <div className="flex flex-col md:flex-row gap-6 items-center bg-card dark:bg-zinc-800/50 rounded-xl p-6 shadow-sm border border-border dark:border-zinc-700">
              <Avatar className="h-24 w-24 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                {/* Using a professional person image for avatar */}
                <AvatarImage 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80" 
                  alt={user?.firstName || 'User'} 
                />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-primary-foreground text-white">
                  {user?.firstName?.charAt(0) || ''}{user?.lastName?.charAt(0) || ''}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-1">{user?.firstName} {user?.lastName}</h1>
                <p className="text-muted-foreground mb-3">{user?.email || 'No email provided'}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                    <Sparkles className="h-3 w-3 mr-1" /> Active Contributor
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground">
                    <Target className="h-3 w-3 mr-1" /> Level 5 Civic Member
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="text-center">
                  <span className="block text-3xl font-bold text-primary">125</span>
                  <span className="text-sm text-muted-foreground">Total Points</span>
                </div>
                <Progress value={progress} className="w-24 h-2" />
                <span className="text-xs text-muted-foreground">Next level: 75 points</span>
              </div>
            </div>
          </motion.div>

          {/* Time filter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-6"
          >
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Select Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[/* ... */].map((stat, index) => (
              <Card 
                key={stat.title} 
                className="bg-gradient-to-br from-background/50 to-background/80 backdrop-blur border-white/10 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={cn("p-2 rounded-full bg-primary/10", stat.color)}>
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className={cn("text-sm mt-1 flex items-center gap-1", stat.color)}>
                    <ChevronUp className="h-4 w-4" />
                    {stat.trend}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card dark:bg-zinc-800/50 p-6 rounded-xl border border-border dark:border-zinc-700 shadow-sm"
            >
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-lg font-semibold">Activity Overview</CardTitle>
                <CardDescription>Your streams, views and followers over time</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockActivityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme === 'dark' ? '#a78bfa' : '#8b5cf6'} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={theme === 'dark' ? '#a78bfa' : '#8b5cf6'} stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme === 'dark' ? '#c084fc' : '#9333ea'} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={theme === 'dark' ? '#c084fc' : '#9333ea'} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={true} stroke={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          borderRadius: '8px',
                          border: '1px solid rgba(0, 0, 0, 0.05)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                        }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="streams" stroke={theme === 'dark' ? '#a78bfa' : '#8b5cf6'} fillOpacity={1} fill="url(#colorStreams)" />
                      <Area type="monotone" dataKey="views" stroke={theme === 'dark' ? '#c084fc' : '#9333ea'} fillOpacity={1} fill="url(#colorViews)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-card dark:bg-zinc-800/50 p-6 rounded-xl border border-border dark:border-zinc-700 shadow-sm"
            >
              <Tabs defaultValue="engagement">
                <div className="flex justify-between items-center mb-4">
                  <CardTitle className="text-lg font-semibold">Metrics</CardTitle>
                  <TabsList className="grid w-full max-w-[300px] grid-cols-2">
                    <TabsTrigger value="engagement">Engagement</TabsTrigger>
                    <TabsTrigger value="contributions">Contributions</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="engagement" className="mt-0">
                  <CardDescription className="mb-4">How people interact with your content</CardDescription>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockEngagementData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {mockEngagementData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} interactions`, null]}
                          contentStyle={{ 
                            backgroundColor: theme === 'dark' ? 'rgba(24, 24, 27, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
                            borderRadius: '8px',
                            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
                            boxShadow: theme === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.05)',
                            color: theme === 'dark' ? '#fff' : 'inherit'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="contributions" className="mt-0">
                  <CardDescription className="mb-4">Your daily civic contributions</CardDescription>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockContributions}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${value} activities`, null]}
                          contentStyle={{ 
                            backgroundColor: theme === 'dark' ? 'rgba(24, 24, 27, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
                            borderRadius: '8px',
                            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
                            boxShadow: theme === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.05)',
                            color: theme === 'dark' ? '#fff' : 'inherit'
                          }}
                        />
                        <Bar dataKey="value" fill={theme === 'dark' ? '#a78bfa' : '#8b5cf6'} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Recent Activities */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-primary/5 to-background/80 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-lg mb-8"
          >
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg font-semibold">Recent Civic Activities</CardTitle>
              <CardDescription>Your latest contributions to the community</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="space-y-4 mt-2">
                {mockRecentActivities.map((activity) => (
                  <li key={activity.id}>
                    <motion.div 
                      className="flex justify-between items-center p-3 rounded-lg hover:bg-primary/5 transition-colors"
                      whileHover={{ x: 5, backgroundColor: 'rgba(var(--primary), 0.1)' }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-medium block">{activity.title}</span>
                          <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                            <span>{activity.date}</span>
                            <Separator orientation="vertical" className="h-4" />
                            <span className="text-xs px-1.5 py-0.5 rounded bg-primary/5 dark:bg-primary/10">{activity.category}</span>
                          </div>
                        </div>
                      </div>
                      <span className="font-bold text-primary">+{activity.points} pts</span>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </motion.div>

          {/* Features Grid */}
          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-bold mb-4">Features & Opportunities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Card className="h-full cursor-pointer bg-gradient-to-br from-background/50 to-background/80 backdrop-blur border-white/10 shadow-lg hover:shadow-xl transition-all duration-200" onClick={() => navigate(feature.path)}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        {feature.icon}
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => navigate(feature.path)}>
                        Explore
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;
