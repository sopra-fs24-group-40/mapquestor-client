import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../../styles/views/gameLayout.scss";
import "../../styles/views/game.scss";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.png";
import Fett from "../../assets/Fett.png";
import Vader from "../../assets/Vader.png";
import C3PO from "../../assets/C3PO.png";
import Clone from "../../assets/Clone.png";
import Ren from "../../assets/Ren.png";
import Stormtrooper from "../../assets/Stormtrooper.png";
import { api } from "helpers/api";
import { getDomain } from "../../helpers/getDomain";
 
import SockJS from "sockjs-client";
import Stomp from "stompjs";
 
export const GameContext = React.createContext();
 
const logout = (stompClient, navigate) => {
  if (stompClient) {
    const gameCode = localStorage.getItem("gameCode");
    if (gameCode) {
      const message1 = { from: localStorage.getItem("username"), content: "Left the game", type: "CHAT" };
      stompClient.send(`/app/${gameCode}/chat`, {}, JSON.stringify(message1));
      // const message = { from: localStorage.getItem("token"), content: "Left the game", type: "LEAVE" };
      // stompClient.send(`/app/${gameCode}/chat`, {}, JSON.stringify(message));
    }
 
    let logoutMessage = {
      from: localStorage.getItem("token"),
      content: gameCode,
      type: "LOGOUT",
    };
    stompClient.send("/app/logout", {}, JSON.stringify(logoutMessage));
  }
 
  localStorage.removeItem("token");
  localStorage.removeItem("id");
  localStorage.removeItem("username");
  localStorage.removeItem("gameCode");
  localStorage.removeItem("gameState");
  localStorage.removeItem("avatar");
  navigate("/login");
};
 
function GameLayout(props) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [user, setUser] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [showLayout, setShowLayout] = useState(true);
 
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("/users");
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
 
    const intervalId = setInterval(fetchUsers, 5000);
 
    const socket = new SockJS(getDomain() + "/ws");
    const localStompClient = Stomp.over(socket);
    localStompClient.connect({}, function (frame) {
      setStompClient(localStompClient);
 
 
      localStompClient.subscribe("/topic/logout", (message) => {
 
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
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (localStompClient) {
        localStompClient.disconnect();
      }
    };
  }, []);
 
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      logout(stompClient, navigate);
    };
 
    window.addEventListener("beforeunload", handleBeforeUnload);
 
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [stompClient, navigate]);
 
  useEffect(() => {
    showGameLayout();
  });
 
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
 
  const showCorrectAvatar = () => {
    const image = localStorage.getItem("avatar");
    return resolveAvatar(image);
  };
 
  const resolveAvatar = (image) => {
    if (image === "0") {
      return Fett;
    }
    if (image === "1") {
      return Vader;
    }
    if (image === "2") {
      return C3PO;
    }
    if (image === "3") {
      return Clone;
    }
    if (image === "4") {
      return Ren;
    }
    if (image === "5") {
      return Stormtrooper;
    }
    return avatar;
  };
 
  const showGameLayout = () => {
    if (localStorage.getItem("gameCode")) {
      setShowLayout(false);
    } else {
      setShowLayout(true);
    }
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
            {showLayout ? (
              <div className="container-search-bar col-auto p-3 pb-2 d-flex flex-column align-items-start">
                <label htmlFor="site-search">Search Users: </label>
                <input
                  type="search"
                  id="site-search"
                  placeholder="There are many..."
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-primary mt-2" onClick={handleSearch}>Search</button>
                {searchResult === "not found" && <p style={{ color: "red" }}>User not found</p>}
              </div>
            ) : (null)}
            <div className="col-auto p-3">
              <figure className="container-avatar">
                <img src={showCorrectAvatar()} width={50} alt="" /></figure>
              {showLayout ? (
                <button className="btn btn-primary" onClick={() => user && navigate(`/game/users/${user.id}`)}>My
                  Profile
                </button>
              ) : (null)}
            </div>
            <div className="col-auto p-3">
              <button className="btn btn-danger" onClick={() => logout(stompClient, navigate)}>Logout</button>
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