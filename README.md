# GUARDHER: Empowering Women's Ride Safety

## 🚀 Overview

**GUARDHER** is a pioneering ride safety platform meticulously designed to provide an unparalleled layer of security for passengers, particularly women, during their journeys. It introduces a revolutionary "Preloaded Safety Session" concept, enabling users to proactively input critical ride and contact details before a trip begins. In the event of an emergency, GUARDHER facilitates instant, one-tap alerts that dispatch a comprehensive data packet—including live location, ride specifics, and timestamps—to emergency services, ride-hailing partners, and pre-selected trusted contacts with minimal user interaction.

Built as a full-stack Next.js application, GUARDHER prioritizes real-time intelligence, robust architecture, and a seamless user experience to transform ride safety from reactive to proactive.

## ✨ Core Features

### The Preloaded Safety Session: Proactive Protection

GUARDHER's cornerstone feature is its **Preloaded Safety Session**, which shifts the paradigm of emergency response from reactive to proactive. Instead of scrambling for information during a crisis, users prepare the system beforehand, ensuring immediate action when it matters most.

**Workflow:**

1.  **Book Ride**: User books a ride via any platform (e.g., Yango, Uber, InDrive).
2.  **Add Ride Details**: User manually enters or uploads essential ride information into GUARDHER (driver's name, photo, vehicle make/model, number plate, pickup, destination).
3.  **Select Trusted Contacts**: User designates contacts (e.g., family, friends) to be notified in an emergency.
4.  **Start Live Safety Session**: User initiates the "Start Safe Ride" session within GUARDHER.
5.  **Travel**: The app's main screen simplifies, displaying only critical emergency triggers.
6.  **Emergency Trigger**: A single tap on the appropriate alert button.
7.  **Instant Action**: The complete ride data packet, live location tracking, and timestamp are immediately dispatched.

### Two Emergency Levels: Contextual Response

The in-ride interface is streamlined for clarity and ease of use during stressful situations, offering two distinct emergency triggers:

1.  **"I Feel Unsafe"**:
    *   **Use Case**: Feelings of discomfort, suspicious behavior, inappropriate comments, unexpected route deviations, etc.
    *   **Action**: Immediately notifies trusted contacts and initiates enhanced monitoring of the ride.
2.  **"SOS / Emergency"**:
    *   **Use Case**: Immediate and imminent danger, answering the critical question: "Are you currently in immediate danger? YES."
    *   **Action**: Instantly dispatches the complete ride data packet to:
        *   Designated emergency response pathways / relevant authorities.
        *   Selected trusted contacts.
        *   Ride-hailing company's safety team (where authorized API integrations exist).

### The Instant Data Packet

Upon an alert, GUARDHER compiles and dispatches a comprehensive incident packet containing:

*   **Passenger**: Registered GUARDHER user details.
*   **Ride Service**: (e.g., Yango, Uber).
*   **Driver**: Name, photo (if provided).
*   **Vehicle**: Make, model.
*   **Number Plate**: Vehicle registration.
*   **Pickup & Destination**: Planned journey points.
*   **Current Position**: A live GPS link that continuously updates.
*   **Time**: Timestamp of the alert.
*   **Ride Status**: Active.
*   **Alert Type**: "Passenger feels unsafe" or "SOS".

### Advanced System Capabilities (Current & Future)

*   **Next.js Full Stack**: Leveraging React Server Components, Client Components, and serverless API handlers for a robust and scalable web application.
*   **Real-time Tracking**: Utilizing Server-Sent Events (SSE) or WebSockets for continuous live location updates.
*   **Emergency Dispatch Dashboard**: A secure web portal (built with Next.js) for authorized departments to view, triage, and act on incidents with live geospatial maps and instant intelligence packets.
*   **Silent Escalation (Future)**: If "I Feel Unsafe" is triggered, the system can prompt the user later; if no "all clear" PIN is entered, it auto-escalates to "SOS".
*   **Offline Buffering (Future)**: Buffers GPS points during signal loss and bulk-uploads upon reconnection.
*   **Hardware Triggering (Future)**: Integration with physical device buttons for discreet SOS activation.
*   **Off-Route Detection (Future)**: Algorithmic logic to detect significant deviations from the planned route.

## 🏛️ System Architecture

GUARDHER functions as a sophisticated **coordination and decision-support layer**, providing instantaneous, highly detailed, preloaded intelligence to authorized emergency departments.

```mermaid
graph TD
    subgraph 1. User Touchpoints
        A[Mobile App - Passenger (Next.js Web App)]
        B[Wearable Integration Future]
    end

    subgraph 2. GUARDHER Core (Next.js Backend API)
        C[API Gateway & Auth]
        D[Ride & Session Intelligence]
        E[Live Tracking Engine WebSockets/SSE]
        F[AI Incident Triage & Routing Engine (Future)]
    end

    subgraph 3. External Integrations (Data In)
        G[Ride-Hailing APIs Yango, Uber (Future)]
        H[Manual Preload Data]
    end

    subgraph 4. Emergency Response (Data Out)
        I[Next.js Dispatch Dashboard]
        J[Trusted Contacts SMS/Push]
        K[Ride-Hailing Safety Team Webhooks (Future)]
    end

    %% Flow
    H --> A
    G -.-> D
    A --> C
    C --> D
    C --> E
    A -- "I Feel Unsafe / SOS" --> F
    E --> F
    
    F -->|Critical Incident Payload| I
    F -->|Alerts & Tracking Link| J
    F -.->|Partner Notification| K
```

## 🛠️ Technology Stack

GUARDHER is built on a modern, unified JavaScript/TypeScript ecosystem, ensuring rapid development, maintainability, and scalability.

*   **Web Application & Backend API**: **Next.js** (React, TypeScript)
    *   Utilizes the App Router for a highly performant and responsive user interface.
    *   Next.js API Routes handle all core logic, user authentication, session management, and data coordination.
*   **Mobile App (Future)**: **React Native (Expo)**
    *   Planned for deep native access to background GPS and hardware features, leveraging the same TypeScript codebase.
*   **Database**: **Local SQL** (for current MVP development)
    *   Designed for future integration with robust SQL databases (e.g., PostgreSQL) for production-grade data persistence.
*   **Real-time Communication**: **Server-Sent Events (SSE) / WebSockets**
    *   For live location tracking and instant alert propagation.
*   **SMS Notifications**: **Twilio**
    *   Integrated for reliable dispatch of emergency alerts to trusted contacts.
*   **Mapping**: **Mapbox GL JS** (or similar)
    *   For interactive maps displaying live ride paths and incident locations.
*   **Styling**: **Tailwind CSS**
    *   For utility-first, rapid UI development.

## 🚀 Getting Started

Follow these steps to set up and run the GUARDHER application locally.

### Prerequisites

*   **Node.js**: Version 18.x or higher.
*   **npm** (or yarn/pnpm/bun): Node.js package manager.
*   **Git**: For cloning the repository.
*   **Mapbox Account**: To obtain a public access token for map display.
*   **Twilio Account**: To obtain Account SID, Auth Token, and a Twilio Phone Number for SMS notifications.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/IHassanshaikh/GuardHer.git
    cd GuardHer/guardher-app
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or yarn install
    # or pnpm install
    # or bun install
    ```

3.  **Configure Environment Variables:**

    Create a `.env.local` file in the `guardher-app/` directory (next to `package.json`) and add the following variables. Replace the placeholder values with your actual credentials.

    ```env
    # Mapbox Public Access Token (for client-side map display)
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=YOUR_MAPBOX_PUBLIC_ACCESS_TOKEN

    # Twilio Credentials (for sending SMS alerts)
    TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    TWILIO_AUTH_TOKEN=your_auth_token
    TWILIO_PHONE_NUMBER=+12345678900 # Your Twilio phone number

    # Example Trusted Contact Number for testing (replace with a real number)
    TRUSTED_CONTACT_NUMBER=+11234567890
    ```

    *   **`NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`**: Obtain this from your Mapbox account dashboard. It's used by `src/components/InteractiveMap.tsx`.
    *   **`TWILIO_ACCOUNT_SID`**, **`TWILIO_AUTH_TOKEN`**, **`TWILIO_PHONE_NUMBER`**: Obtain these from your Twilio account dashboard.
    *   **`TRUSTED_CONTACT_NUMBER`**: This is a placeholder for a recipient's phone number to test SMS alerts. In a real application, this would come from user-configured trusted contacts.

4.  **Run the development server:**

    ```bash
    npm run dev
    # or yarn dev
    # or pnpm dev
    # or bun dev
    ```

5.  **Access the application:**

    Open your browser and navigate to `http://localhost:3000`.

    You can start exploring the application:
    *   `http://localhost:3000/signup` to create a new user.
    *   `http://localhost:3000/login` to log in.
    *   `http://localhost:3000/ride/new` to create a new ride session.
    *   `http://localhost:3000/ride/live` to simulate a live ride and trigger alerts.
    *   `http://localhost:3000/dashboard` to view incident statistics (for authorities/admin).

## 📂 Project Structure

The `guardher-app` directory contains the Next.js application:

```
guardher-app/
├── public/                     # Static assets (images, icons)
├── src/
│   ├── app/                    # Next.js App Router pages and API routes
│   │   ├── api/                # Backend API routes
│   │   │   ├── incidents/      # API for managing ride incidents
│   │   │   ├── location/       # API for live location updates
│   │   │   ├── sessions/       # API for managing ride sessions
│   │   │   ├── stats/          # API for dashboard statistics
│   │   │   └── user/           # API for user authentication and management
│   │   ├── contact-view/page.tsx # Page for managing trusted contacts
│   │   ├── dashboard/page.tsx  # Dashboard for authorities/admin
│   │   ├── login/page.tsx      # User login page
│   │   ├── page.tsx            # Landing page
│   │   ├── ride/               # Ride-related pages
│   │   │   ├── live/page.tsx   # Live ride tracking and emergency triggers
│   │   │   └── new/page.tsx    # Page to create a new ride session
│   │   └── signup/page.tsx     # User signup page
│   ├── components/             # Reusable React components
│   │   └── InteractiveMap.tsx  # Component for displaying maps
│   └── lib/                    # Utility functions and state management
│       ├── sound.ts            # Sound utilities for alerts
│       └── store.ts            # Zustand store for global state management
├── .env.example                # Example environment variables
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## 🌐 API Endpoints

The following key API endpoints are available within the Next.js application:

*   **`/api/user`**: Handles user registration, login, and profile management.
*   **`/api/sessions`**: Manages ride safety sessions, including creation, updates, and retrieval.
*   **`/api/incidents`**: Processes and stores emergency incident reports.
*   **`/api/location`**: Receives and broadcasts live location updates for active sessions.
*   **`/api/stats`**: Provides aggregated data and statistics for the dashboard.

## 🤝 Contributing

We welcome contributions to the GUARDHER project! If you're interested in improving ride safety, please consider:

1.  Forking the repository.
2.  Creating a new branch (`git checkout -b feature/YourFeature`).
3.  Making your changes and ensuring tests pass.
4.  Committing your changes (`git commit -m 'Add new feature'`).
5.  Pushing to the branch (`git push origin feature/YourFeature`).
6.  Opening a Pull Request.

Please ensure your code adheres to the existing style and quality standards.

## 📄 License

This project is licensed under the MIT License.