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
      <Paper sx={{ 
        p: 4, 
        width: '100%', 
        maxWidth: 400,
        mx: 2,
        boxShadow: 3,
        borderRadius: 2
      }}>
        <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
          Create Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Account Type"
            select
            value={role}
            onChange={e => setRole(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ mb: 2 }}
            helperText={role === 'SELLER' ? 'Sellers can add and manage products' : 'Customers can browse and purchase products'}
          >
            <MenuItem value="CUSTOMER">Customer</MenuItem>
            <MenuItem value="SELLER">Seller</MenuItem>
          </TextField>
          {role === 'SELLER' && (
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: 'primary.50', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'primary.200',
              transition: 'all 0.3s ease-in-out',
              transform: 'scale(1)',
              opacity: 1
            }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main', fontWeight: 600 }}>
                Seller Information
              </Typography>
              <TextField
                label="PAN Number"
                value={panNumber}
                onChange={handlePanChange}
                fullWidth
                margin="normal"
                required
                inputProps={{ maxLength: 10 }}
                helperText="Enter your PAN (uppercase letters and numbers only)"
                sx={{ mb: 1 }}
              />
            </Box>
          )}
          {error && <Alert severity="error" sx={{ mt: 3, mb: 2 }}>{error}</Alert>}
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ 
              mt: 3, 
              mb: 1,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2
            }}
          >
            Create Account
          </Button>
        </form>
      </Paper>
    </Box>
  );
} 