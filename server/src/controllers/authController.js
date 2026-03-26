const userRepository = require('../repositories/userRepository');
const { fetchToken, fetchUserInfo } = require('../integrations/digilocker');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const digilockerCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: 'Auth code missing' });
    }

    // 1. Get token
    const tokenData = await fetchToken(code);
    const accessToken = tokenData.access_token;

    // 2. Get user info
    const digilockerUser = await fetchUserInfo(accessToken);

    const { name, voterId, dob } = digilockerUser;

    // 3. User Management logic (Using repository for robustness)
    let user = await userRepository.findOne({ voterId });
    if (!user) {
      user = await userRepository.create({
        name,
        voterId,
        dob: new Date(dob),
        hasVoted: false
      });
    }

    // 4. Eligibility check (Age >= 18)
    const birthDate = new Date(user.dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    const isAdult = age >= 18;

    if (!isAdult) {
      return res.status(403).json({ error: 'Not eligible: Must be 18+' });
    }

    if (user.hasVoted) {
      return res.status(403).json({ error: 'Already voted' });
    }

    // 5. Issue JWT
    const authToken = jwt.sign({ userId: user._id, verified: true }, JWT_SECRET, { expiresIn: '30m' });

    res.json({
      user,
      authToken,
      status: 'VERIFICATION_PENDING' // User needs Face verify next
    });
  } catch (error) {
    console.error('DigiLocker Auth Error:', error.message);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

const faceVerify = async (req, res) => {
  try {
    const { liveEmbedding, voterCardEmbedding, voterIdHash } = req.body;
    
    if (!liveEmbedding || !voterCardEmbedding || !voterIdHash) {
      return res.status(400).json({ success: false, error: 'Missing embeddings or voter info' });
    }

    const similarity = cosineSimilarity(liveEmbedding, voterCardEmbedding);
    if (similarity < 0.75) {
      return res.status(403).json({ success: false, match: false, error: `Low face confidence score: ${similarity.toFixed(2)}` });
    }

    // Update Postgres
    await db.query('UPDATE voters SET face_verified = $1 WHERE voter_id_hash = $2', [true, voterIdHash]);

    res.json({ success: true, match: true, confidence: similarity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Face verification failed' });
  }
};

const uploadCard = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No voter card file uploaded' });
    }

    const name = req.body.name || 'Unknown';
    const dob = req.body.dob || null;

    // Simulate Fake OCR extraction
    const extractedName = name;
    // Generate a consistent dummy voter ID based on name or random
    const extractedVoterId = `EPIC${crypto.randomInt(100000, 999999)}`;
    const extractedConstituency = 'Varanasi';

    const voterIdHash = crypto.createHash('sha256').update(extractedVoterId).digest('hex');
    const nameEncrypted = Buffer.from(extractedName).toString('base64'); // Mock simple encryption for demo
    
    const imagePath = `/uploads/${req.file.filename}`;

    const insertQuery = `
      INSERT INTO voters (voter_id_hash, name_encrypted, constituency, voter_card_image_path)
      VALUES ($1, $2, $3, $4)
      RETURNING id, voter_id_hash, constituency;
    `;
    await db.query(insertQuery, [voterIdHash, nameEncrypted, extractedConstituency, imagePath]);

    res.json({
      success: true,
      file: req.file.filename,
      extractedDetails: {
        name: extractedName,
        voterId: extractedVoterId,
        constituency: extractedConstituency
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: 'Internal server error during upload' });
  }
};

const findVoter = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ success: false, error: 'Identifier missing' });

    // Match voter_id_hash OR name
    const nameEnc = Buffer.from(identifier).toString('base64'); // Mock simple decryption logic
    const voterHash = crypto.createHash('sha256').update(identifier).digest('hex');

    const result = await db.query(
      'SELECT * FROM voters WHERE voter_id_hash = $1 OR name_encrypted = $2 OR name_encrypted = $3',
      [voterHash, nameEnc, identifier] // testing raw identifier just in case it wasn't encrypted
    );
    
    if (result.rows.length > 0) {
      res.json({ success: true, voter: result.rows[0] });
    } else {
      res.json({ success: false, error: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

module.exports = {
  digilockerCallback,
  faceVerify,
  uploadCard,
  findVoter
};
