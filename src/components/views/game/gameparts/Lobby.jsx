import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function Lobby({ startGame, onSendChat, messages, users, game }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [creator, setCreator] = useState(false);

  useEffect(() => {
    const isCreator = localStorage.getItem("token") === game.creator;
    setCreator(isCreator);
  }, [game.creator]);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    onSendChat(localStorage.getItem("token"), currentMessage, "CHAT");
    setCurrentMessage("");
  };

  const handleLeaveGame = () => {
    console.log("Spiel verlassen (Logik noch zu implementieren)");
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-3">
        <div className="card">
          <div className="card-header">Users in game:</div>
          <ul className="list-group list-group-flush">
            {users.map((user, index) => (
              <li
                key={index}
                className="list-group-item"
                style={{ color: creator ? "red" : "inherit" }}
              >
                {user}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">Lobby Chat</h2>
            <hr />
            <h4>Players: {users.length} / {game.maxPlayers}</h4>
            <div className="chat-container">
              <ul className="list-unstyled">
                {messages.map((msg, index) => (
                  <li key={index}>
                    <strong>{msg.from}</strong>: {msg.text}
                  </li>
                ))}
              </ul>
              <div className="input-group mt-3">
                <input
                  type="text"
                  className="form-control"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Schreibe eine Nachricht..."
                />
                <button className="btn btn-primary" onClick={handleSendMessage}>Senden</button>
              </div>
              {creator && (
                <button onClick={startGame} className="btn btn-success mt-3">Spiel starten</button>
              )}
              <button className="btn btn-secondary mt-3" onClick={handleLeaveGame}>Spiel verlassen</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Lobby.propTypes = {
  onSendChat: PropTypes.func.isRequired,
  startGame: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  users: PropTypes.arrayOf(PropTypes.string).isRequired,
  game: PropTypes.shape({
    creator: PropTypes.string.isRequired,
    maxPlayers: PropTypes.number.isRequired,
  }).isRequired,
};

export default Lobby;
