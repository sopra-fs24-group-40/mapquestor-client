import React, { useState, useEffect, useRef } from "react";
import { api } from "helpers/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import User from "models/User";
import avatar from "../../../assets/avatar.png";
import Fett from "../../../assets/Fett.png";
import Vader from "../../../assets/Vader.png";
import C3PO from "../../../assets/C3PO.png";
import Clone from "../../../assets/Clone.png";
import Ren from "../../../assets/Ren.png";
import Stormtrooper from "../../../assets/Stormtrooper.png";

const USER_REGEX = /^.{4,}$/;
const PWD_REGEX = /^.{4,}$/;

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(new User());
  const [userGames, setUserGames] = useState([]);
  const logged_id = localStorage.getItem("id");
  const { id } = useParams();

  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");

  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || avatar);

  const [usernameError, setUsernameError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await api.get(`/users/${id}`);
        setUser(response.data);
        setUsername(response.data.username);
        setSelectedAvatar(response.data.avatar ? response.data.avatar : avatar);
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

  const handleAvatarChange = (avatar) => {
    setSelectedAvatar(avatar);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validName) {
      setErrMsg("Username should be at least 4 characters.");
      return;
    }
    
    try {
      const requestBody = JSON.stringify({ username, avatar: selectedAvatar });
      const response = await api.put(`/users/${id}`, requestBody);
      setUser({ ...user, username: username, avatar: selectedAvatar });
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

  const resetForm = () => {
    setUsername(user.username);
    setValidName(true);
    setUsernameError("");
  };

  const avatarOptions = [Fett, Vader, C3PO, Clone, Ren, Stormtrooper];

  console.log(logged_id, id)

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
        <h2><span className={checkStatus()}>{user.status}</span> | WINS:</h2>
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
            onClick={() => {
              resetForm();
              setShowEditForm(true);
            }}
            disabled={!checkUser()}>Edit</button>
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
              <div className="col mt-3 d-flex justify-content-center">
              <button className="btn btn-primary">Change Avatar</button>
              </div>
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
            <div className="avatar-options">
              {avatarOptions.map((option, index) => (
                <div key={index} className="avatar-option">
                <img
                  src={option}
                  width={200}
                  alt={`Avatar Option ${index + 1}`}
                  className={selectedAvatar === option ? "selected" : ""}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => setSelectedAvatar(option)}
                >
                  Choose
                </button>
              </div>
              ))}
            </div>
          </form>
        )}
      </div>
      </div>
    </div>
  );
}

export default ProfilePage;