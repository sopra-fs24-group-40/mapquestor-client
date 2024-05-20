import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { api } from "helpers/api";
import PropTypes from "prop-types";


export const GameGuard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {

    if (!localStorage.getItem("token")) {
      setIsAuthenticated(false);
      navigate("/login");
      return;
    }

    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      try {
        const response = await api.post("/verify-token", { token });
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
