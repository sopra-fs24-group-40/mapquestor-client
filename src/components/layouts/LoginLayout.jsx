import React from "react";
import { Outlet } from "react-router-dom";
import "../../styles/views/login.scss";
import image from "../../assets/logo.png";

function LoginLayout(props) {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-3 text-white p-5 text-start d-flex align-items-start">
          <img src={image} width="175" />
        </div>
        <div className="col-md-3 text-black p-5 text-end d-flex align-items-end">
          <h1 className="fw-bold">MapQuestor</h1>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default LoginLayout;