import React from 'react'; // Add this import
import axios from 'axios'; // Add this import
import { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  CircularProgress, 
  Alert,
  Typography,
  Box
} from '@mui/material';
import BookCard from '../components/BookCard';
import bookService from '../services/bookService';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Checking if useEffect runs...");
    const fetchBooks = async () => {
      console.log("Attempting to fetch books...");
      try {
        const response = await bookService.getBooks();
        console.log("API Response:", response);
        setBooks(response);
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    fetchBooks();
  }, []);


 

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          Error loading books: {error}
        </Alert>
      </Container>
    );
  }

  if (books.length === 0) {
    return (
      <Container maxWidth="md">
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No books available yet. Check back later!
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {books.map((book) => (
          <Grid item key={book._id} xs={12} sm={6} md={4}>
            <BookCard book={book} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Books;

