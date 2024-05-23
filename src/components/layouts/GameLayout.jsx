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
  const [dropdownVisible, setDropdownVisible] = useState(false);
 
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
 
  // UseEffect to disable the back button
  useEffect(() => {
    const handlePopState = (event) => {
      navigate(1); // Forward to prevent back navigation
    };
 
    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", handlePopState);
 
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);
 
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
            {showLayout && (
              <div className="col-auto mt-5">
                <div className="dropdown">
                  <button
                    className="btn btn-success mt-4 mb-2 dropdown-toggle"
                    style={{ width: "100px" }}
                    onClick={() => setDropdownVisible(!dropdownVisible)}
                  >
                    Rules
                  </button>
                  {dropdownVisible && (
                    <div className="dropdown-menu show p-3" style={{ maxHeight: "715px", minWidth: "617px", overflowY: "auto" }}>
                                  <h2>Objective</h2>
            <p>The goal is to locate the country or city displayed on the map. You can walk around, zoom in and out, and use the hints provided to identify the location.</p>

            <h2>Gameplay</h2>
            <ul>
              <li>A 360-degree view of a country or city is displayed.</li>
              <li>Hint lines appear above the map, with as many lines as there are letters in the country or city name.</li>
              <li>Every 10 seconds, a letter from the country or city name will be revealed.</li>
              <li>Enter your guess in the chat container on the right side. Regular chatting is also allowed here.</li>
              <li>If you guess correctly, a message will appear stating: <strong>Username</strong> guessed the correct answer.</li>
              <li>The next round starts when all players have guessed correctly or time runs out.</li>
            </ul>

            <h2>Joker Buttons</h2>
            <div>
              <p><strong>Delay Joker:</strong> Makes the map invisible for other players for a short period. You become immune to jokers used by other players for one round.</p>
              <p><strong>Hint Remove Joker:</strong> Removes already revealed letters from the hint fields. You become immune to jokers used by other players for one round.</p>
              <p>Each joker is only usable once per game.</p>
            </div>

            <h2>Scoring</h2>
            <p>For each correct guess, you will get as many points as the time left on the timer for that round. The player with the most points at the end of the game wins.</p>

            <h2>End of Game</h2>
            <p>After the game ends, you can choose to play again or return to the main page.</p>

            <h2>Important Notes</h2>
            <ul>
              <li>Closing the tab, reloading or changing the URL will result in a logout.</li>
              <li>If you are the creator of the game and you leave the lobby or the game, the game will end for all players and everyone will be returned to the main page.</li>
              <li>If the game has already started, other players leave and only one player remains in the game, the game will end and the remaining player gets
            returned to the main page as well.</li>
            </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
            {showLayout && (
              <div className="container-search-bar col-auto p-3 pb-3 d-flex flex-column align-items-start">
                <label htmlFor="site-search">Search Users: </label>
                <input
                  type="search"
                  id="site-search"
                  placeholder="There are many..."
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  maxLength={12}
                />
                <button className="btn btn-primary mt-2 mb-2" style={{ width: "100px" }} onClick={handleSearch}>Search</button>
                {searchResult === "not found" && <p style={{ color: "red" }}>User not found</p>}
              </div>
            )}
            <div className="col-auto p-3">
              <figure className="container-avatar mt-2">
                <img src={showCorrectAvatar()} width={50} alt="" />
              </figure>
              {showLayout && (
                <button className="btn btn-primary mx-1 mb-2" style={{ width: "100px" }} onClick={() => user && navigate(`/game/users/${user.id}`)}>My Profile</button>
              )}
            </div>
            <div className="col-auto mt-5">
              <button className="btn btn-danger mx-3 mt-4 mb-2" style={{ width: "100px" }} onClick={() => logout(stompClient, navigate)}>Logout</button>
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