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

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState("");
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");

  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await api.get(`/users/${id}`);
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
  }, [id]);

  // const getAvatar = () => {
  //   return user.avatar ? user.avatar : avatar;
  // };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const requestBody = JSON.stringify({ username, pwd});
      await api.put(`/users/${id}`, requestBody);
      localStorage.setItem("username", username);
      setShowEditForm(false);
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
    setSuccess(true);
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
                onChange={(e) => setUsername(e.target.value)}
                required
                aria-invalid={validName ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
              />
              <p id="uidnote" className={userFocus && username && !validName ? "instructions" : "offscreen"}>
                Username has wrong format! (Needs at least 4 characters)
              </p>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Password</label>
              <input
                className="form-control"
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                required
                aria-invalid={validPwd ? "false" : "true"}
                aria-describedby="pwdnote"
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
              />
              <p id="pwdnote" className={pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"}>
                Password has wrong format! (Needs at least 4 characters)
              </p>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="confirm_pwd">Confirm password</label>
              <input
                className="form-control"
                type="password"
                id="confirm_pwd"
                value={matchPwd}
                onChange={(e) => setMatchPwd(e.target.value)}
                required
                aria-invalid={validMatch ? "false" : "true"}
                aria-describedby="confirmnote"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
              />
            </div>
            <p id="confirmnote" className={matchFocus && matchPwd && !validMatch ? "instructions" : "offscreen"}>
              Passwords don&apos;t match!
            </p>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <hr />
            <div className="row">
              <div className="col-6">
                <button 
                className="btn btn-danger mb-3 float-start"
                disabled={!validName || !validPwd || !validMatch}>Save</button>
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