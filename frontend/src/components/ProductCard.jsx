import React from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const AnimatedCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.2s, box-shadow 0.2s',
  boxShadow: theme.shadows[2],
  opacity: 0,
  animation: 'fadeIn 0.6s forwards',
  '@keyframes fadeIn': {
    to: { opacity: 1 }
  },
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: theme.shadows[6],
  },
}));

export default function ProductCard({ product }) {
  return (
    <AnimatedCard>
      <CardMedia
        component="img"
        height="140"
        image={product.imageUrl || "https://source.unsplash.com/featured/?product"}
        alt={product.name}
      />
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h6" noWrap>{product.name}</Typography>
          <Chip label={`$${product.price}`} color="primary" size="small" sx={{ fontWeight: 700 }} />
        </Box>
        <Typography variant="body2" color="text.secondary" mb={1}>
          {product.description}
        </Typography>
        <Chip label={`Stock: ${product.stock}`} color={product.stock > 0 ? 'success' : 'error'} size="small" />
      </CardContent>
    </AnimatedCard>
  );
} 