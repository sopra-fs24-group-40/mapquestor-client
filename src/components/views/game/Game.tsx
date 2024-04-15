import React from "react";
import "../../../styles/views/game.scss";
import {useNavigate} from "react-router-dom";

const Game = () => {

  const navigate = useNavigate();

  return (
    <div className="row">
      <div className="col-md-6 text-center mt-5">
        <div className="container-wrap">
          <section id="leaderboard">
            <nav className="ladder-nav">
              <div className="ladder-title">
                <h1>Leaderboard</h1>
              </div>
              <div className="ladder-search">
                <select className="dropdown">
                  <option value="All Modes">All Modes</option>
                  <option value="City-Mode">City-Mode</option>
                  <option value="Country-Mode">Country-Mode</option>
                </select>
                <select className="dropdown">
                  <option value="All Time">All Time</option>
                  <option value="Today">Today</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                  <option value="This Year">This Year</option>
                </select>
              </div>
            </nav>
            <table id="rankings" className="leaderboard-results" width="100%">
              <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Wins</th>
              </tr>
              </thead>
              <tbody className="text-center bg-transparent">
              <tr>
                <td style={{fontSize: "2em"}}>1</td>
                <td style={{fontSize: "2em"}}>John Doe</td>
                <td style={{fontSize: "2em"}}>100</td>
              </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>

      <div className="col-md-6 bg-transparent text-center mt-5">
        <div className="button-wrapper justify-content-center">
          <button className="individual-button" onClick={() => navigate("/game/users")}>All Users</button>
        </div>
        <div className="button-wrapper">
          <button className="individual-button" onClick={() => navigate("/game/join")}>Join Lobby</button>
        </div>
        <div className="button-wrapper">
          <button className="individual-button" onClick={() => navigate("/game/create")}>Create Game</button>
        </div>
      </div>
    </div>
  );
};

export default Game;