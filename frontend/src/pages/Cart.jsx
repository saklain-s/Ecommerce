import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Button, TextField, Grid, Card, CardContent, Snackbar, Alert, Divider, Chip, Skeleton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart', message: 'Please log in to view your cart' } });
    }
  }, [isAuthenticated, navigate]);

  // Don't render cart content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleQtyChange = (productId, value) => {
    const qty = parseInt(value, 10);
    if (!isNaN(qty) && qty > 0) {
      updateQuantity(productId, qty);
      setSnackbar({ open: true, message: 'Quantity updated', severity: 'info' });
    }
  };

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const userId = JSON.parse(atob(token.split('.')[1])).sub || 1;
      await axios.post(`http://localhost:8080/api/orders/place/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      clearCart();
      setSnackbar({ open: true, message: 'Order placed successfully!', severity: 'success' });
    } catch (err) {
      setError('Checkout failed');
      setSnackbar({ open: true, message: 'Checkout failed', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Box mt={2}>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      <Grid container spacing={2}>
        {[...Array(2)].map((_, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box mt={2}>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      <Divider sx={{ mb: 2 }} />
      {items.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {items.map(({ product, quantity }) => (
              <Grid item xs={12} md={6} key={product.productId}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="h6">{product.name}</Typography>
                      <Chip label={`₹${product.price}`} color="primary" size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>{product.description}</Typography>
                    <Box display="flex" alignItems="center" mt={2}>
                      <Chip label={`Qty: ${quantity}`} color="secondary" size="small" sx={{ mr: 2 }} />
                      <TextField
                        label="Qty"
                        type="number"
                        size="small"
                        value={quantity}
                        onChange={e => handleQtyChange(product.productId, e.target.value)}
                        inputProps={{ min: 1, style: { width: 60 } }}
                        sx={{ mr: 2 }}
                      />
                      <IconButton color="error" onClick={() => { removeFromCart(product.productId); setSnackbar({ open: true, message: 'Removed from cart', severity: 'info' }); }}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Box mt={3} display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Typography variant="h6">Total: <Chip label={`₹${total.toFixed(2)}`} color="success" size="medium" /></Typography>
            <Box mt={{ xs: 2, sm: 0 }}>
              <Button variant="outlined" color="error" onClick={() => { clearCart(); setSnackbar({ open: true, message: 'Cart cleared', severity: 'info' }); }} sx={{ mr: 2 }}>Clear Cart</Button>
              <Button variant="contained" color="primary" onClick={handleCheckout} disabled={loading}>
                {loading ? 'Processing...' : 'Checkout'}
              </Button>
            </Box>
          </Box>
        </>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
} 