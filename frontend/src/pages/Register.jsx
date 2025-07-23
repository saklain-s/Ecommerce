import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, TextField, Button, Alert, Paper, MenuItem } from '@mui/material';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [panNumber, setPanNumber] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post('http://localhost:8080/api/users/register', {
        username,
        email,
        password,
        role,
        panNumber: role === 'SELLER' ? panNumber : undefined
      });
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError(err.response.data || 'Username or email already exists');
      } else if (err.response && err.response.status === 400) {
        setError(err.response.data || 'PAN number is required for sellers');
      } else {
        setError('Registration failed');
      }
    }
  };

  const handlePanChange = (e) => {
    // Only allow uppercase letters and numbers
    setPanNumber(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''));
  };

  return (
    <Box mt={4} display="flex" justifyContent="center">
      <Paper sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" gutterBottom>Register</Typography>
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
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
          <TextField
            label="Role"
            select
            value={role}
            onChange={e => setRole(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="CUSTOMER">Customer</MenuItem>
            <MenuItem value="SELLER">Seller</MenuItem>
          </TextField>
          {role === 'SELLER' && (
            <TextField
              label="PAN Number"
              value={panNumber}
              onChange={handlePanChange}
              fullWidth
              margin="normal"
              required
              inputProps={{ maxLength: 10 }}
              helperText="Enter your PAN (uppercase letters and numbers only)"
            />
          )}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
} 