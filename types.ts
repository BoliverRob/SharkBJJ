
export enum UserRole {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
}

export enum BeltRank {
  WHITE = 'White',
  BLUE = 'Blue',
  PURPLE = 'Purple',
  BROWN = 'Brown',
  BLACK = 'Black',
}

export type ActivityType = 'ATTENDANCE' | 'PROMOTION' | 'STRIPE' | 'ACHIEVEMENT' | 'NOTE' | 'BOOKING' | 'JOURNAL' | 'PAYMENT';

export type MembershipStatus = 'ACTIVE' | 'OVERDUE' | 'FROZEN' | 'CANCELLED';
export type PaymentPlan = 'UNLIMITED' | '2X_WEEK' | 'DROP_IN' | 'FAMILY';

export interface ActivityLog {
  id: string;
  userId: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string; // ISO date
  instructorId?: string;
  tags?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  dateEarned?: string;
  unlocked: boolean;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  belt: BeltRank;
  stripes: number;
  classesAttended: number;
  streak: number;
  xp: number;
  profileImage: string;
  joinDate: string;
  lastAttended?: string;
  achievements: Achievement[];
  notes?: string;
  injuryStatus?: string; // e.g., "Left Shoulder - Tweaked"
  
  // Financials
  membershipStatus: MembershipStatus;
  plan: PaymentPlan;
  nextBillingDate: string; // ISO Date
}

export interface ClassSession {
  id: string;
  title: string;
  instructor: string;
  day: string; // Mon, Tue, etc
  time: string;
  duration: string;
  type: 'Gi' | 'No-Gi' | 'Open Mat' | 'Fundamentals';
  capacity: number;
  bookedCount: number;
}

export interface Booking {
  id: string;
  userId: string;
  classId: string;
  timestamp: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  type: 'ALERT' | 'NEWS' | 'TIP';
}

export interface CurriculumItem {
  id: string;
  week: number;
  topic: string; // e.g., "Closed Guard Attacks"
  techniques: string[]; // e.g., ["Armbar", "Triangle", "Flower Sweep"]
  videoUrl?: string;
}
