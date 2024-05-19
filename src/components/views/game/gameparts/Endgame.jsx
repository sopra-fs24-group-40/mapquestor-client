import React, { useEffect, useState } from "react";
import "../../../../styles/views/endgame.scss";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
 
 
function Endgame({ game, onSendChat, messages, players, playAgain }) {
 
  const navigate = useNavigate();
  const [creator, setCreator] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(10);
  const [playAgainButton, setPlayAgainButton] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
 
 
  useEffect(() => {
    const isCreator = localStorage.getItem("token") === game.creator;
    setCreator(isCreator);
  }, [game.creator]);
 
  const renderPlayerRow = (players) => {
    const playerArray = Object.values(players);
 
    const sortedPlayers = playerArray.sort((a, b) => b.points - a.points);
 
    return sortedPlayers.map((player, index) => (
      <tr key={player.token}>
        <td className="fs-2">{index + 1}</td>
        <td className="fs-2">{player.username}</td>
        <td className="fs-2">{player.points}</td>
      </tr>
    ));
  };
 
  const handleLeaveGame = () => {
    localStorage.removeItem("gameCode");
    if (creator) {
      onSendChat(localStorage.getItem("username"), "Left the match!", "CHAT");
      onSendChat(localStorage.getItem("token"), "Left the match!", "LEAVE_CREATOR");
    } else {
      onSendChat(localStorage.getItem("username"), "Left the match!", "CHAT");
      onSendChat(localStorage.getItem("token"), "Left the game!", "LEAVE");
    }
  };
 
 
  const handlePlayAgain = () => {
    setButtonDisabled(true);
    setButtonClicked(true); // Set buttonClicked to true when button is clicked
    onSendChat(localStorage.getItem("token"), "Wants to play again!", "PLAY_AGAIN");
    onSendChat(localStorage.getItem("username"), "Wants to play again!", "CHAT");
    setPlayAgainButton(true);
  };
 
  useEffect(() => {
    let intervalId;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0) {
      if (!playAgainButton) {
        localStorage.removeItem("gameCode");
        handleLeaveGame();
      } else {
        playAgain();
      }
 
    }
    return () => clearInterval(intervalId);
  }, [timer, players.length]);
 
  return (
    <div className="row">
      <div className="col-md-6 text-center mt-5">
        <div className="container-wrap">
          <section id="leaderboard">
            <nav className="ladder-nav1">
              <div className="ladder-title m-1 justify-content-center text-center">
                <h1>Leaderboard</h1>
              </div>
            </nav>
            <div className="leaderboard-scrollable" style={{ maxHeight: "180px", overflowY: "auto" }}>
              <table id="rankings" className="leaderboard-results" width="100%">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody className="text-center bg-transparent">
                  {renderPlayerRow(players)}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
 
      <div className="col-md-6 bg-transparent text-center mt-5">
        <div
          className="timer-container1 mb-5">
          Timer: {timer && timer} seconds <br />
        </div>
        <div className="button-wrapper justify-content-center">
          {buttonClicked &&
            <p className="playagain-container">Please wait for the timer!  <br /> You may join if the creator decides to play again as well!</p>}
          <button className="individual-button1" onClick={() => handlePlayAgain()} disabled={buttonDisabled}>Play
            Again
          </button>
        </div>
        <div className="button-wrapper">
          <button className="individual-button2" onClick={() => {
            handleLeaveGame();
            navigate("/game");
          }}>Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
 
Endgame.propTypes =
  {
    onSendChat: PropTypes.func,
    playAgain: PropTypes.func,
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
    ),
    game: PropTypes.shape({
      gameCode: PropTypes.string.isRequired,
      playerCount: PropTypes.number.isRequired,
      creator: PropTypes.string.isRequired,
      maxPlayers: PropTypes.number.isRequired,
      roundCount: PropTypes.number.isRequired,
      gameType: PropTypes.string.isRequired,
    }),
  };
 
export default Endgame; 