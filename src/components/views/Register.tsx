import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import User from "models/User";
import { api } from "helpers/api";


const USER_REGEX = /^.{4,}$/;
const PWD_REGEX = /^.{4,}$/;


function Register(props) {

  const navigate = useNavigate();

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []); 

  useEffect(() => {
    const result = USER_REGEX.test(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestBody = JSON.stringify({ username: user, password: pwd });
      const response = await api.post("/users", requestBody);

      const new_user = new User(response.data);

      localStorage.setItem("id", new_user.id);
      localStorage.setItem("avatar", new_user.avatar);
      localStorage.setItem("token", new_user.token);
      localStorage.setItem("username", new_user.username);

      navigate("/game");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg(err.response.data.message);
      } else {
        setErrMsg("Registration Failed!");
      }
      errRef.current.focus;
    }

    setSuccess(true);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5 justify-content-center p-3 rounded login-container">
        <h1 className="text-center fw-bolder">Register</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username">Username</label>
            <input
              className="form-control"
              type="text"
              id="username"
              placeholder="How should we call you?"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              maxLength={12} 
            />
            <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
              Username has wrong format! (Needs at least 4 characters)
            </p>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">Password</label>
            <input
              className="form-control"
              type="password"
              id="password"
              placeholder="Don't tell anyone!"
              onChange={(e) => setPwd(e.target.value)}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              maxLength={20}
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
              placeholder="Just to be sure..."
              onChange={(e) => setMatchPwd(e.target.value)}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
              maxLength={20}
            />
          </div>
          <p id="confirmnote" className={matchFocus && matchPwd && !validMatch ? "instructions" : "offscreen"}>
            Passwords don&apos;t match!
          </p>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <hr />
          <div className="row">
            <div className="col-6">
              <button className="btn btn-danger mb-3" disabled={!validName || !validPwd || !validMatch}>Register</button>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <button className="btn btn-danger mb-3" onClick={() => navigate("/login")}>Back to Login</button>
              </div>
          </div>
        </form>

      </div>
    </div>

  );
}

export default Register;
