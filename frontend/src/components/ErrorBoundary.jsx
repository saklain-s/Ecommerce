import React from 'react';
import { Box, Typography, Button, Container, Alert } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
          <Box sx={{ p: 3 }}>
            <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom color="error.main">
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We encountered an unexpected error. Please try refreshing the page.
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="body2">
                If this problem persists, please contact support.
              </Typography>
            </Alert>
            
            <Button 
              variant="contained" 
              onClick={this.handleReload}
              sx={{ mr: 2 }}
            >
              Reload Page
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
