import React, { useState, useEffect } from "react";
import { api } from "helpers/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import User from "models/User";
import avatar from "../../../assets/avatar.png";

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(new User());
  const [userGames, setUserGames] = useState([]);
  const logged_id = localStorage.getItem("userId");
  const { userId } = useParams();

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await api.get(`/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    // async function fetchUserGames() {
    //   try {
    //     const response = await api.get("/users/" + localStorage.getItem("id") + "/games");
    //     setUserGames(response.data);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    fetchUser();
    // fetchUserGames();
  }, [userId]);

  // const getAvatar = () => {
  //   return user.avatar ? user.avatar : avatar;
  // };

  const checkStatus = () => {
    if (user.status === "ONLINE") {
      return "text-success";
    } else if (user.status === "OFFLINE") {
      return "text-danger";
    } else {
      return "text-warning";
    }
  }

  const checkUser = () => {
    if (logged_id === userId) {
      return true;
    } else {
      return false;
    }
  }
  console.log(userId);

  return (
    <div className="row">
      <div className="col bg-light mt-3 border rounded">
        <div className="col mt-3 d-flex justify-content-end"><select>
          <option>All Modes</option>
          <option>City-Mode</option>
          <option>Country-Mode</option>
        </select>
        <select>
          <option>All Time</option>
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
          <option>This Year</option>
        </select>
        </div>
        <h1 className="text-center">{user.username}</h1>
        <figure className="container-avatar">
          <img src={avatar} width={200} /></figure>
      <div className="text-center">
        <h2><span className={checkStatus()}>{user.status}</span> | POINTS:</h2>
        {/* <ul>
          {userGames.map((game) => (
            <li key={game.id}>
              <Link to={"/game/" + game.id}>{game.name}</Link>
            </li>
          ))}
        </ul> */}
        <button 
          className="btn btn-primary mb-3 d-flex" 
          onClick={() => navigate("/game/edit")}
          disabled={checkUser()}>Edit</button>
        <button className="btn btn-danger mb-3 d-flex" onClick={() => navigate("/game/users")}>Back</button>
      </div>
      </div>
    </div>
  );
}

export default ProfilePage;