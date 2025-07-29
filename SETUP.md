# Frontend Setup Guide

## Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
# API Configuration
REACT_APP_API_URL=https://your-backend-url.onrender.com

# For development, you can use:
# REACT_APP_API_URL=http://localhost:5000
```

## Deployment on Vercel

1. Connect your GitHub repository to Vercel
2. Set the environment variables in your Vercel dashboard
3. Set the `REACT_APP_API_URL` to your Render backend URL
4. Deploy the application

## Features Added

### Login Page Enhancements

- ✅ Remember Me checkbox functionality
- ✅ Show/Hide password toggle button
- ✅ Proper error handling and validation
- ✅ Responsive design with Material-UI

### Password Reset Flow

- ✅ Forgot Password page (`/forgot-password`)
- ✅ Reset Password page (`/reset-password`)
- ✅ Email-based password reset
- ✅ Token validation and expiration handling

### Authentication Improvements

- ✅ Session storage for temporary login
- ✅ Local storage for persistent login (remember me)
- ✅ Enhanced token management
- ✅ Automatic token validation

### Security Features

- ✅ Password visibility toggle
- ✅ Form validation
- ✅ Secure token storage
- ✅ Proper logout functionality

## Routes Added

- `/login` - Enhanced login page
- `/forgot-password` - Request password reset
- `/reset-password` - Reset password with token

## Usage

1. Users can log in with email and password
2. Check "Remember me" to stay logged in for 30 days
3. Use "Show/Hide" button to toggle password visibility
4. Click "Forgot password?" to request a reset email
5. Follow the email link to reset password
6. New password must be at least 6 characters long
