import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { db } from '../config/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { Habit, HabitLog } from '../types/habit';
import { useAuth } from '../contexts/AuthContext';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

const Reports: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<string>('');
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchHabits();
    fetchHabitLogs();
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
    if (userHabits.length > 0 && !selectedHabit) {
      setSelectedHabit(userHabits[0].id);
    }
  };

  const fetchHabitLogs = async () => {
    if (!currentUser) return;

    const startDate = timeRange === 'week' ? startOfWeek(new Date()) : subDays(new Date(), 30);
    const endDate = timeRange === 'week' ? endOfWeek(new Date()) : new Date();

    const logsRef = collection(db, 'habitLogs');
    const q = query(
      logsRef,
      where('userId', '==', currentUser.uid),
      where('completedAt', '>=', Timestamp.fromDate(startDate)),
      where('completedAt', '<=', Timestamp.fromDate(endDate))
    );
    const querySnapshot = await getDocs(q);
    const logs = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as HabitLog)
    );
    setHabitLogs(logs);
  };

  const getChartData = () => {
    const days = timeRange === 'week' ? 7 : 30;
    const data = [];

    for (let i = 0; i < days; i++) {
      const date = subDays(new Date(), i);
      const formattedDate = format(date, 'MMM d');
      const logsForDay = habitLogs.filter(
        (log) => format(log.completedAt.toDate(), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );

      data.unshift({
        date: formattedDate,
        completions: logsForDay.length,
      });
    }

    return data;
  };

  const getHabitStats = () => {
    if (!selectedHabit) return null;

    const habit = habits.find((h) => h.id === selectedHabit);
    if (!habit) return null;

    const habitLogs = habitLogs.filter((log) => log.habitId === selectedHabit);
    const completionRate = (habitLogs.length / (timeRange === 'week' ? 7 : 30)) * 100;

    return {
      name: habit.name,
      currentStreak: habit.currentStreak,
      longestStreak: habit.longestStreak,
      completionRate: Math.round(completionRate),
    };
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Habit Reports
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Select Habit</InputLabel>
            <Select
              value={selectedHabit}
              onChange={(e) => setSelectedHabit(e.target.value)}
              label="Select Habit"
            >
              {habits.map((habit) => (
                <MenuItem key={habit.id} value={habit.id}>
                  {habit.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'week' | 'month')}
              label="Time Range"
            >
              <MenuItem value="week">Last 7 Days</MenuItem>
              <MenuItem value="month">Last 30 Days</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {selectedHabit && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Completion History
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completions" fill="#2196f3" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Statistics
                </Typography>
                {getHabitStats() && (
                  <Box>
                    <Typography variant="body1" gutterBottom>
                      Current Streak: {getHabitStats()?.currentStreak} days
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Longest Streak: {getHabitStats()?.longestStreak} days
                    </Typography>
                    <Typography variant="body1">
                      Completion Rate: {getHabitStats()?.completionRate}%
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Reports; 