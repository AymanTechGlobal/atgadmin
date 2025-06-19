# ATG Healthcare Care Plan Manager Admin Panel

A modern, secure, and responsive admin panel for managing healthcare care plans, appointments, and care navigators. Built with React, Material-UI, and Tailwind CSS, this project delivers a robust experience for healthcare administrators.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Features

### Care Plans Management

- View, search, and filter care plans in a comprehensive table view
- Preview care plan PDFs directly in the browser
- Download care plan documents securely
- Status tracking with color-coded indicators
- Date-based sorting and filtering
- Real-time updates for care plan changes

### Appointments Management

- View and manage all appointments
- Search and filter by ID, doctor, or patient name
- Update appointment details (date, time, status, doctor)
- Delete appointments with confirmation dialogs
- Status tracking with visual indicators
- Date and time management with proper formatting
- Real-time appointment updates

### Care Navigators

- Manage care navigator profiles
- Assign and track care navigator responsibilities
- View care navigator performance metrics and analytics
- Real-time updates for navigator assignments

### Authentication & Security

- Secure login system with JWT-based authentication
- Protected routes and secure logout functionality
- Password reset and recovery capability
- Role-based access control (RBAC)
- Security best practices throughout the codebase

### User Interface & Experience

- Responsive, mobile-friendly design
- Material UI components for a modern look
- Tailwind CSS for rapid, consistent styling
- Accessibility features (ARIA labels, keyboard navigation)
- Loading states and error handling throughout
- Toast notifications for user feedback
- Dark mode support

### Integrations & Infrastructure

- RESTful API integration for all data operations
- AWS S3 for secure document storage and retrieval
- Secure file handling and download
- Real-time data updates via API

### Testing & Quality Assurance

- Unit and integration tests for core features
- Mocking and test utilities for robust test coverage
- Error boundaries and graceful error handling

---

## Tech Stack

- **Frontend:** React.js, Material-UI (MUI), Tailwind CSS
- **State Management:** React Context API
- **API Calls:** Axios
- **Routing:** React Router
- **Date Handling:** date-fns
- **Testing:** Jest, React Testing Library
- **Infrastructure:** AWS S3, RESTful API

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. **Start the development server:**
   ```bash
   npm start
   # or
   yarn start
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   └── ProtectedRoute.jsx
│   ├── layouts/
│   │   └── Layout.jsx
│   ├── pages/
│   │   ├── Appointments.jsx
│   │   ├── CarePlans.jsx
│   │   ├── CareNavigators.jsx
│   │   ├── Dashboard.jsx
│   │   └── Login.jsx
│   ├── theme/
│   │   └── index.js
│   ├── App.js
│   └── index.js
├── package.json
├── tailwind.config.js
└── README.md
```

---

## Available Scripts

- `npm start` — Runs the app in development mode
- `npm run build` — Builds the app for production
- `npm test` — Runs the test suite
- `npm eject` — Ejects from Create React App

---

## Usage

- **Care Plans:**
  - View, search, filter, preview, and download care plans.
  - Real-time updates and status tracking.
- **Appointments:**
  - Manage appointments, update details, and track status.
  - Confirmation dialogs for critical actions.
- **Care Navigators:**
  - Manage navigator profiles and assignments.
  - View performance metrics and analytics.
- **Authentication:**
  - Secure login, logout, and password reset.
  - Role-based access and protected routes.
- **Notifications:**
  - Toast notifications for actions and errors.
- **Accessibility:**
  - Keyboard navigation and ARIA support.

---

## Contributing

We welcome contributions! To get started:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code adheres to the project's coding standards and includes relevant tests.

---

## License

This project is licensed under the ISC License.

---

## Acknowledgments

- [Material-UI](https://mui.com/) for the component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [AWS](https://aws.amazon.com/) for S3 storage integration
- All contributors who have helped shape this project
