/**
 * PATIENT_WEIGHTS maps the importance of the token source.
 */
const PATIENT_WEIGHTS = {
    EMERGENCY: 1000,   // Highest priority
    PRIORITY: 500,    // Paid priority
    ONLINE: 300,      // Scheduled booking
    WALKIN: 200,      // OPD desk
    FOLLOW_UP: 100    // Follow-up patients
};

const calculateScore = (token) => {
    const baseWeight = PATIENT_WEIGHTS[token.patientType] || 0;
    
    // Calculate minutes since the token was created
    const waitTimeInMinutes = Math.floor((new Date() - new Date(token.createdAt)) / 60000);
    
    // Rule: Add 2 points for every minute waited to prevent "Starvation"
    const waitBonus = waitTimeInMinutes * 2;
    
    return baseWeight + waitBonus;
};

module.exports = { calculateScore };
