import React from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Box, Button, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';

const AnimatedCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.2s, box-shadow 0.2s',
  boxShadow: theme.shadows[2],
  borderRadius: 18,
  opacity: 0,
  animation: 'fadeIn 0.6s forwards',
  '@keyframes fadeIn': {
    to: { opacity: 1 }
  },
  '&:hover': {
    transform: 'scale(1.04)',
    boxShadow: theme.shadows[8],
  },
  position: 'relative',
  overflow: 'visible',
}));

export default function ProductCard({ product, onAddToCart }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <AnimatedCard
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{ minHeight: 320 }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="140"
          image={product.imageUrl || "https://source.unsplash.com/featured/?product"}
          alt={product.name}
          sx={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}
        />
        <Fade in={hovered}>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 2,
              fontWeight: 700,
              borderRadius: 3,
              boxShadow: 2,
              textTransform: 'none',
            }}
            onClick={e => {
              e.stopPropagation();
              if (onAddToCart) onAddToCart(product);
            }}
          >
            Add to Cart
          </Button>
        </Fade>
      </Box>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h6" noWrap>{product.name}</Typography>
          <Chip label={`₹${product.price}`} color="primary" size="small" sx={{ fontWeight: 700 }} />
        </Box>
        <Typography variant="body2" color="text.secondary" mb={1}>
          {product.description}
        </Typography>
        <Chip label={`Stock: ${product.stock}`} color={product.stock > 0 ? 'success' : 'error'} size="small" />
      </CardContent>
    </AnimatedCard>
  );
} 