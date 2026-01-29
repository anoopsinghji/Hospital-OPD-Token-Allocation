require('dotenv').config();
const mongoose = require('mongoose');
const Doctor = require('../models/doctor');

const seedDoctors = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    const doctors = [
        { 
            name: "Dr. Smith (General)", 
            slots: [{ startTime: "09:00", endTime: "10:00", maxCapacity: 5 }] 
        },
        { 
            name: "Dr. Kapoor (Pediatrics)", 
            slots: [{ startTime: "10:00", endTime: "11:00", maxCapacity: 3 }] 
        },
        { 
            name: "Dr. Sharma (Cardio)", 
            slots: [{ startTime: "09:00", endTime: "10:00", maxCapacity: 4 }] 
        }
    ];

    await Doctor.deleteMany(); // Clear existing
    await Doctor.insertMany(doctors);
    console.log("3 Doctors seeded successfully!");
    process.exit();
};

seedDoctors();