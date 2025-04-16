import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Habit } from '../types/habit';
import { useAuth } from '../contexts/AuthContext';

const Habits: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [open, setOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    targetDays: [0, 1, 2, 3, 4, 5, 6], // Default to all days
  });
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    if (!currentUser) return;

    const habitsRef = collection(db, 'habits');
    const querySnapshot = await getDocs(habitsRef);
    const userHabits = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Habit))
      .filter(habit => habit.userId === currentUser.uid);
    setHabits(userHabits);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateHabit = async () => {
    if (!currentUser) return;

    const habitData = {
      ...newHabit,
      userId: currentUser.uid,
      createdAt: new Date(),
      currentStreak: 0,
      longestStreak: 0,
    };

    await addDoc(collection(db, 'habits'), habitData);
    setNewHabit({ name: '', description: '', targetDays: [0, 1, 2, 3, 4, 5, 6] });
    handleClose();
    fetchHabits();
  };

  const handleDeleteHabit = async (habitId: string) => {
    await deleteDoc(doc(db, 'habits', habitId));
    fetchHabits();
  };

  const handleToggleDay = (day: number) => {
    setNewHabit(prev => ({
      ...prev,
      targetDays: prev.targetDays.includes(day)
        ? prev.targetDays.filter(d => d !== day)
        : [...prev.targetDays, day],
    }));
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Habits</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Habit
        </Button>
      </Box>

      <Grid container spacing={3}>
        {habits.map((habit) => (
          <Grid item xs={12} sm={6} md={4} key={habit.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">{habit.name}</Typography>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteHabit(habit.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {habit.description}
                </Typography>
                <Typography variant="body2">
                  Current Streak: {habit.currentStreak} days
                </Typography>
                <Typography variant="body2">
                  Longest Streak: {habit.longestStreak} days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Habit</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Habit Name"
            fullWidth
            value={newHabit.name}
            onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={newHabit.description}
            onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Target Days
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {days.map((day, index) => (
              <FormControlLabel
                key={day}
                control={
                  <Checkbox
                    checked={newHabit.targetDays.includes(index)}
                    onChange={() => handleToggleDay(index)}
                  />
                }
                label={day}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateHabit} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Habits; 