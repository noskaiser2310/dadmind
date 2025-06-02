export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string; 
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'expert';
  timestamp: number;
  avatar?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface TestQuestion {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId?: string; 
  points?: number; 
}

export interface TestResult {
  score: number;
  maxScore: number;
  percentage: number;
  feedback: string;
  advice?: string; 
}

export interface Expert {
  id: string;
  name: string;
  specialty: string;
  phone?: string; // Made optional as direct chat is primary
  email?: string; // Made optional
  avatarUrl: string;
  online: boolean;
  bio?: string; // Short introduction for the expert list
}

export interface StoryComment {
  id: string;
  authorName: string;
  avatarUrl?: string;
  content: string;
  timestamp: number;
}

export interface SharedStory {
  id: string;
  content: string;
  authorName: string; // e.g., "Một người cha", "Bố Ben"
  timestamp: number; // Unix timestamp
  avatarUrl?: string; // Optional avatar for the author
  likes: number;
  likedByAvatars?: string[]; 
  comments: StoryComment[]; // Added for comments
}

export enum Page {
  Home = '/home',
  Login = '/login',
  Register = '/register',
  AskMe = '/ask-me',
  Test = '/test',
  TestQuiz = '/test/quiz',
  TestResults = '/test/results',
  ContactExpert = '/contact-expert',
}