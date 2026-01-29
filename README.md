

# 🏥 Hospital OPD Token Allocation Engine

> **Backend Assignment: Elastic Capacity Management System**

---

## 📌 Project Overview

This system is a **dynamic token allocation engine** designed to manage hospital OPD queues. Unlike a simple "First-Come, First-Served" list, this engine uses a **Weighted Priority Algorithm** to handle real-world hospital chaos—such as emergencies jumping the line, paid priority patients, and doctor delays.

---

## ⚙️ Core Logic & Prioritization 

To balance business needs with medical urgency, I implemented a **Dynamic Scoring Formula**:

```
TotalScore = BaseWeight + WaitTimeBonus
```

### 1. Source Weighting (Prioritization) 

Each patient source is assigned a base priority level:

- 🚨 **Emergency (1000 pts):** Immediate attention; bypasses all limits.
- 💳 **Paid Priority (500 pts):** Higher placement for premium service.
- 📱 **Online Booking (300 pts):** Standard scheduled appointments.
- 🚶 **Walk-in (200 pts):** Standard on-site registration.
- 🔄 **Follow-up (100 pts):** Brief check-ups.

### 2. Anti-Starvation Rule (Fairness)

To prevent a "Walk-in" from waiting forever while "Priority" patients keep arriving, the engine adds **+2 points for every minute** a patient waits. Over time, a long-waiting patient's score will naturally rise to the top.

---

## 🛠️ Handling Real-World Edge Cases 

### 1. Elastic Capacity Management 

- **Hard Limits:** Each slot has a max capacity (e.g., 6 patients/hour). The system blocks standard bookings once this is reached.
- **Elasticity:** **Emergency** insertions are allowed to exceed the hard limit (e.g., becoming the 7th patient in a 6-person slot) to ensure life-saving care is never blocked by software constraints.

### 2. Cancellations & No-Shows 

- **Dynamic Reallocation:** When a patient cancels, their status is updated, and the `getNextPatient` algorithm immediately re-calculates the queue to "pull up" the next highest-scoring patient.
- **No-Shows:** Patients who aren't present are marked as `NO_SHOW`, allowing the doctor to proceed without idling.

### 3. Failure Handling 

- **Input Validation:** Prevents "garbage data" from entering the engine.
- **Global Error Middleware:** Ensures that if a calculation fails, the server sends a clean error message rather than crashing, keeping the clinic operational.

---

## 🚀 API Design 

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/book` | Creates a token. Validates capacity vs. patient type. |
| `GET` | `/api/next-up/:docId` | **The Brain:** Returns the next best patient to see. |
| `PATCH` | `/api/status/:id` | Handles Cancellations, No-shows, or completions. |

---

## 👨‍💻 How to Run the Simulation 

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup Environment:**
   Add your Mongo URI to the `.env` file.

3. **Seed Data:**
   ```bash
   node seed.js
   ```
   *(Creates 3 doctors with specific slots)*

4. **Run Simulation:**
   ```bash
   node simulation.js
   ```
   *This script demonstrates: Filling a slot, blocking a walk-in at max capacity, injecting an emergency, and re-calculating the queue order.*

---

## 💡 Why I Chose This Approach (Trade-offs) 

I chose **Node.js/Express** for its non-blocking I/O, which is vital when multiple receptionists and doctors are updating the same queue simultaneously. While a simple array would work for small clinics, this weighted scoring system is designed to scale as hospital rules become more complex.

---