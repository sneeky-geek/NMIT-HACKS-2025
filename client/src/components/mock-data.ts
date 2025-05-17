
export interface CivicPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  image?: string;
  likes: number;
  bookmarked: boolean;
  tags: string[];
}

export interface CivicTransaction {
  id: string;
  type: "earned" | "spent";
  amount: number;
  description: string;
  date: string;
}

export const mockPosts: CivicPost[] = [
  {
    id: "1",
    title: "Local Park Clean-Up Initiative",
    content: "Join us this Saturday for a community clean-up at Central Park. Bring gloves and water!",
    author: "Community Council",
    date: "2025-05-10",
    image: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    likes: 45,
    bookmarked: false,
    tags: ["community", "environment", "volunteer"]
  },
  {
    id: "2",
    title: "Road Safety Campaign",
    content: "Our new campaign focuses on pedestrian safety. Learn how you can contribute to safer streets.",
    author: "Traffic Department",
    date: "2025-05-14",
    image: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    likes: 32,
    bookmarked: true,
    tags: ["safety", "roads", "awareness"]
  },
  {
    id: "3",
    title: "Water Conservation Tips",
    content: "With summer approaching, here are 10 simple ways to conserve water in your daily routine.",
    author: "Environmental Agency",
    date: "2025-05-12",
    image: "https://images.unsplash.com/photo-1527066236128-2ff79f7b9705?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    likes: 67,
    bookmarked: false,
    tags: ["water", "conservation", "tips"]
  },
  {
    id: "4",
    title: "Mental Health Awareness Workshop",
    content: "Free virtual workshop on understanding anxiety and depression. Register now to participate.",
    author: "Health Department",
    date: "2025-05-15",
    likes: 89,
    bookmarked: false,
    tags: ["health", "mental health", "workshop"]
  },
  {
    id: "5",
    title: "New Recycling Program Launch",
    content: "Our city is launching an advanced recycling program next month. Here's what you need to know.",
    author: "Waste Management",
    date: "2025-05-08",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    likes: 54,
    bookmarked: true,
    tags: ["recycling", "environment", "city"]
  }
];

export const mockTransactions: CivicTransaction[] = [
  {
    id: "t1",
    type: "earned",
    amount: 10,
    description: "Recycled 2kg of plastic",
    date: "2025-05-15"
  },
  {
    id: "t2",
    type: "earned",
    amount: 15,
    description: "Reported road hazard",
    date: "2025-05-14"
  },
  {
    id: "t3",
    type: "spent",
    amount: 20,
    description: "Donated to park renovation",
    date: "2025-05-13"
  },
  {
    id: "t4",
    type: "earned",
    amount: 5,
    description: "Verified information post",
    date: "2025-05-12"
  },
  {
    id: "t5",
    type: "spent",
    amount: 30,
    description: "Redeemed eco-friendly product",
    date: "2025-05-10"
  }
];

export const civicScore = {
  overall: 840,
  maxScore: 1000,
  categories: [
    { name: "Environmental", score: 870 },
    { name: "Community", score: 825 },
    { name: "Information", score: 780 },
    { name: "Public Spaces", score: 885 }
  ]
};

export interface RewardCoupon {
  id: string;
  brand: string;
  brandLogo: string;
  title: string;
  description: string;
  category: 'shopping' | 'telecom' | 'entertainment' | 'food' | 'travel' | 'local';
  coinCost: number;
  expiryDays: number;
  discount?: string;
  featured?: boolean;
  bgGradient?: string;
}

