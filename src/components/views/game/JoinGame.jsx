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
 
  const doJoinGame = async (gameCode) => {
    try {

      const requestBody = JSON.stringify({gameCode, token});
      const response = await api.post(`/games/${gameCode}/join`, requestBody);

      if (response.status === 200) {
        localStorage.setItem("gameCode", gameCode);
        navigate(`/game/${gameCode}`);
      }

    } catch (error) {
      setError("Error joining the game: " + (error.response?.data?.message || "Error joining the game!"));
    }
  };
  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-4 bg-gray rounded">
        <h1 className="text-center mt-2">Join Game</h1>
        <div className="bg-light mx-1 mb-3 p-2">
          <div className="form-group p-2">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <label htmlFor="gameCode" className="h5">Game Code</label>
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
          <div className="row p-2">
            <div className="col-6">
            <button className="btn btn-success" style={{ width: "175px" }} onClick={() => doJoinGame(gameCode)} disabled={!gameCode}>Join Game</button>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <button className="btn btn-danger" style={{ width: "125px" }} onClick={() => navigate("/game")}>Back</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
 
export default JoinGame;