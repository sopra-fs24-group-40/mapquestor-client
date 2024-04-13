import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../helpers/api";


function JoinGame(props) {

  const [gameCode, setGameCode] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const userRef = useRef();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const doJoinGame = async () => {
    try {

      console.log("Joining game with code", gameCode, "and token", token);

      const requestBody = JSON.stringify({ gameCode, token });
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
            <button className="btn btn-danger" onClick={() => doJoinGame()} disabled={!gameCode}>Join Game</button>
          </div>
          <div className="col-6 d-flex justify-content-end"> {/* This line aligns the "Back" button to the right */}
            <button className="btn btn-danger" onClick={() => navigate("/game")}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinGame;
