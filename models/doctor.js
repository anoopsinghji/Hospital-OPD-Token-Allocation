const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: String,
    slots: [{
        startTime: String, // e.g., "09:00"
        endTime: String,   // e.g., "10:00"
        maxCapacity: { type: Number, default: 6 } // Hard limit [cite: 5]
    }]
});

module.exports = mongoose.model('Doctor', DoctorSchema);