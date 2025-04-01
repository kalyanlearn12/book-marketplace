import React from 'react'; // Add this import
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>BookExchange</Link>
        </Typography>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Button color="inherit" component={Link} to="/books">Browse Books</Button>
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/my-books">My Books</Button>
              <Button color="inherit" component={Link} to="/books/add">Add Book</Button>
              <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;