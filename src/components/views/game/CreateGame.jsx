import React, { useState } from "react";
import { api } from "../../../helpers/api";
import { useNavigate } from "react-router-dom";

function CreateGame() {
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [roundCount, setRoundCount] = useState(2);
  const [creator, setCreator] = useState(localStorage.getItem("token"));

  const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post("/games", {
        maxPlayers,
        roundCount,
        creator
      });
      console.log("Spiel erfolgreich erstellt:", response.data);
      navigate(`/game/${response.data.gameCode}`);
    } catch (error) {
      console.error("Fehler beim Erstellen des Spiels:", error.response);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h1 className="text-center mb-4">Create Game</h1>
        <form onSubmit={handleSubmit} className="bg-light p-4 border rounded">
          <div className="mb-3">
            <label htmlFor="maxPlayers" className="form-label">Max Players</label>
            <input
              type="number"
              className="form-control"
              id="maxPlayers"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(e.target.value)}
              min="2"
              max="10"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="roundCount" className="form-label">May rounds</label>
            <input
              type="number"
              className="form-control"
              id="roundCount"
              value={roundCount}
              onChange={(e) => setRoundCount(e.target.value)}
              min="2"
              max="20"
            />
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
