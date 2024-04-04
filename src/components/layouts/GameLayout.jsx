import React from "react";
import { Outlet } from "react-router-dom";
import "../../styles/views/game.scss";
import image from "../../assets/logo.png";

function GameLayout(props) {
  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-0">
          <div className="row align-items-center">
            <div className="col-auto">
              <img src={image} width={100}/>
            </div>
            <div className="container-mapquestor col-6">
            <h1>MapQuestor</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
}

export default GameLayout;