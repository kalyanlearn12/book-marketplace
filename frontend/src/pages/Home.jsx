import React from 'react'; // Add this import
import { Typography, Container, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Welcome to BookExchange
        </Typography>
        <Typography variant="h5" gutterBottom>
          Buy, Sell, or Lend Books with Your Community
        </Typography>
        {!user && (
          <Box sx={{ mt: 4 }}>
            <Button variant="contained" component={Link} to="/register" sx={{ mr: 2 }}>
              Join Now
            </Button>
            <Button variant="outlined" component={Link} to="/login">
              Login
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Home;