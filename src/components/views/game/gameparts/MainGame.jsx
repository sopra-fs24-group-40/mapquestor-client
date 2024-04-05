import React, { useEffect, useState } from 'react';
import { Lobby } from './Lobby';
import { Ingame } from './Ingame';
import { Endgame } from './Endgame';

function MainGame() {
  const [gamePhase, setGamePhase] = useState('lobby');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
        const newSocket = new WebSocket('ws://localhost:8080/ws');
    setSocket(newSocket);



    return () => {
      newSocket.close();
    };
  }, []);

  const startGame = () => {
    if (socket) {
      socket.send(JSON.stringify({ action: 'startGame' }));
    }
  };

  switch (gamePhase) {
    case 'lobby':
      return <Lobby onStartGame={startGame} />;
    case 'ingame':
      return <Ingame />;
    case 'endgame':
      return <Endgame />;
    default:
      return <div>Lade...</div>;
  }
}

export default MainGame;
