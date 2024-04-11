import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../helpers/api";


function JoinGame(props) {

  const [gameCode, setGameCode] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const userRef = useRef();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const doJoinGame = async () => {
    try {
      const requestBody = JSON.stringify({ gameCode });
      const response = await api.get(`/games/${gameCode}/`, requestBody);

      console.log(response);

      if (response.data.playerCount + 1 > response.data.maxPlayers) {
        setError("Game is full!");
        return;
      }

      if (response.data.gameStatus !== "LOBBY") {
        setError("Game has already started!");
        return;
      }

      navigate(`/game/${gameCode}/`);
    } catch (error) {
      setError("Error joining the game: " + (error.response?.data?.message || "Error joining the game!"));
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5 justify-content-center rounded-4 p-4 login-container">
        <h1 className="text-center fw-bold">Join Game</h1>
        <div className="form-group">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <label htmlFor="gameCode">Game Code</label>
          <input
            className="form-control"
            type="text"
            id="gameCode"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setGameCode(e.target.value)}
            required
          />
        </div>
        <hr />
        <div className="row">
          <div className="col-6">
            <button
              className="btn btn-danger" onClick={() => doJoinGame()}>Join Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinGame;