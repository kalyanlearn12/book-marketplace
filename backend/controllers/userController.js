const User = require('../models/User');
const Book = require('../models/Book');

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserBooks = async (req, res) => {
  try {
    const books = await Book.find({ owner: req.params.id });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};