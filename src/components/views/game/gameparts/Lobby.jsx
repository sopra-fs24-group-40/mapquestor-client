import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import countdowns from "../../../../assets/countdowns.mp3"
import { useNavigate } from "react-router-dom";
import { api } from "helpers/api";


function Lobby({startGame, onSendChat, messages, players, game, countdownDuration}) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [creator, setCreator] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [soundPlayed, setSoundPlayed] = useState(false);
  const navigate = useNavigate();
  const [gameType, setGameType] = useState(game.gameType);
  const [maxPlayers, setMaxPlayers] = useState(game.maxPlayers);
  const [roundCount, setRoundCount] = useState(game.roundCount);
  const [showEditForm, setShowEditForm] = useState(false);


  useEffect(() => {
    const isCreator = localStorage.getItem("token") === game.creator;
    setCreator(isCreator);
  }, [game.creator]);

  useEffect(() => {
    if (countdown === 3 && !soundPlayed) {
      const countdownSound = new Audio(countdowns);
      countdownSound.play()
        .then(() => setSoundPlayed(true))
        .catch(error => console.error("Fehler beim Abspielen des Sounds:", error));
    }

  }, [countdown, soundPlayed]);


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

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    onSendChat(localStorage.getItem("username"), currentMessage, "CHAT");
    setCurrentMessage("");
  };

  const handleLeaveGame = () => {
    console.log("Spiel verlassen (Logik noch zu implementieren)");
  };

  const handleStartCountdown = () => {
    onSendChat(localStorage.getItem("username"), "Has started the countdown!", "CHAT");
    setCountdown(10);
  };

  const handleUpdateGameSettings = (e) => {
    e.preventDefault();
    //api request
    console.log(`Updating game settings: Type: ${gameType}, Max Players: ${maxPlayers}, Round Count: ${roundCount}`);
    setShowEditForm(false);
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-3">
        <div className="card">
          <div className="card-header">Users in game:</div>
          <ul className="list-group list-group-flush">
            {players.map((player, index) => (
              <li
                key={index}
                className="list-group-item"
                style={{color: creator ? "red" : "inherit"}}
              >
                {player.username}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="col-md-6 p-3">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">Lobby Chat</h2>
            <hr/>
            <h4>Players: {players.length} / {game.maxPlayers}</h4>
            <div className="chat-container">
              <ul className="list-unstyled">
                {messages.map((msg, index) => (
                  <li key={index}>
                    <strong>{msg.from}</strong>: {msg.content}
                  </li>
                ))}
              </ul>
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
                  placeholder="Schreibe eine Nachricht..."
                />
                <button className="btn btn-primary" onClick={handleSendMessage}>Send</button>
              </div>
              {countdown !== null ? (
                <div className="alert alert-info mt-5" role="alert">
                  Game starts in: {countdown} Seconds...
                </div>
              ) : (
                creator && (
                  <button onClick={handleStartCountdown} className="btn btn-success mt-3">
                    Start Countdown
                  </button>
                )
              )}
              <button className="btn btn-secondary mt-3" onClick={handleLeaveGame}>Leave Game</button>
              <button 
                onClick={() => setShowEditForm(!showEditForm)} 
                className="btn btn-warning mt-3 d-flex justify-content-end" 
                disabled={!creator}>Edit</button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card">
          <div className="card-header">Game</div>
          <ul className="list-group list-group-flush p-3">
            Host: {game.creator}<br />
            Game Type: {game.gameType}<br />
            Round Count: {game.roundCount}
          </ul>
          {showEditForm ? (
          <form className="mt-3" onSubmit={handleUpdateGameSettings}>
            <div className="form-group">
              <label htmlFor="gameType">Game Type</label>
              <input
                type="text"
                className="form-control"
                id="gameType"
                value={gameType}
                onChange={(e) => setGameType(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="maxPlayers">Max Players</label>
              <input
                type="number"
                className="form-control"
                id="maxPlayers"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="roundCount">Round Count</label>
              <input
                type="number"
                className="form-control"
                id="roundCount"
                value={roundCount}
                onChange={(e) => setRoundCount(e.target.value)}
              />
              </div>
              <button type="submit" className="btn btn-primary">Update Game Settings</button>
          </form>
        ) : null}
        </div>
      </div>
    </div>
  );
}

Lobby.propTypes = {
  onSendChat: PropTypes.func.isRequired,
  startGame: PropTypes.func.isRequired,
  countdownDuration: PropTypes.any.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
  ).isRequired,
  players: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired,
      points: PropTypes.number.isRequired,
    })
  ).isRequired,
  game: PropTypes.shape({
    creator: PropTypes.string.isRequired,
    maxPlayers: PropTypes.number.isRequired,
    roundCount: PropTypes.number.isRequired,
    gameType: PropTypes.string.isRequired,
  }).isRequired,
};

export default Lobby;
