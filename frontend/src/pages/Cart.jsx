import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Button, TextField, Grid, Card, CardContent, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleQtyChange = (productId, value) => {
    const qty = parseInt(value, 10);
    if (!isNaN(qty) && qty > 0) {
      updateQuantity(productId, qty);
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
      // Assume userId is in JWT (for demo, ask user for ID or decode JWT in real app)
      const userId = JSON.parse(atob(token.split('.')[1])).sub || 1;
      await axios.post(`http://localhost:8080/api/orders/place/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      clearCart();
    } catch (err) {
      setError('Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={2}>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      {items.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {items.map(({ product, quantity }) => (
              <Grid item xs={12} md={6} key={product.productId}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{product.description}</Typography>
                    <Typography variant="subtitle1" color="primary">${product.price}</Typography>
                    <Box display="flex" alignItems="center" mt={2}>
                      <TextField
                        label="Qty"
                        type="number"
                        size="small"
                        value={quantity}
                        onChange={e => handleQtyChange(product.productId, e.target.value)}
                        inputProps={{ min: 1, style: { width: 60 } }}
                        sx={{ mr: 2 }}
                      />
                      <IconButton color="error" onClick={() => removeFromCart(product.productId)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
            <Button variant="outlined" color="error" onClick={clearCart}>Clear Cart</Button>
            <Button variant="contained" color="primary" onClick={handleCheckout} disabled={loading}>
              {loading ? 'Processing...' : 'Checkout'}
            </Button>
          </Box>
        </>
      )}
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Order placed successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError(null)}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
} 