import { db } from '../config/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { Habit, HabitLog } from '../types/habit';
import { format, isSameDay, subDays } from 'date-fns';

export const calculateStreak = async (habitId: string, userId: string): Promise<{ currentStreak: number; longestStreak: number }> => {
  const logsRef = collection(db, 'habitLogs');
  const q = query(
    logsRef,
    where('habitId', '==', habitId),
    where('userId', '==', userId)
  );
  const querySnapshot = await getDocs(q);
  const logs = querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as HabitLog)
  );

  // Sort logs by date in descending order
  logs.sort((a, b) => b.completedAt.toDate().getTime() - a.completedAt.toDate().getTime());

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  for (const log of logs) {
    const logDate = log.completedAt.toDate();
    
    if (!lastDate) {
      lastDate = logDate;
      tempStreak = 1;
      currentStreak = 1;
      continue;
    }

    const daysDiff = Math.floor(
      (lastDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 1) {
      tempStreak++;
      if (tempStreak > currentStreak) {
        currentStreak = tempStreak;
      }
    } else if (daysDiff > 1) {
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      tempStreak = 1;
    }

    lastDate = logDate;
  }

  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
  }

  return { currentStreak, longestStreak };
};

export const updateHabitStreaks = async (habitId: string, userId: string) => {
  const { currentStreak, longestStreak } = await calculateStreak(habitId, userId);
  
  const habitRef = doc(db, 'habits', habitId);
  await updateDoc(habitRef, {
    currentStreak,
    longestStreak,
  });
};

export const checkHabitCompletion = async (habitId: string, userId: string, date: Date): Promise<boolean> => {
  const logsRef = collection(db, 'habitLogs');
  const q = query(
    logsRef,
    where('habitId', '==', habitId),
    where('userId', '==', userId),
    where('completedAt', '>=', Timestamp.fromDate(new Date(date.setHours(0, 0, 0, 0)))),
    where('completedAt', '<=', Timestamp.fromDate(new Date(date.setHours(23, 59, 59, 999))))
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const getHabitCompletionRate = async (habitId: string, userId: string, days: number): Promise<number> => {
  const startDate = subDays(new Date(), days - 1);
  const logsRef = collection(db, 'habitLogs');
  const q = query(
    logsRef,
    where('habitId', '==', habitId),
    where('userId', '==', userId),
    where('completedAt', '>=', Timestamp.fromDate(startDate))
  );
  const querySnapshot = await getDocs(q);
  const completionCount = querySnapshot.size;
  return (completionCount / days) * 100;
}; 