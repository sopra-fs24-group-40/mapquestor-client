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
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const fetchGamesAndUsers = async () => {
      try {
        const gamesResponse = await api.get("/games");
        const usersResponse = await api.get("/users");

        const games = gamesResponse.data;
        const lobbies = games.map(game => ({
          gamecode: game.gameCode,
          name: `Lobby ${game.gameCode}`,
          details: `Currently ${game.playerCount}/${game.maxPlayers} Player/s in ${game.gameStatus}`,
          gamestatus: game.gameStatus
        }));

        setActiveLobbies(lobbies);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGamesAndUsers();

    const intervalId = setInterval(fetchGamesAndUsers, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const doJoinGame = async (gameCode) => {
    try {

      console.log("Joining game with code", gameCode, "and token", token);

      const requestBody = JSON.stringify({gameCode, token});
      const response = await api.post(`/games/${gameCode}/join`, requestBody);

      if (response.status === 200) {
        console.log("Game joined successfully", response.data);
        localStorage.setItem("gameCode", gameCode);
        navigate(`/game/${gameCode}`);
      }

    } catch (error) {
      console.error("Error joining the game:", error.response);
      console.log(error)
      setError("Error joining the game: " + (error.response?.data?.message || "Error joining the game!"));
    }
  };

  // useEffect(() => {
  //   async function fetchUsers() {
  //     try {
  //       const response = await api.get("/users");
  //       setUsers(response.data);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }

  //   fetchUsers();
  // }, []);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const renderPlayerRow = (users) => {
    // Filter players based on searchQuery if it's not empty
    const filteredPlayers = searchQuery
      ? users.filter((player) =>
          player.username.toLowerCase().startsWith(searchQuery.toLowerCase())
        )
      : users;

    // Sort players by their wonGames in descending order
    const sortedPlayers = filteredPlayers.sort((a, b) => b.wonGames - a.wonGames);

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
                <input
                  type="text"
                  placeholder="Search by username..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}/>
              </div>
            </nav>
            <div className="leaderboard-scrollable" style={{ maxHeight: "350px", overflowY: "auto" }}>
              <table id="rankings" className="table leaderboard-results">
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
            </div>
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
      <div className="activeLobbies col-md-12 mt-5 pb-0 pt-2" style={{ maxHeight: "250px", overflowY: "auto" }}>
        <h2 className="p-2 mb-2 pb-0">Active Games</h2>
        <div className="row">
          {renderActiveLobbies(activeLobbies)}
        </div>
      </div>
    </div>
  );
};

export default Game;