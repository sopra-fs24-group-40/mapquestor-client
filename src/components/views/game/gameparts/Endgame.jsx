import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import "../../../../styles/views/endgame.scss";
import {useNavigate} from "react-router-dom";
import {api} from "../../../../helpers/api";

function Endgame(props) {


  const navigate = useNavigate();
  /*  const [creator, setCreator] = useState(false);

    useEffect(() => {
      const isCreator = localStorage.getItem("token") === game.creator;
      setCreator(isCreator);
    }, [game.creator]);*/

  const renderPlayerRow = (player) => {
    return (
      <tr key={player.id}>
        <td className="fs-2">{player.rank}</td>
        <td className="fs-2">{player.name}</td>
        <td className="fs-2">{player.total}</td>
      </tr>
    );
  };

  const handlePlayAgain = async () => {
    try {
      const response = await api.get(`/games/${gameCode}`);
      console.log("Gamecode pulled successfully", response.data);
      navigate(`/game/${response.data.gameCode}`)
    } catch (error) {
      console.error("Error pulling gamecode:", error.response);
      setError("Error pulling gamecode: " + (error.response?.data?.message || "Error creating the game!"));
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
              {renderPlayerRow({id: 1, rank: 1, name: "John Doe", total: 100})}
              </tbody>
            </table>
          </section>
        </div>
      </div>

      <div className="col-md-6 bg-transparent text-center mt-5">
        <div className="button-wrapper justify-content-center">
          <p className="mb-0">{}want to play again</p>
          <button className="individual-button1" onClick={() => handlePlayAgain()}>Play Again</button>
        </div>
        <div className="button-wrapper">
          <button className="individual-button2" onClick={() => navigate("/game")}>Main Menu</button>
        </div>
      </div>
    </div>
  );
}

/*
Endgame.defaultProps = {
  game: {
    creator: false
  },
};
*/
export default Endgame;