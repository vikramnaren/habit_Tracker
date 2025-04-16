import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { db } from '../config/firebase';
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { Habit, HabitLog } from '../types/habit';
import { useAuth } from '../contexts/AuthContext';
import { format, isToday } from 'date-fns';

const Dashboard: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchHabits();
    fetchToday'sCompletions();
  }, []);

  const fetchHabits = async () => {
    if (!currentUser) return;

    const habitsRef = collection(db, 'habits');
    const q = query(habitsRef, where('userId', '==', currentUser.uid));
    const querySnapshot = await getDocs(q);
    const userHabits = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Habit)
    );
    setHabits(userHabits);
  };

  const fetchToday'sCompletions = async () => {
    if (!currentUser) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const logsRef = collection(db, 'habitLogs');
    const q = query(
      logsRef,
      where('userId', '==', currentUser.uid),
      where('completedAt', '>=', Timestamp.fromDate(today))
    );
    const querySnapshot = await getDocs(q);
    const completedIds = querySnapshot.docs.map(
      (doc) => (doc.data() as HabitLog).habitId
    );
    setCompletedHabits(completedIds);
  };

  const handleToggleHabit = async (habitId: string) => {
    if (!currentUser) return;

    const isCompleted = completedHabits.includes(habitId);
    const today = new Date();

    if (isCompleted) {
      // Remove completion
      setCompletedHabits(completedHabits.filter((id) => id !== habitId));
    } else {
      // Add completion
      setCompletedHabits([...completedHabits, habitId]);
      await addDoc(collection(db, 'habitLogs'), {
        habitId,
        userId: currentUser.uid,
        completedAt: Timestamp.fromDate(today),
      });
    }
  };

  const getHabitsForToday = () => {
    const today = new Date().getDay();
    return habits.filter((habit) => habit.targetDays.includes(today));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Today's Habits
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        {format(new Date(), 'EEEE, MMMM d, yyyy')}
      </Typography>

      <Grid container spacing={3}>
        {getHabitsForToday().map((habit) => (
          <Grid item xs={12} sm={6} md={4} key={habit.id}>
            <Card>
              <CardContent>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={completedHabits.includes(habit.id)}
                      onChange={() => handleToggleHabit(habit.id)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="h6">{habit.name}</Typography>
                      <Typography color="textSecondary" variant="body2">
                        {habit.description}
                      </Typography>
                      <Typography variant="body2">
                        Current Streak: {habit.currentStreak} days
                      </Typography>
                    </Box>
                  }
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {getHabitsForToday().length === 0 && (
        <Typography variant="body1" color="textSecondary" sx={{ mt: 3 }}>
          No habits scheduled for today. Add some habits in the Habits section!
        </Typography>
      )}
    </Box>
  );
};

export default Dashboard; 