import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import countdowns from "../../../../assets/countdowns.mp3"


function Lobby({startGame, onSendChat, messages, players, game, countdownDuration}) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [creator, setCreator] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [soundPlayed, setSoundPlayed] = useState(false);


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

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    onSendChat(localStorage.getItem("username"), currentMessage, "CHAT");
    setCurrentMessage("");
  };

  const handleLeaveGame = () => {
    console.log("Spiel verlassen (Logik noch zu implementieren)");
  };

  const handleStartCountdown = () => {
    onSendChat(localStorage.getItem("token"), "Has started the countdown!", "START_COUNTDOWN");
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
                      e.preventDefault(); // Prevent the default behavior of the Enter key (submitting the form)
                      handleSendMessage();
                    }
                  }}
                  placeholder="Schreibe eine Nachricht..."
                />
                <button className="btn btn-primary" onClick={handleSendMessage}>Senden</button>
              </div>
              {countdown !== null ? (
                <div className="alert alert-info mt-5" role="alert">
                  Game starts in: {countdown} Seconds...
                </div>
              ) : (
                creator && (
                  <button onClick={handleStartCountdown} className="btn btn-success mt-3">
                    Countdown starten
                  </button>
                )
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
  }).isRequired,
};

export default Lobby;
