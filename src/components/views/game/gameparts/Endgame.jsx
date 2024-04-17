import React, {useEffect, useState} from "react";
import "../../../../styles/views/endgame.scss";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";


function Endgame({game , players}) {

  const navigate = useNavigate();
  const [creator, setCreator] = useState(false);


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


  const handlePlayAgain =  () => {
    if (creator) {
      console.log("Creator is playing again, redirecting to create game");
      navigate(`/game/${game.gameCode}`);
    } else {
      if (game.playerCount < game.maxPlayers) {
        console.log("Game is not full, redirecting to join game");
        navigate(`/game/join/${game.gameCode}`);
      } else {
        console.log("Game is full, redirecting to game");
        navigate("/game");
      }
    }
  }
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
          </section>
        </div>
      </div>

      <div className="col-md-6 bg-transparent text-center mt-5">
        <div className="button-wrapper justify-content-center">
          <p className="mb-0">{}/{game.playerCount} want to play again</p>
          <button className="individual-button1" onClick={() => handlePlayAgain()}>Play Again</button>
        </div>
        <div className="button-wrapper">
          <button className="individual-button2" onClick={() => navigate("/game")}>Main Menu</button>
        </div>
      </div>
    </div>
  );
}

Endgame.propTypes =
  {
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