
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
    brandLogo: "data:image/jpeg;base64,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",
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
    brandLogo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAbFBMVEUKKIX///8AAHwAHoIAEH4AJIQAIYMAGoEADX4AHIEAAHi5utEAE39MWZq/wdeeosNob6UlOYxJVJjS1OPv8PXJy93i4+yQlbtrc6d3fa2GjLU/S5QuPY339/oNK4ausMwgMol+hLFXYZ4zQo9+uff4AAACvUlEQVRIiZ2X25qCIBCAceQkslkeU1er7f3fcYFBy0Lrcy7KlF+GOUeikNRpc85P43jKz01aB5eQ91tVq4EKzogRxgUF2VZfgFkMCXmRBHj2AcyUfqVQtMo2wGKkYcwKHYs1sFNsnTPnVV0QHPqN7fym/fAOliT+xBGzpHwFy5h/5gjhcbkEh/ErzpDjsAD7N9+tSdI/g91HuzyEdg+wUN9zhKhiBseg/2IRtjMbJzALKcrksTvK4Btp5kEIcVdr9/I3SAKC2SKumQSgjMiDM0ElQ6DOHLjwIL8fiiK9MsD0LUPamFUWrBbP5IDr/Y4r9obKgO2z7/mfD4j4172hDwdU0hpwcYr4iOAP58kt69hK4DMakRrCoMl5pSY/CaD2Q882hpqkNAzKphzKzKmjWVNbxevLaVKPpqQRQVDjhTUAPCV+5vUTDTnzIAgX92308VdeDkjyM8lZGExxnRRttJDOachyciLboPKJW1T+Ao95IuM2CGfEBIDEen5zfh8/gcqdcLBpwmDwx3bgB1VVhV/2oXQvKQBVnYwjnAYJahblSxB30a4LuIgxxvHuUF1rb9AGwV5N4OGxC7iXuLg37sAAEDebl6Cu3nSxnEDsNTllTGN9u2gMANQCXJ2tpx5aA52smuOd2/V6w6s/jiGHQQ5LLzdiAiW8NGS/vvZpBcPzw0GTGeT9EsydTeSUyOK5g0U/sbegrUc+3L2cXYFyiYyl4ykF6l7YKud0OBlnifvcUYs7FjZXOiLMcq3bS1VUhywHpwwnt6bDVsTg3qRFcWju4FOJL8pjrCUoKeY0E0JMmcOEVCDnn748BgvypviCHG4BGzK3gJWmsyaPprO/ze1urPtbeTSQb4cHshwedo8rhhy/GJCS8W1A2j+SRbuHwGj/2GmjD9YGXdgadB3Kd43WVqqW7hnmnXzx9+EfzXomg45aMR8AAAAASUVORK5CYII=",
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
    brandLogo: "data:image/webp;base64,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",
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
    brandLogo: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIADgAOAMBEQACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABgcCAwQFAf/EADEQAAIBAwEEBwcFAAAAAAAAAAECAwAEEQUSEzFBBhYhUWFxkRQVIjKBocEHIzNCUv/EABsBAQACAwEBAAAAAAAAAAAAAAAFBgIDBwEE/8QALBEAAgECBQIFAwUAAAAAAAAAAAECAxEEBRIxQRMhFBVhwdFCcYFDUZGxsv/aAAwDAQACEQMRAD8A11STpQoBQCgFAKAUAoBQEz6LdDlvbdL3VdsROMxwqcFh3k93gKmcFlqnHXV2/Yr2ZZw6c3Sobrd/BLOrWi7vd+7bfHDOz2+vGpTweHtbQiD8xxd79RkT6U9Dks7d73StsxIMyQMclR3g/g1F4zLVCOulxwTmXZy6klSr7vZ/JDKhiwigFAdGnwrcahawP8kkyI3kSBWyjFSqRi+WjViJunRnNbpP+i7FAVQqgAAYAHKrkc6PH1+5itbzSZriZYYluW2ndtlR+2/E18uImoTg27K/sz7sHTlUhVjFXdl/pGc3STQ0RtvU7VhjtVZA5P0FZSxdBLvJHkcuxcn2pv8AixUlxuvaJdxnc7Z3eeOzns+1VSenU9OxeqerQte9u/3NdYGYoDKN2ikSSM4dGDKfEdorKMnFprg8lFSi4vZl1abeR39hBdxH4ZUDeXePWrhSqKpBTXJzuvSlRqSpy3R0Mqt8yg+YrY1c1ptbHDqxs7XT7i5uoInjiQsQyA58PrWms4QpuUl2Rvw6q1KsYQbu2U0Tk5wBnkKqD7nQkrI+V4BQCgJR0Iup5bs6d70uLSNwWjWMKdpuY+IHHZUpltSTl0tbS429yEzilCMOv01J83vt+Gib2UV7bau0Mt3c3Vsbfa2plXAfaxjKqOVTUIzjUs22rclcqzpVKOqMVGV+L7W9WyL/AKiawHdNKgbsQh5yDz5L+fSozNcT+jH8k1kWDtfES+y937EIqELIKAUAoDOKR4ZUliYpIjBlYcQRWUZOLTW5jOEZxcZK6ZY3XO36u+2ZX27+PcZ/v34/zz+1WHzGHh+p9W1vX4Kj5NU8X0vo3v6fPBXMsrzSvLK5eR2LMx4kmq9KTk3J7luhCMIqMV2RhWJkKAUAoBQCgFAKAUB//9k=",
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
    brandLogo: "https://s3-ap-southeast-1.amazonaws.com/bsy/iportal/images/airtel-logo-white-text-vertical.jpg",
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
    brandLogo: "https://e7.pngegg.com/pngimages/946/191/png-clipart-flipkart-e-commerce-logo-bangalore-chief-executive-others-miscellaneous-blue.png",
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
