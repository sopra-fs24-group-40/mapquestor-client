import React from "react";
import { useNavigate } from "react-router-dom";

function JoinLobby() {
    const navigate = useNavigate();

  return (
    <div className="row">
      <div className="col bg-light mt-3 border rounded">
        <h1 className="text-center p-2">Join a Lobby</h1>
        <button
        className="btn btn-danger mb-3" onClick={() => navigate("/game")}>Back
      </button>
      </div>
    </div>
  );
};

export default JoinLobby;