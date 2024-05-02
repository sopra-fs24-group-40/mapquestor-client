import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../../styles/views/gameLayout.scss";
import "../../styles/views/game.scss";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.png";
import { api } from "helpers/api";
import { getDomain } from "../../helpers/getDomain";

import SockJS from "sockjs-client";
import Stomp from "stompjs";

export const GameContext = React.createContext();

function GameLayout(props) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [user, setUser] = useState(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("/users");
        console.log(response.data);
        setUsers(response.data);
        const currentUserId = Number(localStorage.getItem("id"));
        if (currentUserId) {
          const currentUser = response.data.find(user => user.id === currentUserId);
          setUser(currentUser);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchUsers();


    const socket = new SockJS(getDomain() + "/ws");
    const localStompClient = Stomp.over(socket);
    localStompClient.connect({}, function(frame) {
      setStompClient(localStompClient);


      localStompClient.subscribe("/topic/logout", (message) => {

        if (localStorage.getItem("gameCode")) {
          const gameCode = localStorage.getItem("gameCode");
          const message = { from: localStorage.getItem("token"), content: "Left the game", type: "LEAVE" };
          localStompClient.send(`/app/${gameCode}/chat`, {}, JSON.stringify(message));
        }

        const payload = JSON.parse(message.body);
        if (payload.from === localStorage.getItem("token")) {
          localStorage.removeItem("token");
          localStorage.removeItem("id");
          localStorage.removeItem("username");
          localStorage.removeItem("gameCode");
          navigate("/login");
        }
      });
    });

    return () => {
      if (localStompClient) {
        localStompClient.disconnect();
      }
    };
  }, []);

  const logout = () => {

    if (stompClient) {

      let logoutMessage = {
        from: localStorage.getItem("token"),
        content: localStorage.getItem("gameCode"),
        type: "LOGOUT",
      };
      stompClient.send("/app/logout", {}, JSON.stringify(logoutMessage));

    }
  };

  const handleSearch = () => {
    const user = users.find(user => user.username === searchQuery);
    if (user) {
      navigate(`/game/users/${user.id}`);
    } else {
      setSearchResult("not found");
      setTimeout(() => {
        setSearchResult(null);
      }, 2000);
    }
    setSearchQuery("");
  };

  const contextValue = React.useMemo(() => ({
    stompClient,
    user,
    navigate,
    logout,
  }), [stompClient, user, navigate, logout]);

  return (
    <GameContext.Provider value={contextValue}>
      <div className="container-fluid">
        <div className="container-header row justify-content-center">
          <div className="col">
            <div className="row align-items-center container-logoAndText">
              <div className="col-auto">
                <img src={logo} width={100} alt="" />
              </div>
              <div className="container-mapquestor col-6">
                <h1 className="custom-font">MapQuestor</h1>
              </div>
            </div>
          </div>
          <div className="col d-flex justify-content-end align-items-center">
            <div className="container-search-bar col-auto p-3">
              <label htmlFor="site-search">Search Users: </label>
              <input
                type="search"
                id="site-search"
                placeholder="There are many..."
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={handleSearch}>Search</button>
              {searchResult === "not found" && <p style={{ color: "red" }}>User not found</p>}
            </div>
            <div className="col-auto p-3">
              <figure className="container-avatar">
                <img src={avatar} width={50} alt="" /></figure>
              <button onClick={() => user && navigate(`/game/users/${user.id}`)}>My Profile</button>
            </div>
            <div className="col-auto">
              <button className="btn btn-danger" onClick={() => logout()}>Logout</button>
            </div>
          </div>
        </div>
        <div className="container">
          <Outlet />
        </div>
      </div>
    </GameContext.Provider>
  );
}

export default GameLayout;