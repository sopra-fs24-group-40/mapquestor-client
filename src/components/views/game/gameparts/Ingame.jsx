import React, { useEffect, useState, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import PropTypes from "prop-types";
import config from "../../../../helpers/config";
 
const InGame = ({
                  round,
                  onSendChat,
                  messagesGame,
                  players,
                  game,
                  updatePlayers,
                  updateRound,
                  correctGuesses,
                  roundLength,
                  jokerGame,
                }) => {
  const [timer, setTimer] = useState(roundLength);
  const [location, setLocation] = useState(game.cities[round - 1]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [pointsAssigned, setPointsAssigned] = useState(false);
  const [delayJoker, setdelayJoker] = useState(false);
  const [hintRemoveJoker, sethintRemoveJoker] = useState(false);
  const [revealedLetters, setRevealedLetters] = useState(0);
  const [blackoutMap, setBlackoutMap] = useState(1);
  const chatContainerRef = useRef(null);
  const [safe, setSafe] = useState(false);
 
 
  const solution = game.gameType === "CITY" ? location.capital : location.name;
 
  const updateLeaderboard = () => {
    const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
    setLeaderboard(sortedPlayers);
  };
 
  useEffect(() => {
    updateLeaderboard();
  }, [players]);
 
  useEffect(() => {
    if (players.length <=1) {
      onSendChat(localStorage.getItem("token"), "", "LEAVE_CREATOR");
    }
  }, [players]);
 
 
  useEffect(() => {
    let intervalId;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(intervalId);
      setTimer(roundLength);
      setPointsAssigned(false);
      updateRound(round + 1);
    }
    return () => clearInterval(intervalId);
  }, [timer, players.length]);
 
  useEffect(() => {
    if (timer % 10 === 0 && timer !== 0) {
      setRevealedLetters(prev => prev + 1);
    }
  }, [timer]);
 
  useEffect(() => {
    setRevealedLetters(0);
    setBlackoutMap(1);
    setSafe(false);
  }, [round]);
 
  useEffect(() => {
    if (correctGuesses === players.length) {
      updateRound(round + 1);
      setTimer(roundLength);
      setPointsAssigned(false);
    }
  }, [correctGuesses, players.length]);
 
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messagesGame]);
 
  const handleSendMessageInGame = () => {
    if (!currentMessage.trim()) return;
 
    if (currentMessage === "/test") {
      onSendChat(localStorage.getItem("username"), currentMessage, "JS");
 
      return;
    }
 
    if (location && !pointsAssigned) {
      const cityName = solution;
      if (currentMessage.toLowerCase() === cityName.toLowerCase()) {
        addPoints(timer);
        setPointsAssigned(true);
        onSendChat(localStorage.getItem("username"), "Guessed the correct answer!", "CHAT_INGAME_CORRECT");
      } else {
        onSendChat(localStorage.getItem("username"), currentMessage, "CHAT_INGAME");
      }
    }
 
    setCurrentMessage("");
  };
 
  const addPoints = (points) => {
    const updatedPlayers = players.map(player => {
      if (player.token === localStorage.getItem("token")) {
        return {
          ...player,
          points: player.points + points,
        };
      } else {
        return player;
      }
    });
    updatePlayers(updatedPlayers);
  };
 
  useEffect(() => {
    if (!safe) {
      const len = jokerGame.length - 1;
      if (jokerGame.length > 0 && jokerGame[len].type === "JOKER") { // Check if jokerGame is not empty
        const num = jokerGame[len].content;
        if (num === 1) {
          const blackoutMessage = jokerGame[len].type === "JOKER" && jokerGame[len].from !== localStorage.getItem("token");
          if (blackoutMessage) {
            setBlackoutMap(0);
 
            const timeoutId = setTimeout(() => {
              setBlackoutMap(1);
            }, 10000);
 
            // return () => clearTimeout(timeoutId);
          }
        } else if (num === 2) {
          const removeJoker = jokerGame[len].type === "JOKER" && jokerGame[len].from !== localStorage.getItem("token");
          if (removeJoker) {
            setRevealedLetters(0);
          }
        }
      }
    }
  }, [jokerGame]);

 
  useEffect(() => {
    let isMounted = true;
 
    const initializeMap = async () => {
      if (!game || !game.cities || game.cities.length < round) {
        return;
      }
      const newLocation = game.cities[round - 1];
      setLocation(newLocation);
 
      if (!newLocation || !newLocation.latitude || !newLocation.longitude) {
        return;
      }
 
      const apiOptions = {
        apiKey: config.googleMapsApiKey,
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
          showRoadLabels: false,
          linksControl: false,
        });
      } catch (error) {
        console.error("Error loading Google Maps API", error);
      }
    };
 
    if (isMounted) {
      initializeMap();
    }
 
    return () => {
      isMounted = false;
    };
  }, [round, blackoutMap]);
 
 
  const handleJoker = (jokerType) => {
    let number;
    if (jokerType === "delay") {
      number = 1;
      setdelayJoker(true);
    } else if (jokerType === "hintRemove") {
      number = 2;
      sethintRemoveJoker(true);
    }
    setSafe(true);
    onSendChat(localStorage.getItem("username"), "Used a Joker!", "CHAT_INGAME");
    onSendChat(localStorage.getItem("token"), number, "JOKER");
  };
 
 
  const hintLines = (
    <div className="hint-line">
      {solution.split("").map((letter, index) => (
        <span key={index} style={{ marginRight: "5px", fontSize: "24px" }}>
          {index < revealedLetters ? letter : "_"}
        </span>
      ))}
    </div>
  );
 
 
  return (
    <div className="row mt-5">
      <div className="col-md-3 rounded">
        <div className="card">
          <div className="text-center card-header mt-2 mx-1 h3">Leaderboard</div>  
          <div className="leaderboard-container text-center p-3">
            <table
              id="rankings"
              className="table leaderboard-results w-100"
            >
              <thead>
                <tr>
                  <th className="text-dark h5">Name</th>
                  <th className="text-dark h5">Points</th>
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
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <h1 className="text-center mt-2">{game.gameType} MODE</h1>
        <div className="bg-light mx-1 mb-3">
          <div className="row">
            <div className="col-md-6 bg-transparent">
              <div className="bg-transparent mx-1">
                <div className="text-start h5 m-3">
                  Timer: {timer && timer} seconds
                </div>
              </div>
            </div>
            <div className="col-md-6 bg-transparent">
              <div className="bg-transparent mx-1">
                <div className="text-end h5 m-3">
                  Round: {round} / {game.roundCount}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="hint-lines-container d-flex justify-content-center">
                {hintLines}
              </div>
            </div>
          </div>
          <div id="street-view" className="w-100" style={{ height: "400px", opacity: blackoutMap }}></div>
          <div className="button-wrapper mt-3 d-flex justify-content-center">
            <button className="btn btn-success mx-2 mb-3" style={{ width: "175px" }} disabled={delayJoker} onClick={() => handleJoker("delay")}>
              Delay Joker
            </button>
            <button className="btn btn-success mx-2 mb-3" style={{ width: "175px" }} disabled={hintRemoveJoker} onClick={() => handleJoker("hintRemove")}>
              Hint remove Joker
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-3 rounded">
        <div className="card">
          <div className="text-center card-header mt-2 mx-1 h3">Chat</div>
          <div className="chat-container text-start mt-3 p-3 overflow-auto" ref={chatContainerRef} style={{ maxHeight: "175px" }}>
            <ul className="list-unstyled">
              {messagesGame.filter(msg => msg.type !== "JOKER").map((msg, index) => (
                <li key={index}>
                  <strong>{msg.from}</strong>: {msg.content}
                </li>
              ))}
            </ul>
          </div>
          <div className="input-group p-3">
            <input
              type="text"
              className="form-control"
              value={currentMessage}
              maxLength={50}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessageInGame();
                }
              }}
              placeholder="Your guess..."
              disabled={pointsAssigned} // Disable input if points are already assigned
            />
            <button className="btn btn-primary" onClick={handleSendMessageInGame} disabled={pointsAssigned}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};
 
InGame.propTypes = {
  round: PropTypes.number.isRequired,
  correctGuesses: PropTypes.number.isRequired,
  roundLength: PropTypes.number.isRequired,
  onSendChat: PropTypes.func.isRequired,
  updateRound: PropTypes.func.isRequired,
  messagesGame: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
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
    cities: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      capital: PropTypes.string.isRequired,
      longitude: PropTypes.number.isRequired,
      latitude: PropTypes.number.isRequired,
    })).isRequired,
  }).isRequired,
  updatePlayers: PropTypes.func.isRequired,
  jokerGame: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
 
export default InGame;