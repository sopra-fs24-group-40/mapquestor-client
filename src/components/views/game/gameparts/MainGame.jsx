import React, { useContext, useEffect, useState } from "react";
import Lobby from "./Lobby";
import { useParams } from "react-router-dom";
import { api } from "../../../../helpers/api";
import Ingame from "./Ingame";
import Endgame from "./Endgame";
import { GameContext } from "../../../layouts/GameLayout";


export default function Game() {
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

    if (stompClient) {
      const gameTopic = `/topic/${id}`;

      stompClient.subscribe(`${gameTopic}/gameState`, (message) => {
        const gameState = JSON.parse(message.body);
        setGamePhase(gameState.status);
      });

      stompClient.subscribe(`${gameTopic}/chat`, (message) => {
        const payload = JSON.parse(message.body);
        handleMessage(payload);
      });

      let joinMessage = { from: localStorage.getItem("token"), content: "Joined the Game!", type: "JOIN" };
      stompClient.send(`/app/${id}/chat`, {}, JSON.stringify(joinMessage));

      let joinMessage2 = { from: localStorage.getItem("username"), content: "Joined the Game!", type: "CHAT" };
      stompClient.send(`/app/${id}/chat`, {}, JSON.stringify(joinMessage2));


      return () => {
        stompClient.unsubscribe(`${gameTopic}/gameState`);
        stompClient.unsubscribe(`${gameTopic}/chat`);
      };
    }
  }, [stompClient, id, navigate]);

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

  const updatePlayers = (updatedPlayers) => {
    setPlayers(updatedPlayers);
    const message = { from: localStorage.getItem("token"), content: updatedPlayers, type: "POINTS" };
    stompClient && stompClient.send(`/app/${id}/chat`, {}, JSON.stringify(message));
  };

  const updateRound = (round) => {

    const maxRounds = game.roundCount;
    if (round > maxRounds) {
      let message = { status: "ENDGAME" };
      stompClient && stompClient.send(`/app/${id}/gameState`, {}, JSON.stringify(message));
    } else {
      setRound(round);
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


  const handleMessage = (payload) => {
    console.log("hier ------>" + payload.type);
    if (payload.type === "JOIN") {
      setPlayers(prevPlayers => {
        const userExists = prevPlayers.some(player => player.username === payload.content.username);
        if (!userExists) {
          return [...prevPlayers, payload.content];
        } else {
          return prevPlayers;
        }
      });
    } else if (payload.type === "LEAVE") {

      console.log("Player left the game");
      console.log(payload.from);
      console.log(creator);
      console.log(game);

      if (payload.from === creator) {
        console.log("Creator left the game");
        const message = { from: payload.from, content: {}, type: "LEAVE_CREATOR" };
        stompClient && stompClient.send(`/app/${id}/chat`, {}, JSON.stringify(message));
      }

      setPlayers(prevPlayers => prevPlayers.filter(player => player.token !== payload.from));
      setMessages(prevMessages => [...prevMessages, payload]);
    } else if (payload.type === "LEAVE_CREATOR") {
      navigate("/game");
    } else if (payload.type === "CHAT") {
      console.log(game);
      setMessages(prevMessages => [...prevMessages, payload]);
    } else if (payload.type === "CHAT_INGAME") {
      setMessagesGame(prevMessages => [...prevMessages, payload]);
    } else if (payload.type === "START_COUNTDOWN") {
      setCountdownDuration(1);
    } else if (payload.type === "POINTS") {
      setPlayers(payload.content);
    } else if (payload.type === "JOKER") {
      setMessagesGame(prevMessages => [...prevMessages, payload]);
    }
  };

  switch (gamePhase) {
    case "LOBBY":
      return <Lobby startGame={startGame} onSendChat={sendChatMessage} messages={messages} players={players} game={game}
                    countdownDuration={countdownDuration} handleLeave={handleLeave} />;
    case "INGAME":
      return <Ingame round={round} onSendChat={sendChatMessageGame} messagesGame={messagesGame} players={players}
                     game={game} updatePlayers={updatePlayers} updateRound={updateRound} handleLeave={handleLeave} />;
    case "ENDGAME":
      return <Endgame game={game} onSendChat={sendChatMessage} messages={messages} players={players}
                      handleLeave={handleLeave} />;
    default:
      return <div>Lade...</div>;
  }
}
