import React from 'react';
import { Box } from '@mui/material';
import { Card, CardMedia, CardContent, Typography, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {book.coverImage && (
        <CardMedia
          component="img"
          height="200"
          image={`http://localhost:5000/uploads/${book.coverImage}`}
          alt={book.title}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          by {book.author}
        </Typography>
        
        <Box sx={{ mt: 1, mb: 1 }}>
          {book.forSale && (
            <Chip label={`$${book.price}`} color="primary" sx={{ mr: 1 }} />
          )}
          {book.forLend && (
            <Chip label="Available for lending" color="secondary" />
          )}
        </Box>

        <Typography variant="body2">
          Condition: {book.condition}
        </Typography>
      </CardContent>
      <CardContent>
        <Button 
          component={Link} 
          to={`/books/${book._id}`} 
          size="small" 
          variant="contained"
          fullWidth
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookCard;