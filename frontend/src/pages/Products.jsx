import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Typography, CircularProgress, Box, Button, IconButton, Snackbar, Alert, Divider, Chip, Skeleton } from '@mui/material';
import ProductCard from '../components/ProductCard';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, isAuthenticated } = useAuth();
  const [role, setRole] = useState('CUSTOMER');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, productId: null });
  const navigate = useNavigate();
  const query = useQuery();

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

  useEffect(() => {
    if (isAuthenticated && token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole((payload.role || '').toUpperCase());
    } else {
      setRole('CUSTOMER');
    }
  }, [isAuthenticated, token]);

  const handleDelete = async (id) => {
    if (!token) return;
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p.productId !== id));
      setSnackbar({ open: true, message: 'Product deleted successfully!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete product', severity: 'error' });
    }
    setDeleteDialog({ open: false, productId: null });
  };

  const handleDeleteClick = (id) => {
    setDeleteDialog({ open: true, productId: id });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, productId: null });
  };

  // Filtering logic
  const search = query.get('search')?.toLowerCase() || '';
  const category = query.get('category');
  const filteredProducts = products.filter(product => {
    const matchesSearch = !search || product.name.toLowerCase().includes(search) || product.description.toLowerCase().includes(search);
    const matchesCategory = !category || (product.category && product.category.categoryName === category);
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <Box mt={2}>
      <Typography variant="h4" gutterBottom>Products</Typography>
      <Grid container spacing={3}>
        {[...Array(8)].map((_, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
            <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box mt={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>Products</Typography>
        {role === 'SELLER' && (
          <Button variant="contained" color="primary" component={Link} to="/add-product">
            Add Product
          </Button>
        )}
      </Box>
      {search && <Typography variant="subtitle1" color="text.secondary" mb={2}>Search results for: <b>{query.get('search')}</b></Typography>}
      {category && <Typography variant="subtitle1" color="text.secondary" mb={2}>Category: <b>{category}</b></Typography>}
      <Grid container spacing={3}>
        {filteredProducts.length === 0 ? (
          <Typography>No products found.</Typography>
        ) : (
          filteredProducts.map(product => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.productId}>
              <Box position="relative">
                <Link to={`/products/${product.productId}`} style={{ textDecoration: 'none' }}>
                  <ProductCard product={product} />
                </Link>
                {role === 'SELLER' && (
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDeleteClick(product.productId)}
                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper', zIndex: 2 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </Grid>
          ))
        )}
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
      {/* The Dialog component was removed from imports, so it's removed here. */}
    </Box>
  );
} 