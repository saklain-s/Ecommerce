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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
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
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 64,
        zIndex: 100,
        bgcolor: 'background.paper',
        boxShadow: 1,
        px: 0,
        py: 1,
        display: 'flex',
        width: '100vw',
        left: 0,
        minHeight: 56,
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
  const { addToCart } = useCart();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  useEffect(() => {
    import('./api/config.js').then(({ API_ENDPOINTS }) => {
      axios.get(API_ENDPOINTS.PRODUCTS)
        .then(res => { setProducts(res.data.slice(0, 8)); setLoading(false); })
        .catch(() => setLoading(false));
    });
  }, []);

  // Featured items for each category (using online images)
  const featuredItems = [
    {
      category: 'Electronics',
      items: [
        {
          title: 'Wireless Headphones',
          image: 'https://images.pexels.com/photos/374777/pexels-photo-374777.jpeg?auto=compress&w=400', // Headphones
          description: 'High-fidelity sound, noise cancelling.',
          price: 1799,
          stock: 12,
        },
        {
          title: 'Smartphone',
          image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&w=400',
          description: 'Latest model, stunning display.',
          price: 25000,
          stock: 8,
        },
        {
          title: 'Smartwatch',
          image: 'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&w=400',
          description: 'Track fitness and notifications.',
          price: 5500,
          stock: 15,
        },
        {
          title: 'Bluetooth Speaker',
          image: 'https://images.pexels.com/photos/33080375/pexels-photo-33080375.jpeg', // Bluetooth Speaker
          description: 'Portable, powerful sound.',
          price: 1500,
          stock: 20,
        },
      ],
    },
    {
      category: 'Fashion',
      items: [
        {
          title: 'Denim Jacket',
          image: 'https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&w=400',
          description: 'Classic style, all seasons.',
          price: 1599,
          stock: 10,
        },
        {
          title: 'Sneakers',
          image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&w=400',
          description: 'Comfortable and trendy.',
          price: 3200,
          stock: 18,
        },
        {
          title: 'Sunglasses',
          image: 'https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&w=400',
          description: 'UV protection, stylish.',
          price: 1200,
          stock: 25,
        },
        {
          title: 'Leather Handbag',
          image: 'https://images.pexels.com/photos/5706269/pexels-photo-5706269.jpeg', // Leather Handbag
          description: 'Premium quality, spacious.',
          price: 4500,
          stock: 7,
        },
      ],
    },
    {
      category: 'Home',
      items: [
        {
          title: 'Table Lamp',
          image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg', // Table Lamp
          description: 'Modern design, warm light.',
          price: 1300,
          stock: 14,
        },
        {
          title: 'Cushion Set',
          image: 'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&w=400',
          description: 'Soft and colorful.',
          price: 2000,
          stock: 30,
        },
        {
          title: 'Wall Clock',
          image: 'https://images.pexels.com/photos/191703/pexels-photo-191703.jpeg', // Wall Clock
          description: 'Silent, elegant look.',
          price: 900,
          stock: 22,
        },
        {
          title: 'Ceramic Vase',
          image: 'https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&w=400',
          description: 'Handcrafted, unique.',
          price: 1500,
          stock: 9,
        },
      ],
    },
    {
      category: 'Books',
      items: [
        {
          title: 'Mystery Novel',
          image: 'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&w=400',
          description: 'A thrilling page-turner.',
          price: 300,
          stock: 40,
        },
        {
          title: 'Cookbook',
          image: 'https://images.pexels.com/photos/8851929/pexels-photo-8851929.jpeg', // Cookbook
          description: 'Delicious recipes inside.',
          price: 400,
          stock: 16,
        },
        {
          title: 'Science Fiction',
          image: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&w=400', // Science Fiction Book
          description: 'Explore new worlds.',
          price: 250,
          stock: 12,
        },
        {
          title: 'Biography',
          image: 'https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&w=400',
          description: 'Inspiring life story.',
          price: 350,
          stock: 20,
        },
      ],
    },
    {
      category: 'Sports',
      items: [
        {
          title: 'Football',
          image: 'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&w=400',
          description: 'Official size, durable.',
          price: 1000,
          stock: 17,
        },
        {
          title: 'Yoga Mat',
          image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&w=400', // Yoga Mat
          description: 'Non-slip, eco-friendly.',
          price: 700,
          stock: 23,
        },
        {
          title: 'Tennis Racket',
          image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&w=400',
          description: 'Lightweight, strong grip.',
          price: 1700,
          stock: 6,
        },
        {
          title: 'Dumbbell Set',
          image: 'https://images.pexels.com/photos/260352/pexels-photo-260352.jpeg', // Dumbbell Set
          description: 'Adjustable weights.',
          price: 3000,
          stock: 11,
        },
      ],
    },
    {
      category: 'Beauty',
      items: [
        {
          title: 'Face Serum',
          image: 'https://images.pexels.com/photos/8140913/pexels-photo-8140913.jpeg', // Face Serum
          description: 'Glowing skin formula.',
          price: 1200,
          stock: 19,
        },
        {
          title: 'Lipstick Set',
          image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&w=400', // Lipstick Set
          description: 'Vibrant, long-lasting.',
          price: 900,
          stock: 14,
        },
        {
          title: 'Hair Dryer',
          image: 'https://images.pexels.com/photos/973406/pexels-photo-973406.jpeg', // Hair Dryer
          description: 'Quick dry, low noise.',
          price: 1800,
          stock: 8,
        },
        {
          title: 'Body Lotion',
          image: 'https://images.pexels.com/photos/27363151/pexels-photo-27363151.jpeg', // Body Lotion
          description: 'Moisturizing, non-greasy.',
          price: 600,
          stock: 21,
        },
      ],
    },
    {
      category: 'Toys',
      items: [
        {
          title: 'Building Blocks',
          image: 'https://images.pexels.com/photos/105855/pexels-photo-105855.jpeg', // Building Blocks
          description: 'Creative fun for kids.',
          price: 1100,
          stock: 30,
        },
        {
          title: 'Plush Bear',
          image: 'https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&w=400', // Plush Bear
          description: 'Soft and cuddly.',
          price: 800,
          stock: 18,
        },
        {
          title: 'Puzzle Game',
          image: 'https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&w=400',
          description: 'Challenging and fun.',
          price: 950,
          stock: 22,
        },
        {
          title: 'Remote Car',
          image: 'https://images.pexels.com/photos/14857461/pexels-photo-14857461.jpeg', // Remote Car
          description: 'Fast and rechargeable.',
          price: 1600,
          stock: 9,
        },
      ],
    },
    {
      category: 'Grocery',
      items: [
        {
          title: 'Organic Apples',
          image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&w=400',
          description: 'Fresh and juicy.',
          price: 180,
          stock: 50,
        },
        {
          title: 'Almonds',
          image: 'https://images.pexels.com/photos/57042/pexels-photo-57042.jpeg', // Almonds
          description: 'Healthy snack.',
          price: 120,
          stock: 35,
        },
        
        {
          title: 'Olive Oil',
          image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&w=400', // Olive Oil
          description: 'Extra virgin, pure.',
          price: 450,
          stock: 20,
        },
        {
          title: 'Brown Rice',
          image: 'https://images.pexels.com/photos/4110253/pexels-photo-4110253.jpeg', // Brown Rice
          description: 'Whole grain, nutritious.',
          price: 100,
          stock: 28,
        },
      ],
    },
  ];

  return (
    <>
      {/* Hero Banner */}
      <Box
        sx={{
          width: '100%',
          minHeight: 240,
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 4,
          boxShadow: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 3, md: 8 },
          py: { xs: 4, md: 6 },
          mb: 5,
          background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)',
        }}
      >
        <Box>
          <Typography variant="h3" fontWeight={800} gutterBottom sx={{ letterSpacing: 1 }}>
            Welcome to ShopAura
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Discover the best deals on electronics, fashion, books, and more!
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ fontWeight: 700, borderRadius: 3, boxShadow: 2 }}
            onClick={() => navigate('/products')}
          >
            Shop Now
          </Button>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          {/* You can replace this with a product/category image if desired */}
          <img src="/shopaurabanner.jpg" alt="ShopAura Banner" style={{ borderRadius: 16, width: 320, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }} />
        </Box>
      </Box>

      {/* Featured Categories Grid */}
      <Box sx={{ maxWidth: 1400, mx: 'auto', mb: 8 }}>
        {featuredItems.map(cat => (
          <Box key={cat.category} sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">
              {cat.category}
            </Typography>
            <Grid container spacing={3}>
              {cat.items.map((item, idx) => (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <Box sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    boxShadow: 2,
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: 6 },
                  }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} />
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom align="center">{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary" align="center" mb={1}>{item.description}</Typography>
                    <Box display="flex" gap={1} alignItems="center" justifyContent="center" mt={1}>
                      <Chip label={`₹${item.price}`} color="primary" size="small" sx={{ fontWeight: 700 }} />
                      <Chip label={`Stock: ${item.stock}`} color={item.stock > 0 ? 'success' : 'error'} size="small" />
                    </Box>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      sx={{ mt: 2, fontWeight: 700, borderRadius: 3, boxShadow: 1, textTransform: 'none' }}
                      onClick={() => {
                        addToCart(item, 1);
                        setSnackbar({ open: true, message: `${item.title} added to cart!`, severity: 'success' });
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                color="primary"
                sx={{ fontWeight: 600, borderRadius: 3, textTransform: 'none' }}
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.category)}`)}
              >
                See all in {cat.category}
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

     <Snackbar
       open={snackbar.open}
       autoHideDuration={3000}
       onClose={() => setSnackbar({ ...snackbar, open: false })}
       anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
     >
       <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
     </Snackbar>

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
                    <Chip label={`₹${product.price}`} color="primary" size="small" sx={{ fontWeight: 700 }} />
                  </Box>
                </Box>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </>
  );
}

function Navbar() {
  const { items } = useCart();
  const { isAuthenticated, logout, username, role } = useAuth();
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };
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
      <Container sx={{ marginTop: '120px', mb: 4, minHeight: '80vh' }}>
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
