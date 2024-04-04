import React from "react";
import { Outlet } from "react-router-dom";
import "../../styles/views/login.scss";
import image from "../../assets/logo.png";

function GameLayout(props) {
  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col bg-white text-center">
          <h1>MapQuestor</h1>
          <img src={image} width="100"/>
          <button>Create Game</button>
        </div>
    </div>
      <Outlet />
    </div>
  );
}

export default GameLayout;