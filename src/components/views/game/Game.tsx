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
          details: `${game.playerCount}/${game.maxPlayers} MapQuestor/s in ${game.gameStatus}`,
          gamestatus: game.gameStatus,
          currentPlayers: game.playerCount,
          maxPlayers: game.maxPlayers
        }));

        setActiveLobbies(lobbies);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGamesAndUsers();

    const intervalId = setInterval(fetchGamesAndUsers, 5000);

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

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const renderPlayerRow = (users) => {
    const filteredPlayers = searchQuery
      ? users.filter((player) =>
        player.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : users;

    const sortedPlayers = filteredPlayers.sort((a, b) => b.wonGames - a.wonGames);

    return sortedPlayers.map((player, index) => (
      <tr key={player.username}>
        <td className="fs-2">{index + 1}</td>
        <td className="fs-2">{player.username}</td>
        <td className="fs-2">{player.wonGames}</td>
      </tr>
    ));
  };
  const renderActiveLobbies = (activeLobbies) => {


    return activeLobbies.map(lobby => (
      <div key={lobby.gamecode} className="col-md-4 ml-4 mb-4">
        <div className="lobby p-3">
          <h3>{lobby.name}</h3>
          <p>{lobby.details}</p>
          {lobby.gamestatus === "LOBBY" && (
            <button
              className="btn btn-primary join-button"
              disabled={lobby.currentPlayers === lobby.maxPlayers}
              onClick={() => doJoinGame(lobby.gamecode)}>Join</button>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="row">
      <div className="col-md-6 mt-5 bg-gray rounded">
        <div className="container-wrap">
          <section id="leaderboard">
            <div className="d-flex justify-content-between align-items-center mt-2 mx-1">
              <h1>Leaderboard</h1>
              <input
                className="form-control" style={{ width: "200px" }}
                type="text"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
            </div>
          </section>
        </div>
        <div className="header bg-light p-2 mx-1">
          <div className="row fs-3 text-center">
            <div className="col">Rank</div>
            <div className="col">Name</div>
            <div className="col">Wins</div>
          </div>
        </div>
        <div className="table-responsive mb-3 mx-1" style={{ maxHeight: "350px", overflowY: "auto" }}>
          <table id="rankings" className="table table-striped table-hover">
            <tbody className="text-center">
            {renderPlayerRow(users)}
            </tbody>
          </table>
        </div>
      </div>
      <div className="col-md-6 bg-transparent text-center mt-5">
        <h1 className="mt-2 fw-bolder">Welcome {localStorage.getItem("username")}!</h1>
        <div className="d-grid gap-2 d-md-block mt-4">
          <div className="mb-4">
            <button className="btn btn-success fs-3 rounded" style={{ width: "200px", height: "90px" }} onClick={() => navigate("/game/users")}>All Users</button>
          </div>
          <div className="mb-4">
            <button className="btn btn-success fs-3 rounded" style={{ width: "200px", height: "90px" }} onClick={() => navigate("/game/join")}>Join Lobby</button>
          </div>
          <div>
            <button className="btn btn-success fs-3 rounded" style={{ width: "200px", height: "90px" }} onClick={() => navigate("/game/create")}>Create Game</button>
          </div>
        </div>
      </div>
      <div className="col-md-12 bg-gray mt-5 rounded">
        <h1 className="mt-2 mx-1 ">Active Games</h1>
        <div className="row bg-light mb-3 mx-1" style={{ maxHeight: "180px", overflowY: "auto" }}>
          {renderActiveLobbies(activeLobbies)}
        </div>
      </div>
    </div>
  );

};

export default Game;
