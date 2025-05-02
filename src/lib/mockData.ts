import { User, Business, Reviewer, Admin, Campaign, Review, Transaction } from './types';
import { generateId } from './utils';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@reviewplatform.com',
    role: 'admin',
    isVerified: true,
    createdAt: new Date(2024, 0, 1).toISOString(),
  },
  {
    id: 'business1',
    name: 'John Business',
    email: 'john@techcompany.com',
    role: 'business',
    isVerified: true,
    createdAt: new Date(2024, 1, 15).toISOString(),
  },
  {
    id: 'business2',
    name: 'Sarah Manager',
    email: 'sarah@foodservice.com',
    role: 'business',
    isVerified: false,
    createdAt: new Date(2024, 2, 5).toISOString(),
  },
  {
    id: 'reviewer1',
    name: 'Mike Reviewer',
    email: 'mike@gmail.com',
    role: 'reviewer',
    isVerified: true,
    createdAt: new Date(2024, 1, 20).toISOString(),
  },
  {
    id: 'reviewer2',
    name: 'Lisa Writer',
    email: 'lisa@outlook.com',
    role: 'reviewer',
    isVerified: true,
    createdAt: new Date(2024, 2, 10).toISOString(),
  },
];

// Mock Businesses
export const mockBusinesses: Business[] = [
  {
    id: 'business1',
    name: 'John Business',
    email: 'john@techcompany.com',
    role: 'business',
    companyName: 'Tech Solutions Inc.',
    description: 'Providing innovative tech solutions since 2015',
    website: 'https://techsolutions.example.com',
    isVerified: true,
    walletBalance: 5000,
    createdAt: new Date(2024, 1, 15).toISOString(),
  },
  {
    id: 'business2',
    name: 'Sarah Manager',
    email: 'sarah@foodservice.com',
    role: 'business',
    companyName: 'Tasty Delights',
    description: 'Premium food delivery service',
    website: 'https://tastydelights.example.com',
    isVerified: false,
    walletBalance: 1200,
    createdAt: new Date(2024, 2, 5).toISOString(),
  },
];

// Mock Reviewers
export const mockReviewers: Reviewer[] = [
  {
    id: 'reviewer1',
    name: 'Mike Reviewer',
    email: 'mike@gmail.com',
    role: 'reviewer',
    bio: 'Tech enthusiast and honest reviewer',
    reviewCount: 12,
    isVerified: true,
    walletBalance: 125.5,
    earnings: 350.75,
    createdAt: new Date(2024, 1, 20).toISOString(),
  },
  {
    id: 'reviewer2',
    name: 'Lisa Writer',
    email: 'lisa@outlook.com',
    role: 'reviewer',
    bio: 'Professional writer with attention to detail',
    reviewCount: 28,
    isVerified: true,
    walletBalance: 210.25,
    earnings: 520.5,
    createdAt: new Date(2024, 2, 10).toISOString(),
  },
];

// Mock Admins
export const mockAdmins: Admin[] = [
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@reviewplatform.com',
    role: 'admin',
    isVerified: true,
    createdAt: new Date(2024, 0, 1).toISOString(),
  },
];

// Mock Campaigns
export const mockCampaigns: Campaign[] = [
  {
    id: generateId('camp-'),
    businessId: 'business1',
    title: 'Review our new AI productivity app',
    description: 'We need honest feedback on our new AI-powered productivity tool',
    product: 'TaskMaster AI',
    pricePerReview: 1.00,
    status: 'active',
    targetReviews: 50,
    completedReviews: 12,
    createdAt: new Date(2024, 3, 1).toISOString(),
    updatedAt: new Date(2024, 3, 1).toISOString(),
  },
  {
    id: generateId('camp-'),
    businessId: 'business1',
    title: 'User experience feedback for cloud storage',
    description: 'Looking for detailed reviews about the UX of our cloud storage solution',
    product: 'CloudVault Pro',
    pricePerReview: 0.75,
    status: 'active',
    targetReviews: 30,
    completedReviews: 5,
    createdAt: new Date(2024, 2, 15).toISOString(),
    updatedAt: new Date(2024, 2, 15).toISOString(),
  },
  {
    id: generateId('camp-'),
    businessId: 'business2',
    title: 'Food delivery service review',
    description: 'We want feedback on our food delivery experience and app usability',
    product: 'Tasty Delights Delivery',
    pricePerReview: 0.50,
    status: 'pending',
    targetReviews: 100,
    completedReviews: 0,
    createdAt: new Date(2024, 3, 10).toISOString(),
    updatedAt: new Date(2024, 3, 10).toISOString(),
  },
];

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: generateId('rev-'),
    campaignId: mockCampaigns[0].id,
    reviewerId: 'reviewer1',
    rating: 4,
    content: 'TaskMaster AI is mostly intuitive and helps me stay organized. The interface is clean and the AI suggestions are helpful. Could use improvements in the calendar integration.',
    status: 'approved',
    earnings: 1.00,
    createdAt: new Date(2024, 3, 5).toISOString(),
    updatedAt: new Date(2024, 3, 6).toISOString(),
  },
  {
    id: generateId('rev-'),
    campaignId: mockCampaigns[0].id,
    reviewerId: 'reviewer2',
    rating: 5,
    content: 'Absolutely love TaskMaster AI! It has transformed how I manage my daily tasks. The AI learns my patterns and makes spot-on suggestions. Highly recommend it to anyone looking to boost productivity.',
    status: 'approved',
    earnings: 1.00,
    createdAt: new Date(2024, 3, 7).toISOString(),
    updatedAt: new Date(2024, 3, 8).toISOString(),
  },
  {
    id: generateId('rev-'),
    campaignId: mockCampaigns[1].id,
    reviewerId: 'reviewer1',
    rating: 3,
    content: 'CloudVault Pro has decent features but the interface feels outdated. Storage speed is good, but sharing files could be more intuitive. Would like to see better mobile integration.',
    status: 'pending',
    earnings: 0.75,
    createdAt: new Date(2024, 3, 12).toISOString(),
    updatedAt: new Date(2024, 3, 12).toISOString(),
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: generateId('txn-'),
    userId: 'business1',
    amount: 1000,
    type: 'deposit',
    status: 'completed',
    description: 'Account funding via Flutterwave',
    createdAt: new Date(2024, 2, 20).toISOString(),
  },
  {
    id: generateId('txn-'),
    userId: 'business1',
    amount: 500,
    type: 'deposit',
    status: 'completed',
    description: 'Additional account funding',
    createdAt: new Date(2024, 3, 5).toISOString(),
  },
  {
    id: generateId('txn-'),
    userId: 'reviewer1',
    amount: 1.00,
    type: 'earning',
    status: 'completed',
    description: 'Review payment for TaskMaster AI',
    createdAt: new Date(2024, 3, 6).toISOString(),
  },
  {
    id: generateId('txn-'),
    userId: 'reviewer2',
    amount: 1.00,
    type: 'earning',
    status: 'completed',
    description: 'Review payment for TaskMaster AI',
    createdAt: new Date(2024, 3, 8).toISOString(),
  },
  {
    id: generateId('txn-'),
    userId: 'reviewer1',
    amount: 50.00,
    type: 'withdrawal',
    status: 'pending',
    description: 'Withdrawal request',
    createdAt: new Date(2024, 3, 15).toISOString(),
  },
];