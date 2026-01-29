const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    slotTime: { type: String, required: true }, // e.g., "09:00-10:00"
    patientType: { 
        type: String, 
        enum: ['EMERGENCY', 'PRIORITY', 'ONLINE', 'WALKIN', 'FOLLOW_UP'], 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['WAITING', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED', 'NO_SHOW'], 
        default: 'WAITING' 
    },
    tokenNumber: Number,
    createdAt: { type: Date, default: Date.now } // Used for "Wait Time" logic
});

module.exports = mongoose.model('Token', TokenSchema);
