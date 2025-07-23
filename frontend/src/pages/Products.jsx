import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Typography, CircularProgress, Box } from '@mui/material';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch products');
        setLoading(false);
      });
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box mt={2}>
      <Typography variant="h4" gutterBottom>Products</Typography>
      <Grid container spacing={3}>
        {products.length === 0 ? (
          <Typography>No products found.</Typography>
        ) : (
          products.map(product => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.productId}>
              <Link to={`/products/${product.productId}`} style={{ textDecoration: 'none' }}>
                <ProductCard product={product} />
              </Link>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
} 