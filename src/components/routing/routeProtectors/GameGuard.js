import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { api } from "helpers/api";
import PropTypes from "prop-types";


export const GameGuard = props => {
  if (localStorage.getItem("token")) {
    
    return <Outlet />;
  }
  
  return <Navigate to="/login" replace />;
};

GameGuard.propTypes = {
  children: PropTypes.node
}

export default GameGuard;