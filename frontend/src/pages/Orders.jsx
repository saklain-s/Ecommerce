import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CircularProgress, Grid, Alert } from '@mui/material';

export default function Orders() {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const userId = JSON.parse(atob(token.split('.')[1])).sub || 1;
    axios.get(`http://localhost:8080/api/orders/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch orders');
        setLoading(false);
      });
  }, [isAuthenticated, token, navigate]);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box mt={2}>
      <Typography variant="h4" gutterBottom>Order History</Typography>
      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {orders.map(order => (
            <Grid item xs={12} md={6} key={order.orderId}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Order #{order.orderId}</Typography>
                  <Typography variant="body2">Date: {order.orderDate}</Typography>
                  <Typography variant="body2">Status: {order.status}</Typography>
                  <Typography variant="body2">Total: ₹{order.total}</Typography>
                  <Typography variant="subtitle2" mt={2}>Items:</Typography>
                  {order.items && order.items.map(item => (
                    <Typography key={item.orderItemId} variant="body2">
                      {item.product.name} x {item.quantity} (₹{item.price} each)
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
} 