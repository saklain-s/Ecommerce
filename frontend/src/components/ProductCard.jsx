import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

export default function ProductCard({ product }) {
  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image="https://source.unsplash.com/featured/?product"
        alt={product.name}
      />
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="body2" color="text.secondary">{product.description}</Typography>
        <Typography variant="subtitle1" color="primary">${product.price}</Typography>
      </CardContent>
    </Card>
  );
} 