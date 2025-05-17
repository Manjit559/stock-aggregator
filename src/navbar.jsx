// Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Stock Aggregator
        </Typography>
        <Button
          color="inherit"
          onClick={() => navigate('/stock')}
          variant={location.pathname === '/stock' ? 'outlined' : 'text'}
        >
          Stock Page
        </Button>
        <Button
          color="inherit"
          onClick={() => navigate('/correlation')}
          variant={location.pathname === '/correlation' ? 'outlined' : 'text'}
        >
          Correlation Heatmap
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
