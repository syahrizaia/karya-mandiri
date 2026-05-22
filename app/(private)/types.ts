export interface EmployerData {
  name: string;
  company: string;
  totalProjects: number;
  activeWorkers: number;
  totalInvestment: number;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  reward: number;
  deadline: string;
  status: 'available' | 'in_progress' | 'submitted' | 'completed';
}

export interface WorkerStats {
  name: string;
  totalEarnings: number;
  completedTasks: number;
  rating: number;
  level: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'worker' | 'employer';
  bannerUrl: string;
  avatarUrl: string;
  bio: string;
  location: string;
  skills: string[];
  isVerified: boolean;
  joinedDate: string;
  balance: number;
}

export interface UserSettings {
  notifications: {
    newJobs: boolean;
    projectUpdates: boolean;
    marketing: boolean;
  };
  privacy: {
    showEarnings: boolean;
    publicProfile: boolean;
  };
  language: 'id' | 'en';
  theme: 'light' | 'dark';
}

export interface GeneralStats {
  activeProjects: number;
  totalWorkers: number;
  economicImpact: number; // Dalam Rupiah
  growthRate: number; // Persentase
}

export interface TransactionHistory {
  id: string;
  taskTitle: string;
  employerName: string;
  amount: number;
  date: string;
  type: 'income' | 'withdrawal';
  status: 'success' | 'processing' | 'failed';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'job' | 'payment' | 'system' | 'announcement';
  isRead: boolean;
}