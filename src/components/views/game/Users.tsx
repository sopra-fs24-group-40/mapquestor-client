import React, { useState, useEffect } from "react";
import { api } from "helpers/api";
import { Link, useNavigate } from "react-router-dom";
import User from "models/User";
import "../../../styles/views/users.scss";
import { Spinner } from "./gameparts/Spinner.jsx";
 
const getStatusColor = (status) => {
  if (status === "ONLINE") {
    return "text-success";
  } else if (status === "OFFLINE"){
    return "text-danger"
  } else {
    return "text-warning"
  }
};
 
const Player = ({ user }: { user: User }) => {
 
  const statusColorClass = getStatusColor(user.status);
  
  return (
    <div className="player container">
      <div className="d-flex align-items-center">
        <Link
          to={`/game/users/${user.id}`}
          className="text-decoration-none">
          <span className={`fs-4 ${statusColorClass} font-weight-bold`}>
            {user.username}
          </span>
        </Link>
    </div>
  </div>
  );
};
 
function Users() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
 
  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
 
    fetchUsers();
 
    const intervalId = setInterval(fetchUsers, 5000);
 
    return () => clearInterval(intervalId);
  }, []);
 
  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5 bg-gray rounded">
        <h1 className="text-center mt-2">Users</h1>
        <div className="bg-light p-2 mx-1 mb-3">
          <div className="d-flex flex-column align-items-center" style={{ maxHeight: "270px", overflowY: "auto" }}>
            {isLoading ? (
              <Spinner />
            ) : (
              users.map((user: User) => (
                <div key={user.id} className="text-center">
                  <Link to={`/game/users/${user.id}`} className="text-decoration-none">
                    <Player user={user} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="d-flex justify-content-center mb-3">
          <button className="btn btn-danger" style={{ width: "125px" }} onClick={() => navigate("/game")}>Back</button>
        </div>
      </div>
    </div>
  );

};
 
export default Users;