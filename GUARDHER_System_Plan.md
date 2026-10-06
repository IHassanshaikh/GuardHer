# GUARDHER: Comprehensive System Architecture & Implementation Plan

This document outlines the technical plan for building the **complete GUARDHER ecosystem** utilizing cutting-edge features. It covers the end-to-end architecture: from the passenger's mobile app to the emergency response dashboard and the central coordination layer.

## 1. System Ecosystem Overview

GUARDHER acts as the **coordination and decision-support layer**. The actual emergency authority remains with the authorized department, while GUARDHER provides them with instantaneous, highly detailed, preloaded intelligence.

```mermaid
graph TD
    subgraph 1. User Touchpoints
        A[Mobile App - Passenger]
        B[Wearable Integration Future]
    end

    subgraph 2. GUARDHER Core (Next.js Backend API)
        C[API Gateway & Auth]
        D[Ride & Session Intelligence]
        E[Live Tracking Engine WebSockets/SSE]
        F[AI Incident Triage & Routing Engine]
    end

    subgraph 3. External Integrations (Data In)
        G[Ride-Hailing APIs Yango, Uber]
        H[Manual Preload Data]
    end

    subgraph 4. Emergency Response (Data Out)
        I[Next.js Dispatch Dashboard]
        J[Trusted Contacts SMS/Push]
        K[Ride-Hailing Safety Team Webhooks]
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

## 2. Advanced Core Components & Features

### A. The Passenger Mobile App
*   **Purpose**: The primary interface for users to preload data and trigger emergencies.
*   **Advanced Features**:
    *   **Silent Escalation**: If "I Feel Unsafe" is triggered, prompt the user 5 minutes later. If no PIN is entered, auto-escalate to "SOS".
    *   **Offline Buffering**: If the passenger's phone loses signal, buffer the GPS points and bulk-upload them the second a connection returns.
    *   **Hardware Triggering**: Integration with physical volume/power button combinations to trigger SOS without looking at the screen.

### B. The GUARDHER Central Backend (Coordination Layer)
*   **Purpose**: The brain of the operation, handling high-volume real-time data and routing it instantly.
*   **Advanced Features**:
    *   **Off-Route Detection**: Algorithmic logic to detect if a car deviates heavily from the route to the destination.
    *   **Automated Triage Engine**: Auto-prioritizing incidents based on location risk, time of day, and deviations.
    *   **Real-time Streaming**: Maintaining active connections for moving vehicles using Server-Sent Events (SSE) or WebSockets.

### C. The Emergency Dispatch Dashboard (For Authorities)
*   **Purpose**: A secure web portal for authorized departments to view and act on incidents.
*   **Advanced Features**:
    *   **Live Geospatial Map**: Showing all active SOS alerts and historical tracking (path of the vehicle).
    *   **Instant Intelligence Packet**: One-click access to the complete preloaded data packet (Driver, Car, Plate, Passenger Info).
    *   **Actionable Dispatching**: Case management tools to assign units, mark as dispatched, or log resolutions.

## 3. Technology Stack

This stack prioritizes a unified JavaScript/TypeScript ecosystem for rapid development while utilizing local infrastructure for the current phase.

*   **Web Dashboard & Backend**: **Next.js** 
    *   *Frontend*: Next.js (App Router) for a lightning-fast, SEO-optimized, and highly responsive React dashboard for authorities.
    *   *Backend API*: Next.js API Routes / Server Actions to handle all core logic, user authentication, and data coordination.
*   **Mobile App**: **React Native (Expo)**
    *   Allows seamless integration with the Next.js backend and utilizes the same language (TypeScript), while providing deep native access to background GPS and hardware features.
*   **Database**: **Local SQL**
    *   Currently configured to run a **Local PostgreSQL** (or SQLite) database to store all relational data. 
    *   **Prisma ORM**: Will be used as the database client in Next.js to ensure strict typing and easy schema migrations.
*   **Real-time Tracking**: **Socket.io** or **Pusher** (integrated into the Next.js backend for low-latency GPS streaming).

## 4. Full System Data Models (Local SQL via Prisma)

*   **User/Passenger**: `id`, `name`, `phone`, `emergency_pin`, `medical_info`
*   **TrustedContact**: `id`, `userId`, `contactName`, `phoneNumber`, `relationship`
*   **RideSession**: `id`, `userId`, `status`, `platformId`, `driverData`, `vehicleData`, `pickupGeo`, `destinationGeo`, `startTime`
*   **LocationPing**: `id`, `sessionId`, `latitude`, `longitude`, `timestamp`, `speed`, `heading`
*   **IncidentCase**: `id`, `sessionId`, `alertLevel`, `triggerTime`, `assignedDispatcherId`, `resolutionStatus`, `resolutionNotes`
*   **Dispatcher (Authority)**: `id`, `departmentId`, `name`, `clearanceLevel`

## 5. End-to-End Implementation Roadmap

### Phase 1: Local SQL Setup & Next.js Foundation (Weeks 1-4)
*   *Focus: Infrastructure & Preloading*
*   Initialize Next.js project with Prisma ORM and local SQL database.
*   Build the React Native mobile app with Auth, Trusted Contacts, and manual Ride Preloading.
*   Create Next.js API routes to receive and store ride sessions.

### Phase 2: The Next.js Dispatch Dashboard & Live Tracking (Weeks 5-8)
*   *Focus: The Authority Experience & Real-time Data*
*   Build the secure Next.js Web Dashboard for emergency departments.
*   Implement real-time WebSockets/SSE for true real-time location streaming on the dispatcher map.
*   Generate the full "Incident Case" packet upon SOS trigger and route it directly to the dashboard.

### Phase 3: Advanced Intelligence & Escalation (Weeks 9-12)
*   *Focus: Automation and Reliability*
*   **Off-Route Detection**: Implement logic to detect if a car deviates heavily from the route.
*   **Silent Escalation**: Build the timeout logic for auto-escalating "I Feel Unsafe" to "SOS".
*   **Offline Buffering**: Implement local storage queuing in React Native for offline GPS points.

### Phase 4: Platform Integrations (Weeks 13-16)
*   *Focus: Ecosystem Expansion*
*   Develop the external API specification in Next.js for Ride-Hailing companies.
*   Allow partners to push ride data directly into GUARDHER.
*   Formalize the API documentation for police CAD (Computer-Aided Dispatch) integrations.
