import React, { useEffect, useState } from "react";
import Lobby from "./Lobby";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useLocation, useParams } from "react-router-dom";
import { api } from "../../../../helpers/api";
import Ingame from "./Ingame";

export default function Game() {
  const [gamePhase, setGamePhase] = useState("LOBBY");
  const [messages, setMessages] = useState([]);
  const [players, setPlayers] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [game, setGame] = useState({});
  const [countdownDuration, setCountdownDuration] = useState(null);
  const { id } = useParams();


  useEffect(() => {
    const fetchGameDataAndSetupWebSocket = async () => {
      try {
        const response = await api.get(`/games/${id}`);
        const gameData = response.data;

        setGame(gameData);
        setPlayers(gameData.players || []);

        console.log(game);
        console.log(players);

        const socket = new SockJS("http://localhost:8080/ws");
        const localStompClient = Stomp.over(socket);
        localStompClient.connect({}, function(frame) {
          console.log("Connected: " + frame);

          localStompClient.subscribe(`/topic/${id}/chat`, (message) => {
            const payload = JSON.parse(message.body);
            handleMessage(payload);
          });

          localStompClient.subscribe(`/topic/${id}/gameState`, (message) => {
            const gameState = JSON.parse(message.body);
            setGamePhase(gameState.status);
          });

          let joinMessage = { from: localStorage.getItem("token"), content: "", type: "JOIN" };
          localStompClient.send(`/app/${id}/chat`, {}, JSON.stringify(joinMessage));

          let joinMessage2 = { from: localStorage.getItem("username"), content: "Joined the Game!", type: "CHAT" };
          localStompClient.send(`/app/${id}/chat`, {}, JSON.stringify(joinMessage2));
        });

        setStompClient(localStompClient);
      } catch (error) {
        console.error("Fehler beim Abrufen der Spieldaten: ", error);
      }
    };

    fetchGameDataAndSetupWebSocket();

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [id]);


  const sendChatMessage = (from, content, type) => {
    const message = { from, content, type };
    stompClient && stompClient.send(`/app/${id}/chat`, {}, JSON.stringify(message));
  };

  const startGame = () => {
    let message = { status: "INGAME" };
    stompClient && stompClient.send(`/app/${id}/gameState`, {}, JSON.stringify(message));
  };


  const handleMessage = (payload) => {
    if (payload.type === "JOIN") {
      setPlayers(prevPlayers => {
        const userExists = prevPlayers.some(player => player.username === payload.content.username);
        if (!userExists) {
          return [...prevPlayers, payload.content];
        } else {
          return prevPlayers;
        }
      });
      console.log(players);
    } else if (payload.type === "LEAVE") {
      setPlayers(prevPlayers => prevPlayers.filter(player => player.username !== payload.from));
    } else if (payload.type === "CHAT") {
      setMessages(prevMessages => [...prevMessages, payload]);
      console.log(players)
    }
  };

  switch (gamePhase) {
    case "LOBBY":
      return <Lobby startGame={startGame} onSendChat={sendChatMessage} messages={messages} players={players} game={game}
                    countdownDuration={countdownDuration} />;
    case "INGAME":
      return <Ingame />;
    default:
      return <div>Lade...</div>;
  }
}