export const mockRewards: RewardCoupon[] = [
  {
    id: "r1",
    brand: "Amazon",
    brandLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png",
    title: "₹200 Off on ₹1000",
    description: "Get ₹200 off on purchases above ₹1000 on Amazon India.",
    category: "shopping",
    coinCost: 350,
    expiryDays: 30,
    discount: "20%",
    featured: true,
    bgGradient: "from-blue-500/20 to-blue-600/20"
  },
  {
    id: "r2",
    brand: "Jio",
    brandLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Jio_logo.svg/1200px-Jio_logo.svg.png",
    title: "2GB Extra Data",
    description: "Get 2GB additional data on your next recharge.",
    category: "telecom",
    coinCost: 200,
    expiryDays: 15,
    bgGradient: "from-pink-500/20 to-purple-500/20"
  },
  {
    id: "r3",
    brand: "Hotstar",
    brandLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Disney%2B_Hotstar_logo.svg/1280px-Disney%2B_Hotstar_logo.svg.png",
    title: "1 Month Premium",
    description: "Enjoy 1 month of Disney+ Hotstar Premium subscription.",
    category: "entertainment",
    coinCost: 500,
    expiryDays: 7,
    featured: true,
    bgGradient: "from-blue-800/20 to-blue-900/20"
  },
  {
    id: "r4",
    brand: "Swiggy",
    brandLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Swiggy_logo.svg/1200px-Swiggy_logo.svg.png",
    title: "₹100 Off",
    description: "Get ₹100 off on your next food order on Swiggy.",
    category: "food",
    coinCost: 250,
    expiryDays: 14,
    discount: "Flat ₹100",
    bgGradient: "from-orange-500/20 to-orange-600/20"
  },
  {
    id: "r5",
    brand: "Airtel",
    brandLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Bharti_Airtel_Logo.svg/1024px-Bharti_Airtel_Logo.svg.png",
    title: "10% Cashback",
    description: "Get 10% cashback on your next mobile recharge.",
    category: "telecom",
    coinCost: 180,
    expiryDays: 30,
    discount: "10%",
    bgGradient: "from-red-500/20 to-red-600/20"
  },
  {
    id: "r6",
    brand: "Flipkart",
    brandLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Flipkart_logo.svg/1280px-Flipkart_logo.svg.png",
    title: "₹150 Off Coupon",
    description: "Get ₹150 off on purchases above ₹800 on Flipkart.",
    category: "shopping",
    coinCost: 300,
    expiryDays: 21,
    discount: "₹150 Off",
    bgGradient: "from-yellow-400/20 to-blue-500/20"
  },
  {
    id: "r7",
    brand: "Spotify",
    brandLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1024px-Spotify_logo_without_text.svg.png",
    title: "2 Weeks Premium",
    description: "Enjoy 2 weeks of Spotify Premium subscription.",
    category: "entertainment",
    coinCost: 280,
    expiryDays: 10,
    bgGradient: "from-green-500/20 to-green-600/20"
  },
  {
    id: "r8",
    brand: "Zomato",
    brandLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Zomato_logo.png/1200px-Zomato_logo.png",
    title: "30% Off (up to ₹150)",
    description: "Get 30% off up to ₹150 on your next food order.",
    category: "food",
    coinCost: 270,
    expiryDays: 14,
    discount: "30%",
    featured: true,
    bgGradient: "from-red-500/20 to-red-600/20"
  },
  {
    id: "r9",
    brand: "MakeMyTrip",
    brandLogo: "https://imgak.mmtcdn.com/pwa_v3/pwa_hotel_assets/header/logo@2x.png",
    title: "₹500 Off on Flights",
    description: "Get ₹500 off on domestic flight bookings.",
    category: "travel",
    coinCost: 450,
    expiryDays: 45,
    discount: "₹500 Off",
    bgGradient: "from-blue-400/20 to-indigo-500/20"
  },
  {
    id: "r10",
    brand: "Starbucks",
    brandLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png",
    title: "Buy 1 Get 1 Free",
    description: "Buy one coffee and get one free at Starbucks outlets.",
    category: "local",
    coinCost: 220,
    expiryDays: 30,
    discount: "BOGO",
    bgGradient: "from-green-700/20 to-green-800/20"
  }
];
