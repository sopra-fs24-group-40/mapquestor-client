import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PropTypes from "prop-types";
import GameLayout from "../../layouts/GameLayout";
import Game from "../../views/Game/Game";
import CreateGame from "../../views/Game/CreateGame";
import Lobby from "../../views/Game/Lobby";
import Users from "../../views/Game/Users";

const GameRouter = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Routes>
        <Route path="" element={<GameLayout />}>
          <Route index element={<Game />} />
          <Route path="create" element={<CreateGame />} />
          <Route path="users" element={<Users />} />
          <Route path=":id" element={<Lobby />} />
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
