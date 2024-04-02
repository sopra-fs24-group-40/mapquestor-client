import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PropTypes from "prop-types";
import GameLayout from "../../layouts/GameLayout";
import Game from "../../views/Game";

const GameRouter = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Routes>

        <Route path="" element={<GameLayout />}>
          <Route index element={<Game />} />
          <Route path="*" element={<Navigate to="" />} />
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
