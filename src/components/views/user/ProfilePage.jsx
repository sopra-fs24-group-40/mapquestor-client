import React, { useState, useEffect, useRef } from "react";
import { api } from "helpers/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import User from "models/User";
import avatar from "../../../assets/avatar.png";

const USER_REGEX = /^.{4,}$/;
const PWD_REGEX = /^.{4,}$/;

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(new User());
  const [userGames, setUserGames] = useState([]);
  const logged_id = localStorage.getItem("userId");
  const { id } = useParams();

  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");

  const [showEditForm, setShowEditForm] = useState(false);

  const [usernameError, setUsernameError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await api.get(`/users/${id}`);
        setUser(response.data);
        setUsername(response.data.username);
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
  }, [id]);

  // const getAvatar = () => {
  //   return user.avatar ? user.avatar : avatar;
  // };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validName) {
      setErrMsg("Username should be at least 4 characters.");
      return;
    }
    
    try {
      const requestBody = JSON.stringify({ username});
      const response = await api.put(`/users/${id}`, requestBody);
      // setUser({ ...user, username: response.data.username });
      localStorage.setItem("username", username);
      setShowEditForm(false);
      setSuccess(true);
    } catch (err) {
        if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg(err.response.data.message);
      } else {
        setErrMsg("Edit failed!");
      }
      errRef.current.focus;
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value.length < 4) {
      setValidName(false);
      setUsernameError("Username should be at least 4 characters.");
    } else {
      setValidName(true);
      setUsernameError("");
    }
  };

  const checkStatus = () => {
    if (user.status === "ONLINE") {
      return "text-success";
    } else if (user.status === "OFFLINE") {
      return "text-danger";
    } else {
      return "text-warning";
    }
  };

  const checkUser = () => {
    if (logged_id === id) {
      return true;
    } else {
      return false;
    }
  };

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
        <p className="text-center">#{user.id}</p>
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
        <div className="d-flex justify-content-between align-items-center">
          <button 
            className="btn btn-primary mb-3 d-flex" 
            onClick={() => setShowEditForm(true)}
            disabled={checkUser()}>Edit</button>
          <button className="btn btn-danger mb-3 d-flex" onClick={() => navigate("/game/users")}>Back</button>
        </div>
      </div>
      <div className="text-center">
        {showEditForm && (
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={handleUsernameChange}
                required
                aria-invalid={validName ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
              />
              {!validName && <p id="uidnote" className={userFocus ? "instructions" : "offscreen"}>{usernameError}</p>}
            </div>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <hr />
            <div className="row">
              <div className="col-6">
                <button 
                className="btn btn-danger mb-3 float-start">Save</button>
              </div>
              <div className="col-6">
                <button 
                className="btn btn-danger mb-3 float-end" 
                onClick={() => setShowEditForm(false)}>Exit</button>
              </div>
            </div>
          </form>
        )}
      </div>
      </div>
    </div>
  );
}

export default ProfilePage;