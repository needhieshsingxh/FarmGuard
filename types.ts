export enum Role {
  Farmer = 'Farmer',
  Admin = 'Administrator',
  Consumer = 'Consumer',
  // FIX: Add 'Vet' to the Role enum.
  Vet = 'Veterinarian',
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
}

export interface Report {
  id: string;
  date: string;
  animalCount: number;
  feedUsage: number; // in kg
  symptoms: string;
  temperature: number; // in Celsius
  status: 'Reviewed' | 'Pending';
  submittedBy: string;
}

export interface Alert {
  id: string;
  titleKey: string;
  descriptionKey: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  date: string;
  typeKey: 'system' | 'aiCamera' | 'outbreak' | 'prediction';
}

export interface FarmStats {
    animalCount: number;
    mortalityRate: number; // percentage
    feedUsage: number; // kg per day
    biosecurityScore: number; // percentage
}

export interface BiosecurityChecklistItem {
    id: string;
    categoryKey: 'entryProtocols' | 'feedAndWater' | 'pestControl' | 'cleaning';
    taskKey: string;
}

export interface BiosecurityReport {
    id: string;
    batchId: string;
    date: string;
    complianceScore: number;
    statusKey: 'complete' | 'inProgress';
}

export interface Comment {
    id:string;
    authorId: string;
    author: string;
    avatar: string;
    content: string;
    likes: number;
    dislikes: number;
    userVote: 'like' | 'dislike' | null;
}

export interface CommunityPost {
    id: string;
    authorId: string;
    author: string;
    avatar: string;
    date: string;
    title: string;
    content: string;
    views: number;
    likes: number;
    dislikes: number;
    userVote: 'like' | 'dislike' | null;
    comments: Comment[];
}

export interface ProductVerification {
    id: string;
    farmId: string;
    productName: string;
    batchDate: string;
    status: 'safe' | 'warning' | 'danger';
}

export interface FarmCompliance {
    id: string;
    name: string;
    region: string;
    complianceScore: number;
    lastInspection: string;
}