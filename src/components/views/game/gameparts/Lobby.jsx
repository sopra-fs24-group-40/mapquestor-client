import React, { useEffect, useState, useRef } from "react";
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
               }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [creator, setCreator] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [soundPlayed, setSoundPlayed] = useState(false);
  const [gameType, setGameType] = useState(game.gameType);
  const [maxPlayers, setMaxPlayers] = useState(game.maxPlayers);
  const [roundCount, setRoundCount] = useState(game.roundCount);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    const isCreator = localStorage.getItem("token") === game.creator;
    setCreator(isCreator);
  }, [game.creator]);
 
  useEffect(() => {
    if (countdownDuration > 0) {
      setCountdown(countdownDuration);
    }
  }, [countdownDuration]);
 
  useEffect(() => {
    if (countdown === 3 && !soundPlayed) {
      const countdownSound = new Audio(countdowns);
      countdownSound.volume = 0.1;
      countdownSound.play()
        .then(() => setSoundPlayed(true))
        .catch(error => console.error("Fehler beim Abspielen des Sounds:", error));
    }
 
    if (countdownDuration > 0 && countdown === countdownDuration) {
      setSoundPlayed(false);
    }
  }, [countdown, countdownDuration, soundPlayed]);
 
  useEffect(() => {
    let intervalId;
    if (countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(intervalId);
      startGame();
      setCountdown(null);
    }
    return () => clearInterval(intervalId);
  }, [countdown, startGame]);
 
  useEffect(() => {
    if (players.length === game.maxPlayers && countdown === null) {
      handleStartCountdown();
    }
  }, [players.length, game.maxPlayers, countdown]);
 
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
      <div className="col-md-3">
        <div className="card">
          <div className="card-header">Users in lobby:</div>
          <div className="user-container" style={{ maxHeight: "250px", overflowY: "auto" }}>
            <ul className="list-group list-group-flush">
              {players.map((player, index) => (
                <li
                  key={index}
                  className="list-group-item"
                  style={{ color: player.token === game.creator ? "red" : "inherit" }}
                >
                  {player.username}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="col-md-6 p-3">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">Lobby {localStorage.getItem("gameCode")}</h2>
            <hr />
            <h4>Players: {players.length} / {game.maxPlayers}</h4>
            <div className="chat-container" ref={chatContainerRef} style={{ maxHeight: "120px", overflowY: "auto" }}>
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
            {countdown !== null ? (
              <div className="alert alert-info mt-5" role="alert">
                Game starts in: {countdown} Seconds...
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
      <div className="col-md-3">
        <div className="card">
          <div className="card-header">Game</div>
          <ul className="list-group list-group-flush p-3">
            Game Type: {game.gameType}<br />
            Round Count: {game.roundCount}<br />
            Max Players: {game.maxPlayers}<br />
            {/*Round Length: {roundLength} seconds<br />*/}
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