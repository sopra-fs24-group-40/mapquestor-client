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

  const doLogin = async (event) => {
    event.preventDefault();
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/login", requestBody);

      const user = new User(response.data);
      console.log(user);

      localStorage.setItem("id", user.id);
      localStorage.setItem("token", user.token);
      localStorage.setItem("username", user.username);
      localStorage.setItem("avatar", user.avatar);

      navigate("/game");
    } catch (error) {
      setError(error.response.data.message);
    }
  };


  return (
    <div className="row justify-content-center">
      <div className="col-md-5 justify-content-center rounded-4 p-4 login-container transparent-background">
        <h1 className="text-center fw-bold">Login</h1>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            className="form-control"
            type="text"
            id="username"
            placeholder="What's your name?"
            ref={userRef}
            autoComplete="off"
            maxLength={20}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <form onSubmit={doLogin}>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            className="form-control"
            type="password"
            id="password"
            placeholder="Top secret!"
            maxLength={20}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <hr />
        <div className="row">
          <div className="col-6">
            <button
              className="btn btn-danger" disabled={!username || !password}
              type="submit">Login
            </button>
            </div>
          <div className="col-6 d-flex justify-content-end">
            <button
              className="btn btn-danger" onClick={() => navigate("/register")}>Register
            </button>
          </div>
        </div>
        </form>
        {error && <p className="text-danger" style={{marginTop: error ? "1rem" : "0", marginBottom: "0"}}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;