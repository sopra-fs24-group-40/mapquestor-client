import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import countdowns from "../../../../assets/countdowns.mp3";
import { useNavigate } from "react-router-dom";

function Lobby({
                 startGame,
                 onSendChat,
                 messages,
                 players,
                 game,
                 countdownDuration,
                 handleLeave,
                 roundLength,
                 updateCountdown
               }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [creator, setCreator] = useState(false);
  const [soundPlayed, setSoundPlayed] = useState(false);
  const [gameType, setGameType] = useState(game.gameType);
  const [maxPlayers, setMaxPlayers] = useState(game.maxPlayers);
  const [roundCount, setRoundCount] = useState(game.roundCount);
  const chatContainerRef = useRef(null);
  const countdownRef = useRef(countdownDuration);
  const navigate = useNavigate();
  const intervalIdRef = useRef(null);

  useEffect(() => {
    const isCreator = localStorage.getItem("token") === game.creator;
    setCreator(isCreator);
  }, [game.creator]);

  useEffect(() => {
    if (countdownDuration > 0) {
      countdownRef.current = countdownDuration;
    }
  }, [countdownDuration]);

  useEffect(() => {
    if (countdownRef.current === 3 && !soundPlayed) {
      const countdownSound = new Audio(countdowns);
      countdownSound.volume = 0.1;
      countdownSound.play()
        .then(() => setSoundPlayed(true))
        .catch(error => console.error("Error playing the sound:", error));
    }

    if (countdownDuration > 0 && countdownRef.current === countdownDuration) {
      setSoundPlayed(false);
    }
  }, [countdownRef.current, countdownDuration, soundPlayed]);

  useEffect(() => {
    if (countdownRef.current > 0) {
      intervalIdRef.current = setInterval(() => {
        if (countdownRef.current > 1) {
          countdownRef.current -= 1;
          updateCountdown(countdownRef.current); // Optional: to trigger UI update
        } else {
          clearInterval(intervalIdRef.current);
          startGame();
          countdownRef.current = null;
        }
      }, 1000);
    } else if (countdownRef.current === 0) {
      clearInterval(intervalIdRef.current);
      startGame();
      countdownRef.current = null;
    }

    return () => clearInterval(intervalIdRef.current);
  }, [startGame]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    onSendChat(localStorage.getItem("username"), currentMessage, "CHAT");
    setCurrentMessage("");
  };

  const handleLeaveGame = () => {
    localStorage.removeItem("gameCode");
    if (creator) {
      onSendChat(localStorage.getItem("username"), "Left the match!", "CHAT");
      onSendChat(localStorage.getItem("token"), "Left the match!", "LEAVE_CREATOR");
      navigate("/game");
    } else {
      onSendChat(localStorage.getItem("username"), "Left the match!", "CHAT");
      onSendChat(localStorage.getItem("token"), "Left the game!", "LEAVE");
      navigate("/game");
    }
  };

  const handleStartCountdown = () => {
    onSendChat(localStorage.getItem("token"), "Has started the countdown!", "START_COUNTDOWN");
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-3 rounded">
        <div className="card">
          <div className="card-header mt-2 mx-1 h3">Users in lobby: {players.length} / {game.maxPlayers}</div>
          <div className="user-container overflow-auto" style={{ maxHeight: "250px" }}>
            <ul className="list-group list-group-flush p-3">
              {players.map((player, index) => (
                <li
                  key={index}
                  className={`list-group-item ${player.token === game.creator ? "text-danger" : ""}`}
                >
                  {player.username}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="col-md-6">
      <h2 className="card-title text-center mt-2 mx-1 h1 mb-1">Lobby {localStorage.getItem("gameCode")}</h2>
        <div className="card mb-3 mx-1 rounded-0">
          <div className="card-body">
            <h4>Chat</h4>
            <div className="chat-container overflow-auto" ref={chatContainerRef} style={{ maxHeight: "160px" }}>
              <ul className="list-unstyled">
                {messages.map((msg, index) => (
                  <li key={index}>
                    <strong>{msg.from}</strong>: {msg.content}
                  </li>
                ))}
              </ul>
            </div>
            <div className="input-group mt-3">
              <input
                type="text"
                className="form-control"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Write a message..."
              />
              <button className="btn btn-primary" onClick={handleSendMessage}>Send</button>
            </div>
            {countdownRef.current !== null ? (
              <div className="alert alert-info mt-5" role="alert">
                Game starts in: {countdownRef.current} Seconds...
              </div>
            ) : (
              creator && (
                <button
                  onClick={handleStartCountdown}
                  className="btn btn-success mt-3"
                  disabled={players.length <= 1}
                >
                  Start Countdown
                </button>
              )
            )}
            <div>
              <button className="btn btn-danger mt-3" onClick={handleLeaveGame}>Leave Game</button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3 rounded">
        <div className="card">
          <div className="card-header mt-2 mx-1 h3">Game</div>
          <ul className="list-group list-group-flush p-3">
            <li className="list-group-item">Game Mode: {game.gameType}</li>
            <li className="list-group-item">Round Count: {game.roundCount}</li>
            <li className="list-group-item">Max Players: {game.maxPlayers}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

Lobby.propTypes = {
  onSendChat: PropTypes.func.isRequired,
  startGame: PropTypes.func.isRequired,
  roundLength: PropTypes.number.isRequired,
  updateCountdown: PropTypes.func.isRequired,
  handleLeave: PropTypes.func.isRequired,
  countdownDuration: PropTypes.any,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    }),
  ).isRequired,
  players: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired,
      points: PropTypes.number.isRequired,
    }),
  ).isRequired,
  game: PropTypes.shape({
    creator: PropTypes.string,
    maxPlayers: PropTypes.number.isRequired,
    roundCount: PropTypes.number.isRequired,
    gameType: PropTypes.string.isRequired,
  }).isRequired,
};

export default Lobby;
