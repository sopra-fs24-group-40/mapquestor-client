import React, { useState, useEffect } from "react";
import { api } from "helpers/api";
import { Link, useNavigate } from "react-router-dom";
import User from "models/User";
import "../../../styles/views/users.scss";

const getStatusColor = (status) => {
  if (status === "ONLINE") {
    return "text-success";
  } else {
    return "text-danger"
  }
};

const Player = ({ user }: { user: User }) => {

  
  return (
    <div className="player container">
      <div className="d-flex align-items-center">
        <Link
          to={`/game/users/${user.id}`}
          className="text-decoration-none">
          <span className={"fs-4"}>
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

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="row justify-content-center">
      <div className="col-md-4 bg-light mt-3 border rounded">
        <h1 className="text-center p-2">All Users</h1>
        <div className="d-flex flex-column align-items-center">
          {users.map((user: User) => (
            <div key={user.id}>
              <Link to={`/game/users/${user.id}`}
              className="text-decoration-none"><Player user={user} /></Link>
            </div>
          ))}
        </div>
        <button
          className="btn btn-danger mb-3" onClick={() => navigate("/game")}>Back
        </button>
      </div>

    </div>
  );
};

export default Users;