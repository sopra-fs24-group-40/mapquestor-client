import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";


export const LoginGuard = props => {
  if (!localStorage.getItem("token")) {
    
    return <Outlet />;
  }

  return <Navigate to="/game" replace />;
};

LoginGuard.propTypes = {
  children: PropTypes.node
}

export default LoginGuard;