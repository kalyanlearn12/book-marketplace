const Book = require('../models/Book');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

exports.upload = multer({ storage });

exports.createBook = async (req, res) => {
  try {
    const { title, author, isbn, condition, price, forSale, forLend } = req.body;
    const coverImage = req.file ? req.file.filename : null;

    const book = new Book({
      title,
      author,
      isbn,
      condition,
      price,
      forSale,
      forLend,
      coverImage,
      owner: req.user.id
    });

    await book.save();
    
    // Add book to user's booksListed
    await User.findByIdAndUpdate(req.user.id, { $push: { booksListed: book._id } });

    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const { type } = req.query;
    let query = { available: true };

    if (type === 'sale') query.forSale = true;
    if (type === 'lend') query.forLend = true;

    console.log('Query:', query); // Debugging line
    const books = await Book.find(query).populate('owner', 'username');
    res.json(books);
  } catch (err) {
    console.error('Error fetching books:', err); // Debugging line
    res.status(500).json({ message: err.message });
  }
};

exports.borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book || !book.available) {
      return res.status(404).json({ message: 'Book not available' });
    }

    if (!book.forLend) {
      return res.status(400).json({ message: 'Book not available for lending' });
    }

    book.borrower = req.user.id;
    book.available = false;
    await book.save();

    // Add book to borrower's booksBorrowed
    await User.findByIdAndUpdate(req.user.id, { $push: { booksBorrowed: book._id } });

    res.json({ message: 'Book borrowed successfully', book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add more controller methods as needed...