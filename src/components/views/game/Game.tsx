import React, {useEffect, useState} from "react";
import "../../../styles/views/game.scss";
import {useNavigate} from "react-router-dom";
import {api} from "../../../helpers/api";


const Game = () => {

  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [error, setError] = useState(null);
  const [activeLobbies, setActiveLobbies] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await api.get("/games");
        const games = response.data;
        const lobbies = games.map(game => ({
          gamecode: game.gameCode,
          name: `Lobby ${game.gameCode}`,
          details: `Currently ${game.playerCount}/${game.maxPlayers} Player/s in ${game.gameStatus}`,
          gamestatus: game.gameStatus
        }));
        setActiveLobbies(lobbies);
        console.log(lobbies);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    }

    fetchGames();
  }, []);

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

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUsers();
  }, []);

  const renderPlayerRow = (users) => {
  
    // Sort players by their wonGames in descending order
  
    const sortedPlayers = users.sort((a, b) => b.wonGames - a.wonGames);
   
    return sortedPlayers.map((player, index) => (
  
      <tr key={player.token}>
  
        <td className="fs-2">{index + 1}</td>
  
        <td className="fs-2">{player.username}</td>
  
        <td className="fs-2">{player.wonGames}</td>
  
      </tr>
  
    ));
  
  };
  


  // Eine Funktion, die eine Liste von aktiven Lobbies rendert
  const renderActiveLobbies = (activeLobbies) => {

    // Iteriere über alle aktiven Lobbies und rendere sie
    return activeLobbies.map(lobby => (
      <div key={lobby.gamecode} className="col-md-4 ml-4 mb-4">
        <div className="lobby p-3">
          <h3>{lobby.name}</h3>
          <p>{lobby.details}</p>
          {lobby.gamestatus === "LOBBY" && (
            <button className="join-button" onClick={() => doJoinGame(lobby.gamecode)}>Join Now</button>
          )}
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
                {/* Render player rows directly within tbody */}
                {renderPlayerRow(users)}
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
        <h2 className="p-2 mb-2 pb-0">Active Games</h2>
        <div className="row">
          {renderActiveLobbies(activeLobbies)}
        </div>
      </div>
    </div>
  );
};

export default Game;