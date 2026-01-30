
import { BeltRank, Achievement, ClassSession, Announcement, User, UserRole, CurriculumItem } from './types';

export const BELT_COLORS: Record<BeltRank, { main: string; border: string; text: string; gradient: string }> = {
  [BeltRank.WHITE]: { main: 'bg-white', border: 'border-slate-300', text: 'text-slate-900', gradient: 'from-slate-100 to-white' },
  [BeltRank.BLUE]: { main: 'bg-blue-600', border: 'border-blue-800', text: 'text-white', gradient: 'from-blue-500 to-blue-700' },
  [BeltRank.PURPLE]: { main: 'bg-purple-700', border: 'border-purple-900', text: 'text-white', gradient: 'from-purple-600 to-purple-800' },
  [BeltRank.BROWN]: { main: 'bg-yellow-900', border: 'border-yellow-950', text: 'text-white', gradient: 'from-amber-800 to-amber-950' },
  [BeltRank.BLACK]: { main: 'bg-neutral-950', border: 'border-red-600', text: 'text-white', gradient: 'from-neutral-900 to-black' },
};

export const XP_PER_CLASS = 100;
export const STREAK_BONUS_MULTIPLIER = 1.1;

export const CLASSES_PER_STRIPE: Record<BeltRank, number> = {
  [BeltRank.WHITE]: 50,
  [BeltRank.BLUE]: 60,
  [BeltRank.PURPLE]: 70,
  [BeltRank.BROWN]: 80,
  [BeltRank.BLACK]: 1000,
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'White Belt Warrior', description: 'Complete your first 10 classes', icon: 'Sword', unlocked: false },
  { id: '2', title: 'Consistency King', description: 'Attend 3 classes in one week', icon: 'CalendarCheck', unlocked: false },
  { id: '3', title: 'Technique Master', description: 'Log 5 journal entries', icon: 'Book', unlocked: false },
  { id: '4', title: 'Iron Will', description: 'Maintain a 4-week streak', icon: 'Flame', unlocked: false },
];

export const MOCK_USERS: User[] = [
  {
    id: 'student-1',
    name: 'Alex Silva',
    role: UserRole.STUDENT,
    belt: BeltRank.WHITE,
    stripes: 2,
    classesAttended: 112,
    streak: 4,
    xp: 12500,
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4',
    joinDate: '2023-01-15',
    injuryStatus: 'Right Knee - Sprained',
    membershipStatus: 'ACTIVE',
    plan: 'UNLIMITED',
    nextBillingDate: '2023-11-15',
    achievements: [
      { ...INITIAL_ACHIEVEMENTS[0], unlocked: true, dateEarned: '2023-02-01' },
      { ...INITIAL_ACHIEVEMENTS[1], unlocked: true, dateEarned: '2023-03-10' },
      { ...INITIAL_ACHIEVEMENTS[2], unlocked: false },
      { ...INITIAL_ACHIEVEMENTS[3], unlocked: false },
    ],
  },
  {
    id: 'student-2',
    name: 'Sarah Connor',
    role: UserRole.STUDENT,
    belt: BeltRank.PURPLE,
    stripes: 1,
    classesAttended: 450,
    streak: 12,
    xp: 85000,
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=c0aede',
    joinDate: '2019-06-01',
    membershipStatus: 'ACTIVE',
    plan: 'UNLIMITED',
    nextBillingDate: '2023-11-01',
    achievements: INITIAL_ACHIEVEMENTS.map(a => ({...a, unlocked: true})),
  },
  {
    id: 'student-3',
    name: 'Mike Tyson',
    role: UserRole.STUDENT,
    belt: BeltRank.BLUE,
    stripes: 4,
    classesAttended: 310,
    streak: 2,
    xp: 42000,
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike&backgroundColor=ffdfbf',
    joinDate: '2021-11-12',
    membershipStatus: 'OVERDUE',
    plan: '2X_WEEK',
    nextBillingDate: '2023-10-12', // Past date
    achievements: [
       { ...INITIAL_ACHIEVEMENTS[0], unlocked: true },
       { ...INITIAL_ACHIEVEMENTS[1], unlocked: false },
       { ...INITIAL_ACHIEVEMENTS[2], unlocked: true },
       { ...INITIAL_ACHIEVEMENTS[3], unlocked: false },
    ],
  },
  {
    id: 'student-4',
    name: 'John Doe',
    role: UserRole.STUDENT,
    belt: BeltRank.WHITE,
    stripes: 0,
    classesAttended: 5,
    streak: 0,
    xp: 500,
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=eeeeee',
    joinDate: '2023-10-01',
    membershipStatus: 'FROZEN',
    plan: 'UNLIMITED',
    nextBillingDate: '2023-12-01',
    achievements: INITIAL_ACHIEVEMENTS,
  },
  {
    id: 'instructor-1',
    name: 'Prof. Marcus',
    role: UserRole.INSTRUCTOR,
    belt: BeltRank.BLACK,
    stripes: 2,
    classesAttended: 5000,
    streak: 999,
    xp: 999999,
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=e5e7eb',
    joinDate: '2010-06-01',
    membershipStatus: 'ACTIVE',
    plan: 'UNLIMITED',
    nextBillingDate: '2030-01-01',
    achievements: [],
  },
];

export const MOCK_SCHEDULE: ClassSession[] = [
  { id: 'c1', title: 'Morning Fundamentals', instructor: 'Prof. Marcus', day: 'Mon', time: '07:00 AM', duration: '60m', type: 'Fundamentals', capacity: 20, bookedCount: 12 },
  { id: 'c2', title: 'Advanced Gi', instructor: 'Prof. Marcus', day: 'Mon', time: '06:00 PM', duration: '90m', type: 'Gi', capacity: 30, bookedCount: 25 },
  { id: 'c3', title: 'No-Gi Submission', instructor: 'Coach Sarah', day: 'Tue', time: '06:00 PM', duration: '90m', type: 'No-Gi', capacity: 30, bookedCount: 18 },
  { id: 'c4', title: 'Open Mat', instructor: 'All Instructors', day: 'Sat', time: '10:00 AM', duration: '120m', type: 'Open Mat', capacity: 50, bookedCount: 40 },
  { id: 'c5', title: 'Competition Training', instructor: 'Prof. Marcus', day: 'Wed', time: '07:00 PM', duration: '90m', type: 'Gi', capacity: 25, bookedCount: 22 },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  { id: 'a1', title: 'Seminar with Coral Belt', content: 'Master Sylvio is visiting next Saturday! Registration is open.', date: '2023-10-25', author: 'Prof. Marcus', type: 'ALERT' },
  { id: 'a2', title: 'New Rashguards Stocked', content: 'The new MatShark 2024 team gear has arrived at the front desk.', date: '2023-10-22', author: 'Admin', type: 'NEWS' },
];

export const CURRENT_CURRICULUM: CurriculumItem = {
  id: 'week-42',
  week: 42,
  topic: 'Closed Guard Attacks',
  techniques: ['Cross Collar Choke', 'Hip Bump Sweep', 'Triangle from Guard'],
};
