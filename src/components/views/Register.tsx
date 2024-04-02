import React from "react";

function Register(props) {

  return (
    <div className="row">
      <div className="col justify-content-center">
        <h1 className="text-center">You need to Register in order to see game</h1>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" className="form-control" id="username" placeholder="Enter username" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" id="password" placeholder="Password" />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Register</button>

      </div>
    </div>

  );
}

export default Register;