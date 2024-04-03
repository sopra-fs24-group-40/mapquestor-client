import React from "react";
import "../../styles/views/login.scss";

function Login(props) {
    return (
        <>
            <div className="row justify-content-center">
                <div className="col-md-5 justify-content-center rounded-4 p-4 login-container">
                    <h1 className="text-center fw-bold">Login</h1>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" id="username" placeholder="Enter username"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Password"/>
                    </div>
                    <button type="submit" className="btn btn-danger mt-3">Login</button>

                </div>
            </div>
        </>
    );
}

export default Login;