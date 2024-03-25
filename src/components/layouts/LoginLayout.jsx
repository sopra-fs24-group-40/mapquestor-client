import React from "react";
import { Outlet } from "react-router-dom";

function LoginLayout(props) {
  return (
    <div className="container">
      <Outlet />
    </div>
  );
}

export default LoginLayout;