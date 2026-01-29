const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');

// 1. Book a new token (Online, Walk-in, Emergency, etc.)
router.post('/book', tokenController.bookToken);

// 2. Get the next patient for a specific doctor (The Engine Output)
router.get('/next-up/:doctorId', tokenController.getNextPatient);

// 3. Update status (Handles Cancellations, No-shows, or Starting Consultation)
// PATCH /api/tokens/T-123/status { "status": "CANCELLED" }
router.patch('/:tokenId/status', tokenController.updateTokenStatus);

module.exports = router;