import React, { useState } from "react";
import { api } from "../../../helpers/api";
import { useNavigate } from "react-router-dom";

function CreateGame() {
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [roundCount, setRoundCount] = useState(2);
  const [gameType, setGameType] = useState("COUNTRY");
  const [creator, setCreator] = useState(localStorage.getItem("token"));
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
    };

    try {
      const response = await api.post("/games", gameData);
      console.log("Game created successfully", response.data);
      localStorage.setItem("gameCode", response.data.gameCode);
      localStorage.setItem("gameState", "LOBBY");
      navigate(`/game/${response.data.gameCode}`);
    } catch (error) {
      console.error("Error creating the game:", error.response);
      setError("Error creating the game: " + (error.response?.data?.message || "Error creating the game!"));
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6 p-3">
        <h1 className="text-center mb-4">Create Game</h1>
        <form onSubmit={handleSubmit} className="bg-light p-4 border rounded">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="maxPlayers" className="form-label fs-5">Max Players</label>
            <input
              type="number"
              className="form-control fs-5"
              id="maxPlayers"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(e.target.value)}
              min="2"
              max="10"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="roundCount" className="form-label fs-5">Number of Rounds</label>
            <input
              type="number"
              className="form-control fs-5"
              id="roundCount"
              value={roundCount}
              onChange={(e) => setRoundCount(e.target.value)}
              min="2"
              max="20"
            />
          </div>
          <div className="row justify-content-left mb-5">
            <div className="col-lg-6 fs-5">
              <div className="text-left">
                <label htmlFor="gameType" className="form-label fs-5">Game Mode</label>
                <div className="btn-group mb-3" role="group" aria-label="Game Type">
                  <button
                    type="button"
                    className={`btn ${gameType === "COUNTRY" ? "btn-primary" : "btn-secondary"} btn-lg rounded-3 me-2`}
                    onClick={() => setGameType("COUNTRY")}
                    style={{ background: gameType === "COUNTRY" ? "green" : "" }}
                  >
                    Country Mode
                  </button>
                  <button
                    type="button"
                    className={`btn ${gameType === "CITY" ? "btn-primary" : "btn-secondary"} btn-lg rounded-3`}
                    onClick={() => setGameType("CITY")}
                    style={{ background: gameType === "CITY" ? "green" : "" }}
                  >
                    City Mode
                  </button>
                </div>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-6">
              <button onClick={handleSubmit} type="submit" className="btn btn-primary">Create Game</button>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <button
                className="btn btn-danger" onClick={() => navigate("/game")}>Back
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGame;
