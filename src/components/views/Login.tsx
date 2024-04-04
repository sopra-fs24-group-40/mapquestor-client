import React, { useEffect, useRef, useState } from "react";
import "../../styles/views/login.scss";
import { useNavigate } from "react-router-dom";
import { api } from "helpers/api";
import User from "models/User";


function Login(props) {

  const navigate = useNavigate();

  const userRef = useRef();


  const [username, setUsername] = useState<string>(null);

  const [password, setPassword] = useState<string>(null);

  const [error, setError] = useState<string>("");


  useEffect(() => {
    userRef.current.focus();
  }, []);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/login", requestBody);

      const user = new User(response.data);

      localStorage.setItem("id", user.id);
      localStorage.setItem("token", user.token);
      localStorage.setItem("username", user.username);

      navigate("/game");
    } catch (error) {
      setError(error.response.data.message);
    }
  };


  return (
    <div className="row justify-content-center">
      <div className="col-md-5 justify-content-center rounded-4 p-4 login-container">
        <h1 className="text-center fw-bold">Login</h1>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            className="form-control"
            type="text"
            id="username"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            className="form-control"
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          className="btn btn-danger mt-3" disabled={!username || !password} onClick={() => doLogin()}>Login
        </button>
        <p className="text-danger mt-3">{error}</p>

      </div>
    </div>
  );
}

export default Login;