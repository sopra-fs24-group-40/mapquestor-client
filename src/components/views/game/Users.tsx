import React, { useState, useEffect } from "react";
import { api } from "helpers/api";
import { useNavigate } from "react-router-dom";

function Users() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("/users");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setUsers(response.data);
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
        <button
        className="btn btn-danger mb-3" onClick={() => navigate("/game")}>Back
      </button>
      </div>
      
    </div>
  );
};

export default Users;