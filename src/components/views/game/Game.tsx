import React, {useState} from "react";
import "../../../styles/views/game.scss";
import {useNavigate} from "react-router-dom";
import {api} from "../../../helpers/api";


const Game = () => {

  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [error, setError] = useState(null);

  const doJoinGame = async (gameCode) => {
    try {

      console.log("Joining game with code", gameCode, "and token", token);

      const requestBody = JSON.stringify({gameCode, token});
      const response = await api.post(`/games/${gameCode}/join`, requestBody);

      console.log(response);

      if (response.status === 200) {
        console.log("Game joined successfully", response.data);
        navigate(`/game/${gameCode}`);
      }

    } catch (error) {
      console.error("Error joining the game:", error.response);
      console.log(error)
      setError("Error joining the game: " + (error.response?.data?.message || "Error joining the game!"));
    }
  };

  // Eine Funktion, die eine Liste von aktiven Lobbies rendert
  const renderActiveLobbies = () => {
    // Annahme: activeLobbies ist ein Array von Objekten, jedes Objekt repräsentiert eine Lobby
    const activeLobbies = [
      {id: 1, name: "Lobby 1", details: "Details zur Lobby 1"},
      {id: 2, name: "Lobby 2", details: "Details zur Lobby 2"},
      {id: 3, name: "Lobby 3", details: "Details zur Lobby 3"},
      {id: 4, name: "Lobby 4", details: "Details zur Lobby 4"},
      {id: 5, name: "Lobby 5", details: "Details zur Lobby 5"},
      {id: 6, name: "Lobby 6", details: "Details zur Lobby 6"},
      // Weitere Lobbies können hinzugefügt werden
    ];

    // Iteriere über alle aktiven Lobbies und rendere sie
    return activeLobbies.map(lobby => (
      <div key={lobby.id} className="col-md-4 ml-4 mb-4">
        <div className="lobby p-3">
          <h3>{lobby.name}</h3>
          <p>{lobby.details}</p>
          <button className="join-button" onClick={() => doJoinGame(lobby.id)}>Join Now</button>
        </div>
      </div>
    ));
  };

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
      {/* Bereich für aktive Lobbies, renderActiveLobbies wird aufgerufen */}
      <div className="activeLobbies col-md-12 mt-5 pb-0 pt-2">
        <h2 className="p-2 mb-2 pb-0">Aktive Lobbies</h2>
        <div className="row">
          {renderActiveLobbies()}
        </div>
      </div>
    </div>
  );
};

export default Game;