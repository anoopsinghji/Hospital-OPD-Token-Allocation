
#  Hospital OPD Token Allocation Engine

##  Project Overview
[cite_start]Design and implement a dynamic token allocation engine for hospital OPD that supports **elastic capacity management**[cite: 2, 3]. [cite_start]Unlike a simple "First-Come, First-Served" list, this engine uses a **Weighted Priority Algorithm** to handle real-world variability—such as emergencies, cancellations, and doctor delays[cite: 11, 15].

---

##  Core Logic & Prioritization 
To balance business needs with medical urgency, the engine implements a **Dynamic Scoring Formula**:

$$Total Score = Base Weight + (Wait Time \times 2)$$

### 1. Source Weighting (Prioritization)
[cite_start]Each patient source is assigned a base priority level[cite: 17, 27]:
* [cite_start]**Emergency (1000 pts):** Immediate attention; bypasses all hard limits[cite: 11].
* [cite_start]**Paid Priority (500 pts):** Higher placement for premium service[cite: 9].
* [cite_start]**Online Booking (300 pts):** Standard scheduled appointments[cite: 7].
* [cite_start]**Walk-in (200 pts):** Standard on-site registration[cite: 8].
* [cite_start]**Follow-up (100 pts):** Brief check-ups for existing patients[cite: 10].

### 2. Anti-Starvation Rule (Fairness)
To prevent "starvation" (where a low-priority patient never sees the doctor), the engine adds **+2 points for every minute** a patient waits. This ensures that a long-waiting walk-in eventually gains enough priority to be seen, even if new priority patients arrive.

---

##  Handling Real-World Edge Cases

### 1. Elastic Capacity Management
* [cite_start]**Hard Limits:** The system enforces a per-slot maximum capacity for standard patients to prevent doctor burnout[cite: 5, 14].
* [cite_start]**Elasticity:** The system allows **Emergency** insertions to exceed the capacity (e.g., becoming the 7th patient in a 6-person slot)[cite: 3, 11].

### 2. Dynamic Reallocation
* [cite_start]**Cancellations:** If a patient cancels, the engine marks the token as `CANCELLED` and immediately re-ranks the remaining queue to fill the gap[cite: 15, 18].
* [cite_start]**No-Shows:** Patients not present when called are flagged, allowing the engine to proceed to the next highest-priority patient without idling[cite: 18].

### 3. Failure Handling
* [cite_start]**Global Error Middleware:** Centralized error handling for all API requests to ensure system uptime[cite: 29].
* [cite_start]**Validation:** Strict schema validation to prevent "garbage data" from corrupting the queue logic.

---

##  API Design (Endpoints & Schema)

### Data Schema (Token)
``
{
  "doctorId": "ObjectId",
  "slotTime": "String (e.g., 09:00-10:00)",
  "patientType": "Enum (EMERGENCY, PRIORITY, ONLINE, etc.)",
  "status": "Enum (WAITING, ACTIVE, COMPLETED, CANCELLED)",
  "createdAt": "Timestamp"
}

##  API Design 

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/book` | Creates a token. Validates capacity vs. patient type. |
| `GET` | `/api/next-up/:docId` | **The Brain:** Returns the next best patient to see. |
| `PATCH` | `/api/status/:id` | Handles Cancellations, No-shows, or completions. |

---

##  How to Run the Simulation 

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

##  Why I Chose This Approach (Trade-offs) 

I chose **Node.js/Express** for its non-blocking I/O, which is vital when multiple receptionists and doctors are updating the same queue simultaneously. While a simple array would work for small clinics, this weighted scoring system is designed to scale as hospital rules become more complex.

---
