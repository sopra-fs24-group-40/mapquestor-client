import React from "react";
import { Outlet } from "react-router-dom";

function GameLayout(props) {
  return (
    <div className="container">
      <Outlet />
    </div>
  );
}

export default GameLayout;