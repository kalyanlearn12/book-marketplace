require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Allow specific origins (replace with your Vercel URL)
const allowedOrigins = [
  'https://book-market-kalyanlearn12-kalyans-projects-d61236cc.vercel.app',
  'http://localhost:5173', // Keep for local development,
  'https://book-market.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    console.log('Incoming Origin:', origin); // Debug log

    if (!origin) return callback(null, true);

    if (allowedOrigins.some(allowed => {
      return origin === allowed || 
             origin.startsWith('https://book-market-') || // All Vercel preview URLs
             origin.endsWith('.vercel.app');
    })) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('Blocked Origin:', origin); // Debug log
      const msg = 'CORS Policy Rejection: ' + origin;
      return callback(new Error(msg), false);
    }


    console.log('Blocked Origin:', origin);
    return callback(new Error('Not allowed by CORS'), false);


  },
  credentials: true
}));


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// 4. Debug endpoint
app.get('/api/cors-check', (req, res) => {
  res.json({
    headers: req.headers,
    allowedOrigins,
    yourOrigin: req.headers.origin
  });
});


// Middleware

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





