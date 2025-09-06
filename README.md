# Parking Reservation System - Frontend

A modern, real-time parking management system built with Next.js, featuring gate check-ins, checkpoint checkouts, and comprehensive admin controls.

## 🚀 Features

### Gate Management
- **Real-time Zone Monitoring**: Live updates via WebSocket for zone availability and occupancy
- **Dual Check-in Flows**: Separate interfaces for visitors and subscribers
- **Smart Zone Selection**: Dynamic availability based on zone capacity and status
- **Instant Ticket Generation**: Printable tickets with QR codes and gate automation

### Checkpoint Operations
- **Employee Authentication**: Secure login system for checkpoint staff
- **Ticket Scanning**: QR code simulation for quick ticket processing
- **Dynamic Pricing**: Real-time rate calculation with breakdown display
- **Subscriber Verification**: Vehicle plate matching with conversion options

### Admin Dashboard
- **Live Parking State**: Real-time overview of all zones and occupancy
- **Employee Management**: Create and manage staff accounts
- **Rate Control**: Dynamic pricing and category management
- **Rush Hour & Vacation Management**: Flexible scheduling system
- **Live Audit Log**: Real-time activity monitoring with filtering

## 🛠️ Tech Stack

- **Framework**: Next.js 15 
- **State Management**: Zustand with persistence
- **Data Fetching**: Native fetch with tanstack react query
- **Real-time**: WebSocket API
- **Styling**: Tailwind CSS with custom components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## 📋 Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Backend server running on `http://localhost:3000`

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone git@github.com:abdelbassetbenatmani/parking-reservations-system-task.git
   cd parking-reservations-system-task
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard pages
│   ├── checkpoint/        # Checkout interface
│   ├── gate/[gateId]/    # Gate-specific pages
│   └── login/            # Authentication
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── AddRushHour.tsx   # Rush hour scheduling form
│   ├── AddVacation.tsx   # Vacation period management
│   ├── AdminAuditLog.tsx # Real-time audit logging
│   ├── AdminControlPanel.tsx # Zone and rate controls
│   ├── AdminEmployees.tsx # Employee management
│   ├── AdminNavigation.tsx # Admin sidebar navigation
│   ├── AdminParkingState.tsx # Live parking overview
│   ├── CheckoutBreakdown.tsx # Pricing breakdown display
│   ├── CheckpointCheckoutPanel.tsx # Ticket checkout interface
│   ├── GateCard.tsx      # Gate selection card
│   ├── GateHeader.tsx    # Gate interface header
│   ├── GatesSection.tsx  # Main gate grid display
│   ├── HeroSection.tsx   # Landing page hero
│   ├── login-form.tsx    # Authentication form
│   ├── PageWrapper.tsx   # Layout wrapper component
│   ├── SubscriptionCarList.tsx # Subscriber vehicle list
│   ├── TicketModal.tsx   # Ticket generation modal
│   ├── UpdateCategoryRates.tsx # Rate management form
│   └── ZoneCard.tsx      # Zone status display
├── services/             # API and utilities
│   ├── api.ts           # API endpoints
│   └── types.ts         # TypeScript definitions
└── store/               # State management
    ├── store.ts         # Main gate store
    └──
```

## 🎮 Usage Guide

### 1. Getting Started

**Access the main dashboard:**
- Navigate to `/` to see all available gates
- Choose a gate to begin check-in operations

### 2. Gate Operations (`/gate/gate_1`)

**For Visitors:**
1. Select the "Visitor" tab
2. Choose an available zone (green indicators)
3. Click "Check In" to generate a ticket
4. Print the ticket for the customer

**For Subscribers:**
1. Select the "Subscriber" tab  
2. Enter the subscription ID
3. Verify subscription status
4. Select appropriate zone
5. Complete check-in process

### 3. Checkpoint Operations (`/checkpoint`)

**Employee Login:**
- Username: `emp_alice` or `emp_bob`
- Password: `password123`

**Processing Tickets:**
1. Scan or enter ticket ID
2. Review pricing breakdown
3. For subscribers: verify vehicle plates
4. Complete checkout or convert to visitor rate

### 4. Admin Dashboard (`/admin`)

**Admin Login:**
- Username: `admin`
- Password: `admin123`

**Available Functions:**
- **Control Panel** (`/admin/control-panel`): Manage zones, rates, schedules
- **Employees** (`/admin/employees`): Staff account management  
- **Parking State** (`/admin/parking-state`): Live system overview

## 🔄 Real-time Features

### WebSocket Integration
- **Automatic Connection**: Connects to `ws://localhost:3000/api/v1/ws`
- **Zone Updates**: Live occupancy and availability changes
- **Admin Notifications**: Real-time audit logging
- **Connection Status**: Visual indicators for connection health

### Live Updates
- Zone cards update instantly on check-ins/checkouts
- Admin actions broadcast to all connected clients
- Pricing changes reflect immediately across all interfaces

## 🧪 Testing

### Manual Verification Steps

1. **Test Check-in Flow:**
   ```bash
   # Start backend server first
   # Navigate to /gate/gate_1
   # Perform visitor check-in
   # Verify WebSocket zone updates
   ```

2. **Test Real-time Updates:**
   ```bash
   # Open multiple browser tabs
   # Perform actions in one tab
   # Verify updates appear in other tabs
   ```

3. **Test Admin Functions:**
   ```bash
   # Login as admin
   # Change zone settings
   # Verify updates in gate interface
   ```


## 🎯 Key Implementation Decisions

### State Management
- **Zustand**: Chosen for simplicity and performance
- **Local State**: Components manage their own loading/error states
- **Persistence**: Admin authentication persisted across sessions

### UI/UX Approach
- **Mobile-first**: Responsive design for all screen sizes
- **Loading States**: Clear feedback for all async operations
- **Error Boundaries**: Graceful handling of runtime errors
- **Accessibility**: Keyboard navigation and screen reader support


---

**Note**: This frontend application requires the backend server to be running on `http://localhost:3000`. Make sure to start the backend before running the frontend application.