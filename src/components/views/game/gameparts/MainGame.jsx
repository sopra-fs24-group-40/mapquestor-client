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
  const [users, setUsers] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [game, setGame] = useState({});
  const [countdownDuration, setCountdownDuration] = useState(null);


  let { id } = useParams();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(`/games/${id}/users`);
        const users = await response.data;
        setUsers(users);
      } catch (error) {
        console.error("Fehler beim Abrufen der Benutzer: ", error);
      }
    };

    fetchUsers();
  }, [id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(`/games/${id}/`);
        const game = await response.data;
        setGame(game);
        console.log("Game:");
        console.log(game);
      } catch (error) {
        console.error("Fehler beim Abrufen der Benutzer: ", error);
      }
    };

    fetchUsers();
  }, [id]);


  useEffect(() => {
    const socket = new SockJS("https://sopra-fs24-group-40-server.oa.r.appspot.com/ws");
    const localStompClient = Stomp.over(socket);

    localStompClient.connect({}, function(frame) {
      console.log("Connected: " + frame);

      localStompClient.subscribe(`/topic/${id}/chat`, (message) => {
        const payload = JSON.parse(message.body);
        console.log(payload);
        if (payload.type === "JOIN" || payload.type === "LEAVE") {
          updateUsersList(payload);
        }

        if (payload.type === "START_COUNTDOWN") {
          setCountdownDuration(10);
        }

        setMessages(prevMessages => [...prevMessages, payload]);
      });

      localStompClient.subscribe(`/topic/${id}/gameState`, (message) => {
        const gameState = JSON.parse(message.body);
        setGamePhase(gameState.status);
      });

      let message = { from: localStorage.getItem("token"), text: "Joined the game!", type: "JOIN" };
      localStompClient.send(`/app/${id}/chat`, {}, JSON.stringify(message));
    });

    setStompClient(localStompClient);


    return () => {
      if (stompClient) {

        localStompClient.disconnect();
      }
    };
  }, [id]);

  const sendChatMessage = (from, text, type) => {
    const message = { from, text, type };
    stompClient.send(`/app/${id}/chat`, {}, JSON.stringify(message));
  };

  const startGame = () => {
    let message = { status: "INGAME" };
    stompClient.send(`/app/${id}/gameState`, {}, JSON.stringify(message));
  };


  const updateUsersList = (payload) => {
    setUsers(prevUsers => {
      if (payload.type === "JOIN") {
        return [...new Set([...prevUsers, payload.from])];
      } else if (payload.type === "LEAVE") {
        const updatedUsers = prevUsers.filter(user => user !== payload.from);
        console.log(updatedUsers);

        return updatedUsers;
      } else {
        return prevUsers;
      }
    });
  };

  switch (gamePhase) {
    case "LOBBY":
      return <Lobby startGame={startGame} onSendChat={sendChatMessage} messages={messages} users={users} game={game}
                    countdownDuration={countdownDuration} />;
    case "INGAME":
      return <Ingame />;
    default:
      return <div>Lade...</div>;
  }
}
