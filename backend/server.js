require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();


//CORS Starts
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

  console.log('cors check', cors);
  res.json({
    headers: req.headers,
    allowedOrigins,
    yourOrigin: req.headers.origin
  });
});
//CORS Ends

// Middleware Starts
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Middleware Ends


// Database Connection Starts
/*mongoose.connect(process.env.MONGODB_URI)
   .then(() => console.log('Connected to MongoDB'))
   .catch(err => console.error('MongoDB connection error:', err));*/


const RETRY_DELAY_BASE_MS = 1000; // Start with 1 second delay
const MAX_RETRY_DELAY_MS = 30000; // Max 30 seconds between retries
let retryCount = 0;

const connectDB = async () => {
  // Use original SRV URI if available, otherwise fallback to local
  const connStr = process.env.MONGODB_URI;
  
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Faster initial failure detection
    socketTimeoutMS: 30000,
    connectTimeoutMS: 10000,
    retryWrites: true,
    w: 'majority'
  };

  try {
    console.log(`MongoDB URI: ${connStr.replace(/:[^@]+@/, ':*****@')}`); // Hide password
    console.log(`Attempting MongoDB connection (Attempt ${retryCount + 1})...`);
    
    await mongoose.connect(connStr, options);
    
    retryCount = 0; // Reset on successful connection
    console.log(`✅ MongoDB Connected to: ${mongoose.connection.host}`);
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);

  } catch (err) {
    retryCount++;
    const delayMs = Math.min(RETRY_DELAY_BASE_MS * Math.pow(2, retryCount), MAX_RETRY_DELAY_MS);
    
    console.error(`❌ Connection failed (Attempt ${retryCount}):`, {
      error: err.message,
      stack: err.stack,
      nextRetry: `${delayMs / 1000} seconds`,
      connectionString: connStr.replace(/:[^@]+@/, ':*****@') // Hide password
    });

    // Exponential backoff with jitter
    const jitter = delayMs * 0.2 * Math.random();
    setTimeout(connectDB, delayMs + jitter);
  }
};

// Connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open');
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected');
  connectDB(); // Auto-reconnect
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose default connection disconnected through app termination');
  process.exit(0);
});

module.exports = connectDB;
// Database Connection Ends

connectDB(); // Initialize connection

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





