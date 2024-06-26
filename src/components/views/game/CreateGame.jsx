import React, { useState } from "react";
import { api } from "../../../helpers/api";
import { useNavigate } from "react-router-dom";
 
function CreateGame() {
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [roundCount, setRoundCount] = useState(2);
  const [gameType, setGameType] = useState("COUNTRY");
  const [creator, setCreator] = useState(localStorage.getItem("token"));
  const [roundLength, setRoundLength] = useState(30);
  const [error, setError] = useState("");
 
  const navigate = useNavigate();
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
 
    const gameData = {
      creator,
      maxPlayers,
      roundCount,
      gameType,
      roundLength,
    };
 
    try {
      const response = await api.post("/games", gameData);
      localStorage.setItem("gameCode", response.data.gameCode);
      localStorage.setItem("gameState", "LOBBY");
      navigate(`/game/${response.data.gameCode}`, { state: { roundLength } });
    } catch (error) {
      console.error("Error creating the game:", error.response);
      setError("Error creating the game: " + (error.response?.data?.message || "Error creating the game!"));
    }
  };
 
  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6 bg-gray rounded">
        <h1 className="text-center mt-2">Create Game</h1>
        <form onSubmit={handleSubmit} className="bg-light p-3 mb-3 mx-1">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="maxPlayers" className="form-label fs-5">Max Players</label>
            <select
              className="form-select fs-5"
              id="maxPlayers"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
            >
              <option value="2">2 players</option>
              <option value="3">3 players</option>
              <option value="4">4 players</option>
              <option value="5">5 players</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="roundCount" className="form-label fs-5">Number of Rounds</label>
            <select
              className="form-select fs-5"
              id="roundCount"
              value={roundCount}
              onChange={(e) => setRoundCount(parseInt(e.target.value))}
            >
              <option value="2">2 rounds</option>
              <option value="3">3 rounds</option>
              <option value="4">4 rounds</option>
              <option value="5">5 rounds</option>
              <option value="6">6 rounds</option>
              <option value="7">7 rounds</option>
              <option value="8">8 rounds</option>
              <option value="9">9 rounds</option>
              <option value="10">10 rounds</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="roundLength" className="form-label fs-5">Round Length (seconds)</label>
            <select
              className="form-select fs-5"
              id="roundLength"
              value={roundLength}
              onChange={(e) => setRoundLength(parseInt(e.target.value))}
            >
              <option value="30">30 seconds</option>
              <option value="60">60 seconds</option>
              <option value="90">90 seconds</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="gameType" className="form-label fs-5">Game Mode</label>
            <div className="btn-group w-100" role="group" aria-label="Game Type">
              <button
                type="button"
                className={`btn ${gameType === "COUNTRY" ? "btn-success" : "btn-secondary"} w-50`}
                style={{ height: "70px" }}
                onClick={() => setGameType("COUNTRY")}
              >
                Country Mode
              </button>
              <button
                type="button"
                className={`btn ${gameType === "CITY" ? "btn-success" : "btn-secondary"} w-50`}
                style={{ height: "70px" }}
                onClick={() => setGameType("CITY")}
              >
                City Mode
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <button type="submit" className="btn btn-primary"
              style={{ width: "175px" }}>
                Create Game</button>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-danger"
                style={{ width: "125px" }}
                onClick={() => navigate("/game")}
              >
                Back
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );


}
 
export default CreateGame;