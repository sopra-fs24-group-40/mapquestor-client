import React from "react";
import { Route, Routes } from "react-router-dom";
import PropTypes from "prop-types";
import GameLayout from "../../layouts/GameLayout";
import Game from "../../views/game/Game";
import CreateGame from "../../views/game/CreateGame";
import MainGame from "../../views/game/gameparts/MainGame";
import Users from "../../views/game/Users";
import JoinGame from "../../views/game/JoinGame";
import ProfilePage from "../../views/user/ProfilePage";
import Endgame from "../../views/game/gameparts/Endgame";
import { GameGuard } from "../routeProtectors/GameGuard";

const GameRouter = () => {
  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <Routes>
        <Route path="" element={<GameLayout/>}>
          <Route index element={<Game/>}/>
          <Route element={<GameGuard />}>
            <Route path="create" element={<CreateGame/>}/>
            <Route path="users" element={<Users/>}/>
            <Route path="users/:id" element={<ProfilePage/>}/>
            <Route path="join" element={<JoinGame/>}/>
            <Route path=":id" element={<MainGame/>}/>
            <Route path="endgame" element={<Endgame/>}/>
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

GameRouter.propTypes = {
  base: PropTypes.string,
};

export default GameRouter;
