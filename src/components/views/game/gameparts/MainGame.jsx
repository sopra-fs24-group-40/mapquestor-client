import React, { useEffect, useState } from "react";
import Lobby from "./Lobby";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../../helpers/api";
import Ingame from "./Ingame";
import { getDomain } from "../../../../helpers/getDomain";
import Endgame from "./Endgame";


export default function Game() {
  const [gamePhase, setGamePhase] = useState("LOBBY");
  const [messages, setMessages] = useState([]);
  const [messagesGame, setMessagesGame] = useState([]);
  const [players, setPlayers] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [game, setGame] = useState({});
  const [countdownDuration, setCountdownDuration] = useState(null);
  const { id } = useParams();
  const [round, setRound] = useState(1);
  const navigate = useNavigate();
  const [cityData, setCityData] = useState(null); // Add state for city data

  console.log(cityData);
  useEffect(() => {
    const fetchGameDataAndSetupWebSocket = async () => {
      try {
        const response = await api.get(`/games/${id}`);
        const gameData = response.data;

        const joiningPlayerToken = localStorage.getItem("token");
        const playerExists = gameData.players.some(player => player.token === joiningPlayerToken);

        if (!playerExists) {
          navigate("/game/join");
          return;
        }


        setGame(gameData);
        setPlayers(gameData.players || []);

        const socket = new SockJS(getDomain() + "/ws");
        const localStompClient = Stomp.over(socket);
        localStompClient.connect({}, function(frame) {

          localStompClient.subscribe(`/topic/${id}/chat`, (message) => {
            const payload = JSON.parse(message.body);
            handleMessage(payload);
          });

          localStompClient.subscribe(`/topic/${id}/gameState`, (message) => {
            const gameState = JSON.parse(message.body);
            setGamePhase(gameState.status);
          });

          localStompClient.subscribe(`/topic/${id}/cityData`, (message) => {
            const cityData = JSON.parse(message.body);
            // Handle incoming city data from the backend
            console.log(cityData);
            setCityData(cityData);
        });

          let joinMessage = { from: localStorage.getItem("token"), content: "Joined the Game!", type: "JOIN" };
          localStompClient.send(`/app/${id}/chat`, {}, JSON.stringify(joinMessage));

          let joinMessage2 = { from: localStorage.getItem("username"), content: "Joined the Game!", type: "CHAT" };
          localStompClient.send(`/app/${id}/chat`, {}, JSON.stringify(joinMessage2));
        });

        setStompClient(localStompClient);
      } catch (error) {
        navigate("/game/join");
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
      console.log(players);
    } else if (payload.type === "CHAT_INGAME") {
      setMessagesGame(prevMessages => [...prevMessages, payload]);
      console.log(players);
    } else if (payload.type === "START_COUNTDOWN") {
      setCountdownDuration(10);
    }
  };

  switch (gamePhase) {
    case "LOBBY":
      return <Lobby startGame={startGame} onSendChat={sendChatMessage} messages={messages} players={players} game={game}
                    countdownDuration={countdownDuration} />;
    case "INGAME":
      return <Ingame round={round} onSendChat={sendChatMessageGame} messagesGame={messagesGame} players={players}
                     game={game} updatePlayers={updatePlayers} cityData={cityData} />;
    case "ENDGAME":
      return <Endgame game={game} players={players} />;
    default:
      return <div>Lade...</div>;
  }
}
