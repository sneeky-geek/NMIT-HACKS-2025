
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
