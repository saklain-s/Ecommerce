import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, Paper, MenuItem, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const { token, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [role, setRole] = useState('CUSTOMER');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/api/public/categories')
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/add-product', message: 'Please log in to add products' } });
      return;
    }
    if (isAuthenticated && token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role || 'CUSTOMER');
    } else {
      setRole('CUSTOMER');
    }
  }, [isAuthenticated, token, navigate]);

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (role !== 'SELLER') return <Typography>You do not have permission to add products.</Typography>;

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      const productData = {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        category: { categoryId }
      };
      formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
      if (image) {
        formData.append('image', image);
      }
      await axios.post('http://localhost:8080/api/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess('Product added successfully!');
      setName(''); setDescription(''); setPrice(''); setStock(''); setCategoryId(''); setImage(null);
      setTimeout(() => navigate('/products'), 1200);
    } catch {
      setError('Failed to add product');
    }
  };

  return (
    <Box mt={4} display="flex" justifyContent="center">
      <Paper sx={{ p: 4, minWidth: 320, maxWidth: 500 }}>
        <Typography variant="h5" gutterBottom>Add Product</Typography>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Price"
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
          <TextField
            label="Stock"
            type="number"
            value={stock}
            onChange={e => setStock(e.target.value)}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 0, step: 1 }}
          />
          <TextField
            label="Category"
            select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            {categories.map(cat => (
              <MenuItem key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
          {image && <Typography variant="body2" sx={{ mt: 1 }}>{image.name}</Typography>}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Add Product
          </Button>
        </form>
      </Paper>
    </Box>
  );
} 