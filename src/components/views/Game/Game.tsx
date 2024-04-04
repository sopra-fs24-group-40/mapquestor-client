import React from "react";

const Game = () => {

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-6 bg-white text-center mt-5">
                    <h1>Left Side</h1>
                </div>
                <div className="col-md-6 bg-white text-center mt-5">
                    <h1>Right Side</h1>
                    <button>Create Game</button>
                </div>
            </div>
        </div>
    );
};

export default Game;
