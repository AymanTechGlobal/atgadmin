// this component is used to protect the routes that are not public
// it checks if the user is authenticated and if not, it redirects to the login page

import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
