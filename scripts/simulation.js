require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const Doctor = require('../models/doctor');

const BASE_URL = 'http://localhost:5000/api'; // Adjust based on your route prefix

async function runSimulation() {
    try {
        console.log("--- 🏥 Starting OPD Day Simulation ---");

        // 1. Setup: Connect to DB and Get a Doctor's ID
        await mongoose.connect(process.env.MONGO_URI);
        const doctor = await Doctor.findOne({ name: /Dr. Smith/ });
        
        if (!doctor) {
            throw new Error("No doctor found. Please run seed.js first.");
        }
        
        const doctorId = doctor._id.toString();
        const slot = "09:00-10:00";
        console.log(`Using Doctor: ${doctor.name} (ID: ${doctorId})`);

        console.log("\nStep 1: Filling the slot (Hard Limit Test)");
        // Add 5 Online Bookings (Assuming maxCapacity is 5)
        for(let i = 1; i <= 5; i++) {
            const res = await axios.post(`${BASE_URL}/book`, {
                doctorId, slotTime: slot, patientType: 'ONLINE'
            });
            console.log(`✅ Booked Online Patient: ${res.data._id}`);
        }

        console.log("\nStep 2: Testing Hard Limit Enforcement");
        try {
            await axios.post(`${BASE_URL}/book`, {
                doctorId, slotTime: slot, patientType: 'WALKIN'
            });
        } catch (err) {
            console.log("❌ Correctly blocked: Slot is full for Walk-ins."); [cite: 14]
        }

        console.log("\nStep 3: Emergency Insertion (Elastic Capacity Test)");
        const emergency = await axios.post(`${BASE_URL}/book`, {
            doctorId, slotTime: slot, patientType: 'EMERGENCY'
        });
        console.log(`🚨 Emergency Patient Admitted: ${emergency.data._id}`); [cite: 11, 15]

        console.log("\nStep 4: Who is next?");
        const next = await axios.get(`${BASE_URL}/next-up/${doctorId}`);
        console.log(`👉 The Engine says see this patient first: ${next.data.patientType} (ID: ${next.data._id})`); [cite: 17]

        console.log("\n--- Simulation Complete ---");
        await mongoose.connection.close();
    } catch (error) {
        console.error("Simulation Failed:", error.response?.data || error.message);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
    }
}

runSimulation();