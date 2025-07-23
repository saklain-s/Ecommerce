import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2', // blue
    },
    secondary: {
      main: '#ff9800', // orange
    },
    background: {
      default: '#181a1b',
      paper: '#23272f',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '0.02em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.2rem',
    },
    body1: {
      fontSize: '1.1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
        },
      },
    },
  },
});

export default theme; 