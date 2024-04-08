import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PropTypes from "prop-types";
import GameLayout from "../../layouts/GameLayout";
import Game from "../../views/game/Game";
import CreateGame from "../../views/game/CreateGame";
import MainGame from "../../views/game/gameparts/MainGame";
import Users from "../../views/game/Users";
import JoinLobby from "../../views/game/JoinLobby";

const GameRouter = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Routes>
        <Route path="" element={<GameLayout />}>
          <Route index element={<Game />} />
          <Route path="create" element={<CreateGame />} />
          <Route path="users" element={<Users />} />
          <Route path="joinlobby" element={<JoinLobby />} />
          <Route path=":id" element={<MainGame />} />
        </Route>
      </Routes>
    </div>
  );
};
/*
* Don't forget to export your component!
 */

GameRouter.propTypes = {
  base: PropTypes.string,
};

export default GameRouter;
