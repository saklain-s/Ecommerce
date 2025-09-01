import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../api/config';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Check if redirected from cart or other protected pages
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(`${API_ENDPOINTS.AUTH}/login`, { username, password });
      login(res.data.token);
      
      // Redirect to the page they were trying to access, or home
      const from = location.state?.from || '/';
      navigate(from);
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <Box mt={4} display="flex" justifyContent="center">
      <Paper sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
} 