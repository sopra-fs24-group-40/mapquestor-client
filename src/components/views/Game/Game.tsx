import React from "react";
import "../../../styles/views/game2.scss";

const Game = () => {

  return (
    <div className="row">
      <div className="col-md-6 bg-white text-center mt-5">
        <h1>Left Side</h1>
        <div className="container-wrap">
          <section id="leaderboard">
            <nav className="ladder-nav">
              <div className="ladder-title">
                <h1>Leaderboard</h1>
              </div>
              <div className="ladder-search">
                <input type="text" id="search-leaderboard" className="live-search-box"
                       placeholder="Search Team, Player..." />
              </div>
            </nav>
            <table id="rankings" className="leaderboard-results" width="100%">
              <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Total</th>
              </tr>
              </thead>
            </table>
          </section>
        </div>
      </div>

      <div className="col-md-6 bg-white text-center mt-5">
        <h1>Right Side</h1>
        <div className="button-wrapper justify-content-center">
          <button className="individual-button">All Users</button>
        </div>
        <div className="button-wrapper">
          <button className="individual-button">Join Lobby</button>
        </div>
        <div className="button-wrapper">
          <button className="individual-button">Create Game</button>
        </div>
      </div>
    </div>
  );
};

export default Game;
