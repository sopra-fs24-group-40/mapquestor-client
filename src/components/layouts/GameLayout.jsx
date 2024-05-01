import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../../styles/views/gameLayout.scss";
import "../../styles/views/game.scss";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.png";
import { api, handleError } from "helpers/api";
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


    // Setup WebSocket connection
    const socket = new SockJS(getDomain() + "/ws");
    const localStompClient = Stomp.over(socket);
    localStompClient.connect({}, function(frame) {
      setStompClient(localStompClient);
    });

    return () => {
      if (localStompClient) {
        localStompClient.disconnect();
      }
    };
  }, []);

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    try {
      const requestBody = JSON.stringify({ "token": localStorage.getItem("token") });
      await api.post("/logout", requestBody);
    } catch (error) {
      console.log(`Something went wrong during the logout: \n${handleError(error)}`);
    }
    localStorage.removeItem("username");
    navigate("/login");
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

  const contextValue = {
    stompClient,
    user,
    navigate,
  };

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
              <p>Search other Users</p>
              <label htmlFor="site-search"></label>
              <input
                type="search"
                id="site-search"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={handleSearch}>Search</button>
              {searchResult === "not found" && <p style={{ color: "red" }}>User not found</p>}
            </div>
            <div className="col-auto p-3">
              <figure className="container-avatar">
                <img src={avatar} width={50} /></figure>
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