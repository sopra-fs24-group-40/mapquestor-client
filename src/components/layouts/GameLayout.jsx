import React from "react";
import { Outlet } from "react-router-dom";
import "../../styles/views/game.scss";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.png";

function GameLayout(props) {
  return (
    <div className="container-fluid">
      <div className="container-header row justify-content-center">
        <div className="col">
          <div className="row align-items-center container-logoAndText">
            <div className="col-auto">
              <img src={logo} width={100}/>
            </div>
            <div className="container-mapquestor col-6">
            <h1>MapQuestor</h1>
            </div>
          </div>
        </div>
        <div className="col d-flex justify-content-end align-items-center">
        <div className="container-search-bar col-auto p-3">
              <p>Search other Users</p>
              <label htmlFor="site-search"></label>
              <input type="search" id="site-search" name="q"/>
              <button>Search</button>
            </div>
            <div className="col-auto p-3">
              <figure className="container-avatar">
                <img src={avatar} width={50}/></figure>
              <button>My Profile</button>
            </div>
            <div className="col-auto">
              <button className="btn btn-danger">Logout</button>
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