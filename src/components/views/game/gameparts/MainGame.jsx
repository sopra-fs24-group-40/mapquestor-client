import React, { useContext, useEffect, useState } from "react";
import Lobby from "./Lobby";
import { useParams, useLocation } from "react-router-dom";
import { api } from "../../../../helpers/api";
import Ingame from "./Ingame";
import Endgame from "./Endgame";
import { GameContext } from "../../../layouts/GameLayout";
import countdowns from "../../../../assets/countdownv2.mp3";
 
 
export default function Game() {
  const location = useLocation();
  const { stompClient, user, navigate, logout } = useContext(GameContext);
  const [gamePhase, setGamePhase] = useState("LOBBY");
  const [messages, setMessages] = useState([]);
  const [messagesGame, setMessagesGame] = useState([]);
  const [players, setPlayers] = useState([]);
  const [game, setGame] = useState({});
  const [creator, setCreator] = useState(null);
  const [countdownDuration, setCountdownDuration] = useState(null);
  const { id } = useParams();
  const [round, setRound] = useState(1);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [roundLength, setRoundLength] = useState(location.state ? location.state.roundLength : 60);
 
 
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await api.get(`/games/${id}`);
        const gameData = response.data;
 
        if (!gameData.players.some(player => player.token === localStorage.getItem("token"))) {
          navigate("/game/join");
          return;
        }
 
        setGame(gameData);
        setCreator(gameData.creator);
        setPlayers(gameData.players || []);
 
        setGamePhase(gameData.status || "LOBBY");
      } catch (error) {
        console.error("Error fetching game data:", error);
        navigate("/game/join");
      }
    };
 
    fetchGameData();
 
  }, [id, navigate]);
 
 
  useEffect(() => {
 
 
    if (stompClient && creator) {
      const gameTopic = `/topic/${id}`;
 
      stompClient.subscribe(`${gameTopic}/cities`, (message) => {
        const payload = JSON.parse(message.body);
        console.log("--------------------", message);
        console.log("payload", payload);
        handleMessage(payload);
      });
 
 
      stompClient.subscribe(`${gameTopic}/gameState`, (message) => {
        const gameState = JSON.parse(message.body);
        if (gameState.status === "LOBBY") {
          setCorrectGuesses(0);
          setRound(1);
          setCountdownDuration(null);
          let logoutMessage = {
            from: localStorage.getItem("token"),
            content: localStorage.getItem("gameCode"),
            type: "CITY",
          };
 
          if (game.creator === localStorage.getItem("token")) {
            stompClient.send(`/app/${id}/cities`, {}, JSON.stringify(logoutMessage));
          }
        } else if (gameState.status === "ENDGAME") {
          setRound(1);
        }
        setGamePhase(gameState.status);
 
      });
 
      stompClient.subscribe(`${gameTopic}/chat`, (message) => {
        const payload = JSON.parse(message.body);
        handleMessage(payload);
      });
 
      stompClient.subscribe("/topic/logout", (message) => {
        const payload = JSON.parse(message.body);
        if (payload.content === localStorage.getItem("gameCode")) {
          handleMessage(payload);
        }
      });
 
      let joinMessage = { from: localStorage.getItem("token"), content: "Joined the Game!", type: "JOIN" };
      stompClient.send(`/app/${id}/chat`, {}, JSON.stringify(joinMessage));
 
      let joinMessage2 = { from: localStorage.getItem("username"), content: "Joined the Game!", type: "CHAT" };
      stompClient.send(`/app/${id}/chat`, {}, JSON.stringify(joinMessage2));
 
      return () => {
        stompClient.unsubscribe(`${gameTopic}/gameState`);
        stompClient.unsubscribe(`${gameTopic}/chat`);
        stompClient.unsubscribe(`${gameTopic}/cities`);
        stompClient.unsubscribe("/topic/logout");
      };
    }
  }, [game, creator]);
 
  useEffect(() => {
    setCreator(game.creator);
  }, [game]);
 
 
  const sendChatMessage = (from, content, type) => {
    const message = { from, content, type };
    stompClient && stompClient.send(`/app/${id}/chat`, {}, JSON.stringify(message));
  };
 
  const sendChatMessageGame = (from, content, type) => {
    const message = { from, content, type };
    stompClient && stompClient.send(`/app/${id}/chat`, {}, JSON.stringify(message));
  };
 
  const startGame = () => {
    let message = { status: "INGAME" };
    stompClient && stompClient.send(`/app/${id}/gameState`, {}, JSON.stringify(message));
  };
 
  const playAgain = () => {
    zeroPoints();
    let message = { status: "LOBBY" };
    stompClient && stompClient.send(`/app/${id}/gameState`, {}, JSON.stringify(message));
    setRound(1);
    setCorrectGuesses(0);
  };
 
  const updateCountdown = (countdown) => {
    setCountdownDuration(null);
  };
 
 
  const zeroPoints = () => {
    const updatedPlayers = players.map(player => {
      return {
        ...player,
        points: 0,
      };
    });
    updatePlayers(updatedPlayers);
  };
 
 
  const updatePlayers = (updatedPlayers) => {
    setPlayers(updatedPlayers);
    console.log("updatedPlayers", updatedPlayers); // Log the updated players
    const message = { from: localStorage.getItem("token"), content: updatedPlayers, type: "POINTS" };
    stompClient && stompClient.send(`/app/${id}/chat`, {}, JSON.stringify(message));
  };
 
 
  const updateRound = (round) => {
 
    const maxRounds = game.roundCount;
    if (round > maxRounds) {
      const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
      console.log("sortedPlayers ->", sortedPlayers);
      if (sortedPlayers[0].token === localStorage.getItem("token")) {
        const message2 = { from: localStorage.getItem("token"), content: "WON", type: "PLAYED" };
        stompClient && stompClient.send(`/app/${id}/chat`, {}, JSON.stringify(message2));
      } else {
        console.log("sortedPlayers else ->", sortedPlayers);
        const message1 = { from: localStorage.getItem("token"), content: "FINISHED!", type: "PLAYED" };
        stompClient && stompClient.send(`/app/${id}/chat`, {}, JSON.stringify(message1));
      }
      console.log("Endgame trigger ->")
      let message = { status: "ENDGAME" };
      stompClient && stompClient.send(`/app/${id}/gameState`, {}, JSON.stringify(message));
    } else {
      setRound(round);
      setCorrectGuesses(0);
    }
  };
 
  const handleLeave = (player) => {
 
    if (player === game.creator) {
      const message = { from: player, content: {}, type: "LEAVE_CREATOR" };
      stompClient && stompClient.send(`/app/${id}/chat`, {}, JSON.stringify(message));
    } else {
      const message = { from: player, content: "Left the game", type: "LEAVE" };
      stompClient && stompClient.send(`/app/${id}/chat`, {}, JSON.stringify(message));
    }
  };
 
  const cityTest = () => {
    let cityMessage = { roundCount: game.roundCount };
    stompClient.send("/app/cities", {}, JSON.stringify(cityMessage));
  };
 
  const doSomething = () => {
    const countdownSound = new Audio(countdowns);
    countdownSound.play()
      .then(() => (console.log("Sound abgespielt!")))
      .catch(error => console.error("Fehler beim Abspielen des Sounds:", error));
  };
 
  const handleMessage = (payload) => {
    if (payload.type === "JOIN") {
      if (game.creator === localStorage.getItem("token")) {
        let joinMessage3 = { from: localStorage.getItem("username"), content: roundLength, type: "TIMER" };
        stompClient.send(`/app/${id}/chat`, {}, JSON.stringify(joinMessage3));
      }
      setPlayers(prevPlayers => {
        const userExists = prevPlayers.some(player => player.username === payload.content.username);
        if (!userExists) {
          return [...prevPlayers, payload.content];
        } else {
          return prevPlayers;
        }
      });
    } else if (payload.type === "LEAVE") {
      if(payload.from === localStorage.getItem("token")){
        localStorage.removeItem("gameCode");
      }
      if (payload.from === creator) {
        const message = { from: payload.from, content: {}, type: "LEAVE_CREATOR" };
        stompClient && stompClient.send(`/app/${id}/chat`, {}, JSON.stringify(message));
      }
      console.log("-------------------------------", payload);
      setPlayers(prevPlayers => prevPlayers.filter(player => player.token !== payload.from));
      // setMessages(prevMessages => [...prevMessages, payload]);
    } else if (payload.type === "LEAVE_CREATOR") {
      console.log("Creator has left the game!");
      navigate("/game");
      // Add a delay to ensure the alert is triggered after navigation
      if(localStorage.getItem("gameCode")){
        setTimeout(() => {
          alert("Game has been closed. The creator left or there are to few users to play.");
          localStorage.removeItem("gameCode");
        }, 100);}
    } else if (payload.type === "CHAT") {
      setMessages(prevMessages => [...prevMessages, payload]);
    } else if (payload.type === "CHAT_INGAME") {
      setMessagesGame(prevMessages => [...prevMessages, payload]);
    } else if (payload.type === "CHAT_INGAME_CORRECT") {
      setMessagesGame(prevMessages => [...prevMessages, payload]);
      setCorrectGuesses(prev => prev + 1);
    } else if (payload.type === "START_COUNTDOWN") {
      setCountdownDuration(5);
    } else if (payload.type === "JS") {
      doSomething();
    } else if (payload.type === "POINTS") {
      setPlayers(payload.content);
    } else if (payload.type === "JOKER") {
      setMessagesGame(prevMessages => [...prevMessages, payload]);
    } else if (payload.type === "TIMER") {
      setRoundLength(payload.content);
      console.log("----->", payload.content);
    } else if (payload.type === "CITY") {
      console.log(payload.content);
      setRound(1);
      game.cities = payload.content;
    } else if (payload.type === "LOGOUT") {
      if (payload.from === creator) {
        const message = { from: payload.from, content: {}, type: "LEAVE_CREATOR" };
        stompClient && stompClient.send(`/app/${id}/chat`, {}, JSON.stringify(message));
      }
      setPlayers(prevPlayers => prevPlayers.filter(player => player.token !== payload.from));
    }
  };
 
  switch (gamePhase) {
    case "LOBBY":
      return <Lobby startGame={startGame} onSendChat={sendChatMessage} messages={messages} players={players} game={game}
                    countdownDuration={countdownDuration} handleLeave={handleLeave}
                    updateCountdown={updateCountdown} playAgain = {playAgain} />;
    case "INGAME":
      return <Ingame round={round} onSendChat={sendChatMessageGame} messagesGame={messagesGame} players={players}
                     game={game} updatePlayers={updatePlayers} updateRound={updateRound} handleLeave={handleLeave}
                     correctGuesses={correctGuesses} roundLength={roundLength} />;
    case "ENDGAME":
      return <Endgame game={game} onSendChat={sendChatMessage} messages={messages} players={players}
                      handleLeave={handleLeave} playAgain={playAgain} />;
    default:
      return <div>Lade...</div>;
  }
}