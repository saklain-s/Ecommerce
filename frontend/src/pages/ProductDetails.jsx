import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Card, CardContent, CardMedia, CircularProgress, Button } from '@mui/material';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch product details');
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!product) return <Typography>No product found.</Typography>;

  return (
    <Box mt={4} display="flex" justifyContent="center">
      <Card sx={{ maxWidth: 500 }}>
        <CardMedia
          component="img"
          height="240"
          image="https://source.unsplash.com/featured/?product"
          alt={product.name}
        />
        <CardContent>
          <Typography variant="h5" gutterBottom>{product.name}</Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>{product.description}</Typography>
          <Typography variant="h6" color="primary">${product.price}</Typography>
          <Typography variant="body2" color="text.secondary">Stock: {product.stock}</Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAddToCart} disabled={added}>
            {added ? 'Added!' : 'Add to Cart'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
} 