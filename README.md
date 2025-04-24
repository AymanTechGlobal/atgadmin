# ATG Healthcare Care Plan Manager Admin Panel

A modern, responsive admin panel for managing healthcare care plans, appointments, and care navigators. Built with React, Material-UI, and Tailwind CSS.

## Features

### Care Plans Management

- View all care plans in a comprehensive table view
- Search care plans by patient name, care navigator, or plan name
- Preview care plan PDFs directly in the browser
- Download care plan documents
- Status tracking with color-coded indicators
- Date-based sorting and filtering

### Appointments Management

- View and manage all appointments
- Search appointments by ID, doctor, or patient name
- Update appointment details (date, time, status, doctor)
- Delete appointments with confirmation
- Status tracking with visual indicators
- Date and time management with proper formatting

### Care Navigators

- Manage care navigator profiles
- Track care navigator assignments
- View care navigator performance metrics

### Authentication & Security

- Secure login system
- Protected routes
- JWT-based authentication
- Secure logout functionality
- Password reset capability

## Tech Stack

### Frontend

- React.js
- Material-UI (MUI)
- Tailwind CSS
- Axios for API calls
- React Router for navigation
- Date-fns for date manipulation

### Backend Integration

- RESTful API integration
- AWS S3 for document storage
- Secure file handling
- Real-time data updates

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add the following variables:

```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

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

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm eject` - Ejects from Create React App

## Features in Detail

### Care Plans

- View all care plans in a table format
- Search functionality across multiple fields
- PDF preview in modal dialog
- Direct download capability
- Status indicators with color coding
- Date formatting and sorting

### Appointments

- Comprehensive appointment management
- Date and time picker integration
- Status management
- Search and filter capabilities
- Confirmation dialogs for important actions

### User Interface

- Responsive design
- Material UI components
- Tailwind CSS for custom styling
- Loading states and error handling
- Toast notifications for user feedback

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.



## Acknowledgments

- Material-UI for the component library
- Tailwind CSS for the utility-first CSS framework
- AWS for S3 storage integration
- All contributors who have helped shape this project
