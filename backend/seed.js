require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Book = require('./models/Book');
const User = require('./models/User');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB Connected for seeding');

    // Clear existing data
    await Book.deleteMany({});
    await User.deleteMany({});

    // Create owner user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const owner = await User.create({
      username: "bookadmin",
      email: "admin@bookexchange.com",
      password: hashedPassword
    });

    // Create books with owner reference
    const sampleBooks = [
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        condition: "Good",
        price: 12.99,
        forSale: true,
        owner: owner._id  // Reference the created user
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        condition: "Like New",
        forLend: true,
        owner: owner._id  // Reference the created user
      }
    ];

    await Book.insertMany(sampleBooks);
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();