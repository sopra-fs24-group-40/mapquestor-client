import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../../views/Login";
import LoginLayout from "../../layouts/LoginLayout";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LoginLayout />}>
          <Route path="/" element={<Login />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
