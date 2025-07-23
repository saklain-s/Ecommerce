import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, Badge, IconButton, Menu, MenuItem } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';

function Home() {
  return <Typography variant="h4">Welcome to MyCoolLeap E-Commerce</Typography>;
}

function Navbar() {
  const { items } = useCart();
  const { isAuthenticated, logout, token } = useAuth();
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  let username = '';
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
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MyCoolLeap
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/products">Products</Button>
        <IconButton color="inherit" component={Link} to="/cart">
          <Badge badgeContent={totalQty} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <Button color="inherit" component={Link} to="/orders">Orders</Button>
        {isAuthenticated ? (
          <>
            <Button color="inherit" onClick={handleMenu}>{username || 'User'}</Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
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
      <Container sx={{ mt: 4 }}>
        <Box>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}
