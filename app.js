require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Import Routes
const tokenRoutes = require('./routes/tokenRoutes');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Hospital DB Connected"))
    .catch(err => console.error("DB Connection Error:", err));

// Register Routes
app.use('/api', tokenRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
