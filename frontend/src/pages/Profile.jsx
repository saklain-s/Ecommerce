import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Box, Typography, Paper, TextField, Button, Alert } from '@mui/material';

export default function Profile() {
  const { token, isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    // Decode JWT to get username
    const payload = JSON.parse(atob(token.split('.')[1]));
    const username = payload.sub || payload.username;
    axios.get(`http://localhost:8080/api/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data))
      .catch(() => setError('Failed to load profile'));
  }, [token, isAuthenticated]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.put(`http://localhost:8080/api/users/${user.username}/password`, { password }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Password updated successfully!');
      setPassword('');
    } catch {
      setError('Failed to update password');
    }
  };

  if (!isAuthenticated) return <Typography>Please log in to view your profile.</Typography>;
  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Box mt={4} display="flex" justifyContent="center">
      <Paper sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" gutterBottom>Profile</Typography>
        <Typography variant="body1">Username: {user.username}</Typography>
        <Typography variant="body1">Email: {user.email}</Typography>
        <Box mt={3}>
          <Typography variant="h6">Change Password</Typography>
          <form onSubmit={handlePasswordChange}>
            <TextField
              label="New Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            {success && <Alert severity="success">{success}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Update Password
            </Button>
          </form>
        </Box>
      </Paper>
    </Box>
  );
} 