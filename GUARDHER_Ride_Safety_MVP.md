# GUARDHER: Ride Safety MVP

## Core Concept: Preloaded Safety Session
The strongest feature of GUARDHER is its approach to emergencies: **during an emergency, the user does almost nothing.**

Instead of waiting for an incident to occur before collecting information, the user "preloads" the system before the ride begins.

### Workflow: The Ride Safety Session
1. **Book Ride**: The user books a ride on a platform (Yango, Uber, InDrive, etc.).
2. **Add Ride Details**: The user manually enters or uploads the ride details into GUARDHER (e.g., driver's name, photo, vehicle make/model, number plate).
3. **Select Trusted Contacts**: The user selects contacts to be notified in an emergency (e.g., parent, sibling, spouse, friend, guardian).
4. **Start Live Safety Session**: The user taps "Start Safe Ride".
5. **Travel**: The main screen becomes extremely simple, removing all clutter and presenting only the necessary emergency triggers.
6. **Emergency Trigger**: One tap on the appropriate alert button.
7. **Instant Action**: The complete ride data packet, live location tracking, and timestamp are instantly sent to the relevant department, ride-hailing safety partner (if authorized), and trusted contacts.

### The Two Emergency Levels
While traveling, the main interface is simplified to avoid complex navigation or typing during a state of fear.

#### 1. "I Feel Unsafe"
- **Use Case**: Discomfort, suspicious behaviour, inappropriate comments, strange route changes, etc.
- **Action**: Immediately notifies trusted contacts and begins enhanced monitoring.

#### 2. "SOS / Emergency"
- **Use Case**: Immediate danger (answers the core question: "Are you currently in immediate danger? YES").
- **Action**: Instantly sends the complete ride packet to:
  - Emergency response pathway / Relevant department
  - Selected trusted contacts
  - Ride company's safety team (where an authorized partnership/API integration exists).

### The Data Packet
When an alert is triggered, GUARDHER instantly creates an incident using the pre-collected information. This packet contains:
*   **Passenger**: Registered GUARDHER user
*   **Ride service**: (e.g., Yango)
*   **Driver**: (e.g., Ahmed Khan)
*   **Vehicle**: (e.g., Toyota Corolla)
*   **Number plate**: (e.g., ABC-123)
*   **Pickup**: (e.g., University Road)
*   **Destination**: (e.g., Clifton)
*   **Current position**: Live GPS link (updates continuously, rather than sending a static point)
*   **Time**: (e.g., 9:42 PM)
*   **Ride status**: Active
*   **Alert type**: Passenger feels unsafe / SOS

### Future Vision: Platform Integration
Currently, this relies on manual ride-detail entry. However, if platforms like Yango or InDrive officially integrate with GUARDHER, the manual entry step disappears entirely:
`Book Ride → GUARDHER receives authorized ride data → Start Safe Ride → One-tap emergency`

Until such integration exists, this should be presented in documentation and pitches as **manual ride-detail entry / proposed platform integration**, ensuring driver/ride data is accessed securely and in compliance with legal data-sharing agreements.
