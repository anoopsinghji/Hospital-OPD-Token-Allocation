const Token = require('../models/token');
const Doctor = require('../models/doctor');
const { calculateScore } = require('../utils/priorityEngine');

exports.bookToken = async (req, res) => {
    try {
        const { doctorId, slotTime, patientType } = req.body;

        // 1. Fetch Doctor to check Hard Limits 
        const doctor = await Doctor.findById(doctorId);
        const slot = doctor.slots.find(s => s.startTime + "-" + s.endTime === slotTime);

        // 2. Capacity Check
        const activeTokensCount = await Token.countDocuments({
            doctorId, slotTime, status: 'WAITING'
        });

        // Elastic Capacity Rule: Only block if NOT an emergency
        if (activeTokensCount >= slot.maxCapacity && patientType !== 'EMERGENCY') {
            return res.status(400).json({ message: "Slot capacity reached. Only Emergencies allowed." });
        }

        const newToken = await Token.create({
            doctorId, slotTime, patientType,
            status: 'WAITING'
        });

        res.status(201).json(newToken);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getNextPatient = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // 3. Dynamic Reallocation: Fetch all waiting patients 
        const waitingPatients = await Token.find({ doctorId, status: 'WAITING' });

        if (waitingPatients.length === 0) {
            return res.status(200).json({ message: "No patients waiting." });
        }

        // 4. Sort based on the Priority Scoring Algorithm
        const sortedQueue = waitingPatients.sort((a, b) => {
            return calculateScore(b) - calculateScore(a);
        });

        const nextPatient = sortedQueue[0];
        res.status(200).json(nextPatient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTokenStatus = async (req, res) => {
    try {
        const { tokenId } = req.params;
        const { status } = req.body;

        const updatedToken = await Token.findByIdAndUpdate(
            tokenId,
            { status },
            { new: true }
        );

        if (!updatedToken) return res.status(404).json({ message: "Token not found" });

        // Logic Note: If status becomes CANCELLED, the next call to 
        // getNextPatient will automatically pull up the next person.
        res.status(200).json(updatedToken);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
