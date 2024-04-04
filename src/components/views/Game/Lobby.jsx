import React from "react";
import { useParams } from "react-router-dom";

function Lobby(props) {

  let { id } = useParams();

  return (
    <div className="row bg-white text-black mt-5">
      <div className="col-md-6">
        <h1>{id}</h1>

      </div>
      <div className="col-md-6">
        <h1>Lobby</h1>
      </div>
    </div>

  );
}

export default Lobby;