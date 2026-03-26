const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const authController = require('./controllers/authController');
const voteController = require('./controllers/voteController');
const candidateRoutes = require('./routes/candidateRoutes');
const electionRoutes = require('./routes/electionRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Database Connection with Fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eloktantra';
const connectWithFallback = async () => {
  try {
    // Try primary URI
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB: Connected to Primary (Atlas/Env)');
  } catch (err) {
    console.warn('MongoDB: Connection to Primary failed, falling back to Local (127.0.0.1)');
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/eloktantra');
      console.log('MongoDB: Connected to Localhost');
    } catch (localErr) {
      console.error('MongoDB: Fatal - Local connection also failed:', localErr);
    }
  }
};
connectWithFallback();

// Middleware for Device Check
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'] || 'unknown';
  req.deviceId = Buffer.from(userAgent).toString('base64');
  next();
});

// Routes
app.get('/auth/digilocker/callback', authController.digilockerCallback);
app.get('/auth/users', authController.getUsers);
app.post('/voter/verify-face', authController.faceVerify);
app.post('/risk/evaluate', voteController.evaluateRisk);
// Set up Multer for File Uploads
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.post('/voter/upload-card', upload.single('voterCard'), authController.uploadCard);
app.use('/uploads', express.static(uploadDir));
app.post('/voter/find', authController.findVoter);
app.post('/generate-token', voteController.generateVotingToken);
app.post('/vote', voteController.castVote);
app.use('/candidates', candidateRoutes);
app.use('/elections', electionRoutes);
app.get('/elections/:id/counts', electionController.getElectionCounts);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});
