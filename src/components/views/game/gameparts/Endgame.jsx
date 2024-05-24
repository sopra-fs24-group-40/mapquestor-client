import React, { useEffect, useState, useRef } from "react";
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
    console.log("Handle leave triggered")
    if (game.creator === localStorage.getItem("token")) {
      console.log("Creator left the game!")
      onSendChat(localStorage.getItem("username"), "Left the match!", "CHAT");
      onSendChat(localStorage.getItem("token"), "Left the match!", "LEAVE_CREATOR");
    } else {
      onSendChat(localStorage.getItem("username"), "Left the match!", "CHAT");
      onSendChat(localStorage.getItem("token"), "Left the game!", "LEAVE");
    }
  };

  const handlePlayAgain = () => {
    setButtonDisabled(true);
    setButtonClicked(true);
    localStorage.setItem("playAgain", true);
    onSendChat(localStorage.getItem("token"), "Wants to play again!", "PLAY_AGAIN");
    onSendChat(localStorage.getItem("username"), "Wants to play again!", "CHAT");
    setPlayAgainButton(true);
  };


  const timerReachedZero = useRef(false);

  useEffect(() => {
    let intervalId;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [timer]);

  useEffect(() => {
    if (timer === 0) {
      timerReachedZero.current = true;
    }
  }, [timer]);

  useEffect(() => {
    if (timerReachedZero.current) {
      if(!localStorage.getItem("playAgain")) {
        handleLeaveGame();
        return;
      }
      if (!playAgainButton) {
        handleLeaveGame();
      } else {
        playAgain();
      }
    }
  }, [timerReachedZero.current, playAgainButton]);


  return (
    <div className="row">
      <div className="col-md-6 mt-5 bg-gray rounded">
        <div className="container-wrap">
          <section id="leaderboard">
            <div className="d-flex justify-content-between align-items-center mt-2 mx-1">
              <h1>Leaderboard</h1>
            </div>
          </section>
        </div>
        <div className="header bg-light p-1 mx-1">
          <div className="row fs-3 text-center">
            <div className="col">Rank</div>
            <div className="col">Name</div>
            <div className="col">Points</div>
          </div>
        </div>
        <div className="table-responsive mb-3 mx-1" style={{ maxHeight: "350px", overflowY: "auto" }}>
          <table id="rankings" className="table table-striped table-hover">
            <tbody className="text-center">
            {renderPlayerRow(players)}
            </tbody>
          </table>
        </div>
      </div>
      <div className="col-md-6 bg-transparent text-center mt-5">
        <div className="bg-gray mx-2 rounded-2 p-2 mb-5">
          <div className="h2">One More Game? <span className = "fw-bolder">{timer} seconds </span></div>
        </div>
        <div className="button-wrapper justify-content-center">
          {buttonClicked &&
            <p className="bg-gray mx-2 rounded-2 p-2 mb-4 h4">Please wait for the timer! <br /> You may join if the creator decides to
              play again as well!</p>}
          <div className="d-flex justify-content-center">
            <button className="btn btn-success fs-3 rounded mx-2" onClick={() => handlePlayAgain()} disabled={buttonDisabled}>Play Again</button>
            <button className="btn btn-danger fs-3 rounded mx-2" onClick={() => {
              handleLeaveGame();
              navigate("/game");
            }}>Main Menu</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Endgame.propTypes = {
  onSendChat: PropTypes.func,
  playAgain: PropTypes.func,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.string,
      content: PropTypes.string,
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

