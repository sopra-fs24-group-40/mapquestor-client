import React, { useEffect, useState } from "react";
import Lobby from "./Lobby";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useLocation, useParams } from "react-router-dom";

export default function Game() {
  const [gamePhase, setGamePhase] = useState("LOBBY");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [stompClient, setStompClient] = useState(null);

  let { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const localStompClient = Stomp.over(socket);

    localStompClient.connect({}, function(frame) {
      console.log("Connected: " + frame);

      localStompClient.subscribe(`/topic/${id}/chat`, (message) => {
        const payload = JSON.parse(message.body);
        if (payload.type === "JOIN" || payload.type === "LEAVE") {
          updateUsersList(payload);
        }
        setMessages(prevMessages => [...prevMessages, payload]);
      });

      localStompClient.subscribe(`/topic/${id}/gameState`, (message) => {
        const gameState = JSON.parse(message.body);
        setGamePhase(gameState.phase);
      });

      let message = { from: localStorage.getItem("username"), text: "Joined the game!", type: "JOIN" };
      localStompClient.send(`/app/${id}/chat`, {}, JSON.stringify(message));
    });

    setStompClient(localStompClient);


    const handleUnload = (event) => {
      sendChatMessage(localStorage.getItem("username"), "Left the game!", "LEAVE", localStompClient);
      localStompClient.disconnect();
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      // Clean up the event listener and disconnect when the component unmounts
      window.removeEventListener("beforeunload", handleUnload);
      if (localStompClient) {
        sendChatMessage(localStorage.getItem("username"), "Left the game!", "LEAVE", localStompClient);
        localStompClient.disconnect();
      }
    };
  }, [id, location.pathname]);

  const sendChatMessage = (from, text, type) => {
    const message = { from, text, type };
    stompClient.send(`/app/${id}/chat`, {}, JSON.stringify(message));
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
      return <Lobby onSendChat={sendChatMessage} messages={messages} users={users} />;
    default:
      return <div>Lade...</div>;
  }
}
