// InGame.js
import React, { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { getRandomCountry } from "../../../../assets/cities";
import PropTypes from "prop-types";
import { api } from "helpers/api";

const InGame = ({ round, onSendChat, messagesGame, players, game, updatePlayers }) => {
  const [timer, setTimer] = useState(60);
  const [location, setLocation] = useState(getRandomCountry());
  const [currentMessage, setCurrentMessage] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);

  // Function to update the leaderboard
  const updateLeaderboard = () => {
    const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
    setLeaderboard(sortedPlayers);
  };

  // Update leaderboard when players change
  useEffect(() => {
    updateLeaderboard();
  }, [players]);

  const handleSendMessageInGame = () => {
    if (!currentMessage.trim()) return;

    if (location) {
      const cityName = location.name;
      if (currentMessage.toLowerCase() === cityName.toLowerCase()) {
        const points = timer;
        onSendChat(localStorage.getItem("username"), "Guessed the correct answer!", "CHAT_INGAME");
        addPoints(points);
      } else {
        onSendChat(localStorage.getItem("username"), currentMessage, "CHAT_INGAME");
      }
    }

    setCurrentMessage("");
  };

  const addPoints = (points) => {
    const updatedPlayers = players.map(player => {
      if (player.username === localStorage.getItem("username")) {
        return {
          ...player,
          points: player.points + points
        };
      } else {
        return player;
      }
    });
    updatePlayers(updatedPlayers);
  };
  
  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      const newLocation = getRandomCountry();
      setLocation(newLocation); // Setze zuerst den neuen Standort

      const apiOptions = {
        apiKey: "AIzaSyDKZd3AoAgVQyvXXGptbGAnpmBBzLbXG0A",
      };

      const loader = new Loader(apiOptions);
      try {
        await loader.load();
        const streetView = new google.maps.StreetViewPanorama(
          document.getElementById("street-view"), {
            position: { lat: newLocation.latitude, lng: newLocation.longitude },
            pov: { heading: 165, pitch: 0 },
            zoom: 1,
          },
        );
        streetView.setOptions({
          disableDefaultUI: true,
          navigationControl: true,
          navigationControlOptions: {
            enableArrowKeys: true,
          },
        });
      } catch (error) {
        console.error("Error loading Google Maps API:", error);
      }
    };

    if (isMounted) {
      initializeMap();
    }

    const intervalId = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(intervalId);
          return 0;
        }
      });
    }, 1000);

    // Cleanup function
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [round]);

  const cityName = location.name;
  const numLetters = location.name.length;

  const hintLines = Array.from({ length: numLetters }, (_, index) => (
    <div
      key={index}
      className="hint-line"
      style={{
        width: "20px",
        height: "1px",
        backgroundColor: "black",
        margin: "10px 5px",
      }}
    >
    </div>
  ));

  return (
    <div className="row mt-5">
      <div className="col-md-3 text-center">
        <div className="container-wrap bg-gray">
          <section id="leaderboard">
            <nav className="ladder-nav">
              <div className="ladder-title text-center">
                <h1 style={{ fontSize: "22px" }}>Leaderboard</h1>
              </div>
            </nav>
            <table
              id="rankings"
              className="leaderboard-results"
              width="100%"
            >
              <thead>
              <tr>
                <th className="text-dark">Name</th>
                <th className="text-dark">Points</th>
              </tr>
              </thead>
              <tbody>
              {leaderboard.map((player, index) => (
                <tr key={index}>
                  <td>{player.username}</td>
                  <td>{player.points}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </section>
          <h1>{cityName}</h1>
        </div>
      </div>

      <div className="col-md-6 justify-content-center text-center bg-gray">
        <h1>In Game</h1>

        <div
          className="timer-container"
          style={{ position: "absolute" }}
        >
          Timer: {timer} seconds
        </div>

        {/* Display the hint lines */}
        <div
          className="hint-lines-container"
          style={{ display: "flex", justifyContent: "center" }}
        >
          {hintLines}
        </div>

        {/* Display the Street View */}
        <div id="street-view" style={{ width: "100%", height: "350px" }}></div>

        <div className="button-wrapper">
          <button className="individual-button" style={{ fontSize: "20px" }}>
            Delay Joker
          </button>
          <button className="individual-button" style={{ fontSize: "20px" }}>
            Hint remove Joker
          </button>
        </div>
      </div>

      <div className="col-md-3 text-center">
        <div className="container-wrap bg-gray">
          <section id="chat" className="">
            <nav className="ladder-nav">
              <div className="ladder-title">
                <h1 style={{ fontSize: "22px" }}>Chat</h1>
              </div>
            </nav>
          </section>
          <div className="chat-container text-start p-2">
            <ul className="list-unstyled">
              {messagesGame.map((msg, index) => (
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
                    handleSendMessageInGame();
                  }
                }}
                placeholder="Schreibe eine Nachricht..."
              />
              <button className="btn btn-primary" onClick={handleSendMessageInGame}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

InGame.propTypes = {
  round: PropTypes.number.isRequired,
  onSendChat: PropTypes.func.isRequired,
  messagesGame: PropTypes.arrayOf(
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
    creator: PropTypes.string.isRequired,
    maxPlayers: PropTypes.number.isRequired,
    roundCount: PropTypes.number.isRequired,
    gameType: PropTypes.string.isRequired,
  }).isRequired,
  updatePlayers: PropTypes.func.isRequired, 
};

export default InGame;
