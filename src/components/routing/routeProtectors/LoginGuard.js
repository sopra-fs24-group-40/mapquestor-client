import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";


export const LoginGuard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   const verifyToken = async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       setIsAuthenticated(false);
  //
  //       return;
  //     }
  //     try {
  //       const response = await api.post("/verify-token", { token });
  //       setIsAuthenticated(true);
  //     } catch (error) {
  //       localStorage.removeItem("token");
  //       setIsAuthenticated(false);
  //     }
  //   };
  //
  //   if (localStorage.getItem("token")) {
  //     verifyToken();
  //   } else {
  //     setIsAuthenticated(false);
  //   }
  // }, []);
  //
  // if (isAuthenticated === null) {
  //   return null;
  // }

  return <Outlet />;
};
