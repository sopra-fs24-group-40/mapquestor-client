import React, {useEffect, useState, useRef} from "react";
import {Loader} from "@googlemaps/js-api-loader";
import PropTypes from "prop-types";

const InGame = ({round, onSendChat, messagesGame, players, game, updatePlayers, updateRound, correctGuesses, roundLength }) => {
  const [timer, setTimer] = useState(roundLength);
  const [location, setLocation] = useState(game.cities[round - 1]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [pointsAssigned, setPointsAssigned] = useState(false); // New state variable
  const [delayJoker, setdelayJoker] = useState(false);
  const [hintRemoveJoker, sethintRemoveJoker] = useState(false);
  const [revealedLetters, setRevealedLetters] = useState(0);
  const [blackoutMap, setBlackoutMap] = useState(1);
  const chatContainerRef = useRef(null); // Create a ref for the chat container
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
    setSafe(false);
  }, [round]);

  useEffect(() => {
    let intervalId;
    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(intervalId);
      updateRound(round + 1);
      setTimer(roundLength);
      setPointsAssigned(false);
    }
    return () => clearInterval(intervalId);
  }, [timer,  players.length]);

  useEffect(() => {
    if (timer % 10 === 0 && timer !== 0) {
      setRevealedLetters(prev => prev + 1);
    }
  }, [timer]);

  useEffect(() => {
    setRevealedLetters(0);
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

    if(currentMessage === "/test") {
      onSendChat(localStorage.getItem("username"), currentMessage, "JS");

      return;
    }

    if (location && !pointsAssigned) {
      const cityName = solution;
      if (currentMessage.toLowerCase() === cityName.toLowerCase()) {
        addPoints(timer);
        setPointsAssigned(true);
        onSendChat(localStorage.getItem("username"), "Guessed the correct answer!", "CHAT_INGAME_CORRECT");
        console.log("Correct guess received" + correctGuesses);
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
    if(!safe) {
    const len = messagesGame.length - 1;
    if (messagesGame.length > 0 && messagesGame[len].type === "JOKER") { // Check if messagesGame is not empty
      const num = messagesGame[len].content;
      if (num === 1) {
        const blackoutMessage = messagesGame[len].type === "JOKER" && messagesGame[len].from !== localStorage.getItem("token");
        if (blackoutMessage) {
          setBlackoutMap(0);

          const timeoutId = setTimeout(() => {
            setBlackoutMap(1);
          }, 10000);

          return () => clearTimeout(timeoutId);
        }
      } else if (num === 2) {
        const removeJoker = messagesGame[len].type === "JOKER" && messagesGame[len].from !== localStorage.getItem("token");
        if (removeJoker) {
          setRevealedLetters(0);
        }
      }
    }
  }}, [messagesGame]);

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
        apiKey: "AIzaSyDKZd3AoAgVQyvXXGptbGAnpmBBzLbXG0A",
      };

      const loader = new Loader(apiOptions);
      try {
        await loader.load();
        const streetView = new google.maps.StreetViewPanorama(
          document.getElementById("street-view"), {
            position: {lat: newLocation.latitude, lng: newLocation.longitude},
            pov: {heading: 165, pitch: 0},
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
    onSendChat(localStorage.getItem("token"), number, "JOKER");
  };


  const hintLines = (
    <div className="hint-line">
      {solution.split("").map((letter, index) => (
        <span key={index} style={{marginRight: "5px", fontSize: "24px"}}>
          {index < revealedLetters ? letter : "_"}
        </span>
      ))}
    </div>
  );


  return (
    <div className="row mt-5">
      <div className="col-md-3 text-center">
        <div className="container-wrap bg-gray">
          <section id="leaderboard">
            <nav className="ladder-nav">
              <div className="ladder-title text-center">
                <h1 style={{fontSize: "22px"}}>Leaderboard</h1>
              </div>
              {location.name}
            </nav>
            <div className="leaderboard-container text-center p-2" style={{ maxHeight: "120px", overflowY: "auto" }}>
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
            </div>
          </section>
        </div>
      </div>
      <div className="col-md-6 justify-content-center text-center bg-gray">
        <h1>In Game</h1>

        <div
          className="timer-container mb-5">
          Timer: {timer && timer} seconds <br/>
          Round: {round} / {game.roundCount}
        </div>

        <div
          className="hint-lines-container"
          style={{display: "flex", justifyContent: "center"}}
        >
          {hintLines}
        </div>

        <div id="street-view" style={{width: "100%", height: "400px", opacity: blackoutMap}}></div>
        <div className="button-wrapper">
          <button className="individual-button" style={{fontSize: "20px"}}
                  disabled={delayJoker}
                  onClick={() => handleJoker("delay")}>
            Delay Joker
          </button>
          <button className="individual-button" style={{fontSize: "20px"}}
                  disabled={hintRemoveJoker}
                  onClick={() => handleJoker("hintRemove")}>
            Hint remove Joker
          </button>
        </div>
      </div>

      <div className="col-md-3 text-center">
        <div className="container-wrap bg-gray">
          <section id="chat" className="">
            <nav className="ladder-nav">
              <div className="ladder-title">
                <h1 style={{fontSize: "22px"}}>Chat</h1>
              </div>
            </nav>
          </section>
          <div className="chat-container text-start p-2" ref={chatContainerRef} style={{ maxHeight: "120px", overflowY: "auto" }}>
            <ul className="list-unstyled">
              {messagesGame.map((msg, index) => (
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
                  handleSendMessageInGame();
                }
              }}
              placeholder="Write a message..."
              disabled={pointsAssigned} // Disable input if points are already assigned
            />
            <button className="btn btn-primary" onClick={handleSendMessageInGame} disabled={pointsAssigned}>Send
            </button>
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
};

export default InGame;
