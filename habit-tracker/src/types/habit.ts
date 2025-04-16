export interface Habit {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: Date;
  targetDays: number[];
  currentStreak: number;
  longestStreak: number;
  lastCompleted?: Date;
}

export interface HabitLog {
  id: string;
  habitId: string;
  userId: string;
  completedAt: Date;
  notes?: string;
}

export interface WeeklyReport {
  habits: {
    habitId: string;
    name: string;
    completedDays: number;
    streak: number;
  }[];
  startDate: Date;
  endDate: Date;
} 