import React, { useState } from "react";
import PropTypes from "prop-types";

function Lobby({ onSendChat, messages, users }) {
  const [currentMessage, setCurrentMessage] = useState("");

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    onSendChat(localStorage.getItem("username"), currentMessage, "CHAT");
    setCurrentMessage("");
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-3">
        <div className="card">
          <div className="card-header">Users in game:</div>
          <ul className="list-group list-group-flush">
            {users && users.map((user, index) => (
              <li key={index} className="list-group-item">{user}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">Lobby Chat</h2>
            <hr />
            <div className="chat-container">
              <ul className="list-unstyled">
                {messages && messages.map((msg, index) => (
                  <li key={index}>
                    <strong>{msg.from}</strong>: {msg.text} {msg.type}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Lobby.propTypes = {
  onSendChat: PropTypes.func,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.string,
      text: PropTypes.string,
    }),
  ).isRequired,
  users: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Lobby;
