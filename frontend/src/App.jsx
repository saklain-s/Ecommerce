import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, Badge, IconButton, Menu, MenuItem, Avatar, Grid, Card, CardActionArea, CardMedia, CardContent, Skeleton, Chip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import AddProduct from './pages/AddProduct';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import CategoryIcon from '@mui/icons-material/Category';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import BookIcon from '@mui/icons-material/Book';
import HomeIcon from '@mui/icons-material/Home';
import DevicesIcon from '@mui/icons-material/Devices';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import SpaIcon from '@mui/icons-material/Spa';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import ProductCard from './components/ProductCard';
import axios from 'axios';

const categories = [
  { name: 'Electronics', icon: <DevicesIcon /> },
  { name: 'Fashion', icon: <CheckroomIcon /> },
  { name: 'Home', icon: <HomeIcon /> },
  { name: 'Books', icon: <BookIcon /> },
  { name: 'Sports', icon: <SportsSoccerIcon /> },
  { name: 'Beauty', icon: <SpaIcon /> },
  { name: 'Toys', icon: <ChildCareIcon /> },
  { name: 'Grocery', icon: <LocalGroceryStoreIcon /> },
];

function CategoryBar() {
  const navigate = useNavigate();
  const barRef = useRef();
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    let lastScroll = window.scrollY;
    const onScroll = () => {
      const curr = window.scrollY;
      setVisible(curr < 60 || curr < lastScroll);
      lastScroll = curr;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <Box
      ref={barRef}
      sx={{
        position: 'sticky',
        top: 64,
        zIndex: 100,
        bgcolor: 'background.paper',
        boxShadow: 1,
        px: 0,
        py: 1,
        display: visible ? 'flex' : 'none',
        width: '100vw',
        left: 0,
        minHeight: 56,
        transition: 'all 0.3s',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%', justifyContent: 'center', maxWidth: 1400 }}>
        {categories.map(cat => (
          <Button
            key={cat.name}
            startIcon={cat.icon}
            onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              bgcolor: 'background.default',
              borderRadius: 3,
              px: 2,
              mx: 0.5,
              whiteSpace: 'nowrap',
              '&:hover': { bgcolor: 'primary.light', color: 'white' },
            }}
          >
            {cat.name}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios.get('http://localhost:8080/api/products')
      .then(res => { setProducts(res.data.slice(0, 8)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
  return (
    <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '60vh' }}>
      <Grid container spacing={3} sx={{ maxWidth: 1200, mt: 2 }}>
        {loading ? (
          [...Array(8)].map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Box sx={{ borderRadius: 3, boxShadow: 3 }}>
                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
              </Box>
            </Grid>
          ))
        ) : (
          products.map(product => (
            <Grid item xs={12} sm={6} md={3} key={product.productId}>
              <Box position="relative" onClick={() => navigate(`/products/${product.productId}`)} sx={{ cursor: 'pointer' }}>
                <ProductCard product={product} />
                <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
                  <Chip label={`$${product.price}`} color="primary" size="small" sx={{ fontWeight: 700 }} />
                </Box>
              </Box>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}

function Navbar() {
  const { items } = useCart();
  const { isAuthenticated, logout, token } = useAuth();
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  let username = '';
  const [search, setSearch] = useState('');
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };
  if (isAuthenticated && token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      username = payload.sub || payload.username || '';
    } catch {}
  }
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };
  return (
    <AppBar position="fixed" elevation={2} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      <Toolbar sx={{ maxWidth: 1400, mx: 'auto', width: '100%' }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
          <StorefrontIcon />
        </Avatar>
        <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 700, letterSpacing: 1 }}>
          ShopAura
        </Typography>
        <Box component="form" onSubmit={handleSearch} sx={{ flex: 1, display: 'flex', alignItems: 'center', mx: 2, maxWidth: 400 }}>
          <Box sx={{ bgcolor: 'background.default', borderRadius: 3, px: 2, py: 0.5, display: 'flex', alignItems: 'center', width: '100%' }}>
            <InputBase
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ flex: 1, color: 'text.primary', fontWeight: 500 }}
              inputProps={{ 'aria-label': 'search products' }}
            />
            <IconButton type="submit" sx={{ color: 'primary.main' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Box>
        </Box>
        <Button color="inherit" component={Link} to="/" sx={{ mx: 1, fontWeight: 600, '&:hover': { color: 'secondary.main' } }}>Home</Button>
        <Button color="inherit" component={Link} to="/products" sx={{ mx: 1, fontWeight: 600, '&:hover': { color: 'secondary.main' } }}>Products</Button>
        <IconButton color="inherit" component={Link} to="/cart" sx={{ mx: 1, '&:hover': { color: 'secondary.main' } }}>
          <Badge badgeContent={totalQty} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <Button color="inherit" component={Link} to="/orders" sx={{ mx: 1, fontWeight: 600, '&:hover': { color: 'secondary.main' } }}>Orders</Button>
        {isAuthenticated && (
          <Button color="inherit" component={Link} to="/profile" sx={{ mx: 1, fontWeight: 600, '&:hover': { color: 'secondary.main' } }}>Profile</Button>
        )}
        {isAuthenticated ? (
          <>
            <Button color="inherit" onClick={handleMenu} sx={{ mx: 1, fontWeight: 600, '&:hover': { color: 'secondary.main' } }}>{username || 'User'}</Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login" sx={{ mx: 1, fontWeight: 600, '&:hover': { color: 'secondary.main' } }}>Login</Button>
            <Button color="inherit" component={Link} to="/register" sx={{ mx: 1, fontWeight: 600, '&:hover': { color: 'secondary.main' } }}>Register</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <CategoryBar />
      <Container sx={{ mt: 4, mb: 4, minHeight: '80vh' }}>
        <Box>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-product" element={<AddProduct />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}
