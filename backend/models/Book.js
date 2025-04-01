const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String },
  condition: { type: String, enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'] },
  price: { type: Number },
  forSale: { type: Boolean, default: false },
  forLend: { type: Boolean, default: false },
  coverImage: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);