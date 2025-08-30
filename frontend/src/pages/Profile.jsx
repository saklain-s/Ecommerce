import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Paper, TextField, Button, Alert, CircularProgress, Chip, Divider } from '@mui/material';
import { API_ENDPOINTS } from '../api/config';

export default function Profile() {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/profile', message: 'Please log in to view your profile' } });
      return;
    }
    
    setLoading(true);
    setError(null);
    
          try {
        // Decode JWT to get username and role
        const payload = JSON.parse(atob(token.split('.')[1]));
        const username = payload.sub || payload.username;
        const role = payload.role || 'CUSTOMER';
        
        console.log('JWT payload:', payload);
        console.log('Username from JWT:', username);
        console.log('Role from JWT:', role);
        
        // Try to fetch user profile from the backend using the correct endpoint
        axios.get(`${API_ENDPOINTS.USERS}/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => {
            console.log('User data from backend:', res.data);
            setUser(res.data);
            setLoading(false);
          })
          .catch((err) => {
            console.error('Profile fetch error:', err);
            console.error('Error response:', err.response);
            
            // If the user endpoint doesn't exist, create a basic user object from JWT
            if (err.response && err.response.status === 404) {
              console.log('Creating fallback user object from JWT');
              setUser({
                username: username,
                email: 'Email not available (user not found in database)',
                role: role
              });
            } else {
              setError(`Failed to load profile: ${err.response?.data || err.message}`);
            }
            setLoading(false);
          });
      } catch (err) {
        console.error('JWT decode error:', err);
        setError('Invalid authentication token');
        setLoading(false);
      }
  }, [token, isAuthenticated, navigate]);

  // Don't render profile content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.put(`${API_ENDPOINTS.USERS}/${user.username}/password`, { password }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Password updated successfully!');
      setPassword('');
    } catch {
      setError('Failed to update password');
    }
  };

  if (loading) {
    return (
      <Box mt={4} display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Box textAlign="center">
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading your profile...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4} display="flex" justifyContent="center">
        <Paper sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box mt={4} display="flex" justifyContent="center">
      <Paper sx={{ 
        p: 4, 
        width: '100%', 
        maxWidth: 500,
        mx: 2,
        boxShadow: 3,
        borderRadius: 2
      }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3, color: 'primary.main' }}>
          Your Profile
        </Typography>
        
        {/* User Information Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
            Account Information
          </Typography>
          <Box sx={{ 
            p: 3, 
            bgcolor: 'background.default', 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>Username:</Typography>
              <Typography variant="body1">{user.username}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>Email:</Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>Role:</Typography>
              <Chip 
                label={user.role} 
                color={user.role === 'SELLER' ? 'secondary' : 'primary'}
                size="small"
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Password Change Section */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
            Change Password
          </Typography>
          <form onSubmit={handlePasswordChange}>
            <TextField
              label="New Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              sx={{ mb: 2 }}
              helperText="Enter your new password"
            />
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
              sx={{ 
                mt: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2
              }}
            >
              Update Password
            </Button>
          </form>
        </Box>
      </Paper>
    </Box>
  );
} 