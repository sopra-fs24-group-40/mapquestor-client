import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../../views/Login";
import LoginLayout from "../../layouts/LoginLayout";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import { GameGuard } from "../routeProtectors/GameGuard";
import Register from "../../views/Register";
import GameRouter from "./GameRouter";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<LoginLayout />}>
          <Route path="/login" element={<LoginGuard />}>
            <Route index element={<Login />} />
          </Route>

          <Route path="/register" element={<LoginGuard />}>
            <Route index element={<Register />} />
          </Route>
        </Route>

        <Route element={<GameGuard />}>
          <Route path="game/*" element={<GameRouter base="/game" />} />
        </Route>

        <Route path="*" element={
          <Navigate to="login" replace />
        } />

      </Routes>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;