require('dotenv').config(); // Add this at the top of seed.js
const mongoose = require('mongoose');
const Book = require('./models/Book');
const User = require('./models/User');

// Add connection error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Book.deleteMany({});
    await User.deleteMany({});

    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123' // Will be hashed automatically
    });

    await Book.create([
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        owner: user._id,
        forSale: true,
        price: 10.99,
        condition: 'Good'
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        owner: user._id,
        forLend: true,
        condition: 'Like New'
      }
    ]);

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    mongoose.disconnect();
  }
};

seedDatabase();