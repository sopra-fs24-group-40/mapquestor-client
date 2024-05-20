import React, { useState, useEffect, useRef } from "react";
import { api } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import User from "models/User";
import avatar from "../../../assets/avatar.png";
import Fett from "../../../assets/Fett.png";
import Vader from "../../../assets/Vader.png";
import C3PO from "../../../assets/C3PO.png";
import Clone from "../../../assets/Clone.png";
import Ren from "../../../assets/Ren.png";
import Stormtrooper from "../../../assets/Stormtrooper.png";
import { Spinner } from "../game/gameparts/Spinner.jsx";
 
const USER_REGEX = /^.{4,}$/;
const PWD_REGEX = /^.{4,}$/;
 
function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(new User());
  const logged_id = localStorage.getItem("id");
  const { id } = useParams();
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || avatar);
  const [usernameError, setUsernameError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showUsernameEditForm, setShowUsernameEditForm] = useState(false);
  const [showAvatarEditForm, setShowAvatarEditForm] = useState(false);
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0);
  const avatarOptions = [Fett, Vader, C3PO, Clone, Ren, Stormtrooper];
 
  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      try {
        const response = await api.get(`/users/${id}`);
        setUser(response.data);
        setUsername(response.data.username);
        setSelectedAvatar(response.data.avatar ? response.data.avatar : avatar);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
 
    const intervalId = setInterval(fetchUser, 10000);
 
    return () => clearInterval(intervalId);
  }, [id]);
 
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft" && currentAvatarIndex > 0) {
        setCurrentAvatarIndex(currentAvatarIndex - 1);
      } else if (event.key === "ArrowRight" && currentAvatarIndex < avatarOptions.length - 1) {
        setCurrentAvatarIndex(currentAvatarIndex + 1);
      }
    };
 
    window.addEventListener("keydown", handleKeyDown);
 
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentAvatarIndex, avatarOptions.length]);
 
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value.length < 4) {
      setValidName(false);
      setUsernameError("Username should be at least 4 characters.");
    } else {
      setValidName(true);
      setUsernameError("");
      setErrMsg("");
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
 
  const handleUsernameEditSubmit = async (e) => {
    e.preventDefault();
    if (!validName) {
      setErrMsg("Username should be at least 4 characters.");
      return;
    }
    
    try {
      const requestBody = JSON.stringify({ username });
      const response = await api.put(`/users/${id}`, requestBody);
      setUser({ ...user, username: username });
      localStorage.setItem("username", username);
      setShowUsernameEditForm(false);
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
 
  const handleAvatarEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const requestBody = JSON.stringify({ avatar: selectedAvatar });
      const response = await api.put(`/users/${id}`, requestBody);
      setUser({ ...user, avatar: selectedAvatar });
      localStorage.setItem("avatar", selectedAvatar);
      setShowAvatarEditForm(false);
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
  }
 
  const showCorrectAvatar = () => {
    if(checkUser()) {
      const image = localStorage.getItem("avatar");
      return resolveAvatar(image);
    }
    return resolveAvatar(user.avatar);
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
 
  return (
    <div className="row">
      <div className="col bg-light mt-3 border rounded">
        {isLoading ? (
          <Spinner />
        ) : (
          <>
        <div className="text-center">
        <h1 className="text-center">{user.username}</h1>
        {checkUser() && (
        <button
          className="btn btn-primary mb-3 align-item-center btn-sm"
          onClick={() => setShowUsernameEditForm(true)}
          disabled={!checkUser()}
        >
          Edit Username
        </button>
        )}
        <p className="text-center">#{user.id}</p>
        </div>
        <div className="text-center">
        <figure className="container-avatar">
          <img src={showCorrectAvatar()} width={200} /></figure>
          {checkUser() && (
          <button
          className="btn btn-primary mb-3 align-item-center btn-sm"
          onClick={() => setShowAvatarEditForm(true)}
          disabled={!checkUser()}
        >
          Edit Avatar
        </button>
        )}
      </div>
      <div className="text-center">
        <h2><span className={checkStatus()}>{user.status}</span> | WINS: {user.wonGames}</h2>
        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-danger mb-3 d-flex" onClick={() => navigate("/game/users")}>Back</button>
        </div>
      </div>
      <div className="text-center">
        {showUsernameEditForm && (
          <>
          <form onSubmit={handleUsernameEditSubmit}>
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
                  maxLength={20}
                />
                {!validName && <p id="uidnote" className={userFocus ? "instructions" : "offscreen"}>{usernameError}</p>}
            </div>
            <button
                className="btn btn-primary mb-3 float-start"
                onClick={() => handleUsernameEditSubmit}>Save</button>
          </form>
              <button
              className="btn btn-danger mb-3 float-end"
              onClick={() => {
                setShowUsernameEditForm(false)
                setErrMsg("");
              }}>Exit</button>
              </>
        )}
        {showAvatarEditForm && (
          <form onSubmit={handleAvatarEditSubmit}>
            <div className="avatar-options">
              <img
                src={avatarOptions[currentAvatarIndex]}
                width={200}
                alt={"Selected Avatar"}
                className={currentAvatarIndex === selectedAvatar ? "selected" : ""}
              />
            </div>
            <button
                className="btn btn-primary"
                onClick={() => setSelectedAvatar(currentAvatarIndex)}>
                Choose
              </button>
              <p>←/→ to navigate</p>
            <div>
              <button
                className="btn btn-danger mb-3 float-end"
                onClick={() => setShowAvatarEditForm(false)}>Exit</button>
            </div>
          </form>
        )}
            </div>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <div className="row">
              <div className="col-6">
              </div>
              <div className="col-6">
              </div>
            </div>
      </>
        )}
      </div>
    </div>
  );
}
 
export default ProfilePage;