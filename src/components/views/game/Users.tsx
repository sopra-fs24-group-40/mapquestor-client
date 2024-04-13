import React, { useState, useEffect } from "react";
import { api } from "helpers/api";
import { Link, useNavigate } from "react-router-dom";
import User from "models/User";

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    <div className="player username">username: {user.username}</div>
    <div className="player id">id: {user.id}</div>
  </div>
);

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

  if (users) {
    
  }

  return (
    <div className="row">
      <div className="col bg-light mt-3 border rounded">
        <h1 className="text-center p-2">All Users</h1>
        <ul>
          {users.map((user: User) => (
            <li key={user.id}>
              <Link to = {`/game/users/${user.id}`}><Player user={user} /></Link>
            </li>
          ))}
        </ul>
        <button
        className="btn btn-danger mb-3" onClick={() => navigate("/game")}>Back
      </button>
      </div>
      
    </div>
  );
};

export default Users;