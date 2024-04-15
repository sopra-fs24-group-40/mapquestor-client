import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "@googlemaps/js-api-loader";

const InGame = () => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(60); // State for timer

  useEffect(() => {
    const apiOptions = {
      apiKey: "AIzaSyDKZd3AoAgVQyvXXGptbGAnpmBBzLbXG0A", // Replace with your Google Maps API key
    };

    const loader = new Loader(apiOptions);
    
    loader.load().then(() => {
      const streetView = new google.maps.StreetViewPanorama(
        document.getElementById("street-view"), {
          position: { lat: 47.3786, lng: 8.5400 },
          pov: { heading: 165, pitch: 0 },
          zoom: 1,
        },
      );
      streetView.setOptions({
        disableDefaultUI: true,
    });
    
    }).catch(error => {
      console.error("Error loading Google Maps API:", error);
    });

    const intervalId = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(intervalId);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Calculate the number of letters in the city name
  const cityName = "Zuerich";
  const numLetters = cityName.length;

  // Create an array of div elements representing hint lines
  const hintLines = Array.from({ length: numLetters }, (_, index) => (
    <div
      key={index}
      className="hint-line"
      style={{
        width: "20px",
        height: "1px",
        backgroundColor: "black",
        margin: "10px 5px",
      }}
    ></div>
  ));

  return (
    <div className="row mt-5">
      <div className="col-md-3 text-center">
        <div className="container-wrap bg-gray">
          <section id="leaderboard">
            <nav className="ladder-nav">
              <div className="ladder-title text-center">
                <h1 style={{ fontSize: "22px" }}>Leaderboard</h1>
              </div>
            </nav>
            <table
              id="rankings"
              className="leaderboard-results"
              width="100%"
            >
              <thead>
              <tr>
              <th className="text-dark">Name</th>
              <th className="text-dark">Points</th>
              </tr>
              </thead>
            </table>
          </section>
        </div>
      </div>

      <div className="col-md-6 justify-content-center text-center bg-gray">
        <h1>In Game</h1>

        <div
          className="timer-container"
          style={{ position: "absolute" }}
        >
          Timer: {timer} seconds
        </div>

        {/* Display the hint lines */}
        <div
          className="hint-lines-container"
          style={{ display: "flex", justifyContent: "center" }}
        >
          {hintLines}
        </div>

        {/* Display the Street View */}
        <div id="street-view" style={{ width: "100%", height: "350px" }}></div>

        <div className="button-wrapper">
          <button className="individual-button" style={{ fontSize: "20px" }}>
            Delay Joker
          </button>
          <button className="individual-button" style={{ fontSize: "20px" }}>
            Hint remove Joker
          </button>
        </div>
      </div>

      <div className="col-md-3 text-center">
        <div className="container-wrap bg-gray">
          <section id="chat" className="">
            <nav className="ladder-nav">
              <div className="ladder-title">
                <h1 style={{ fontSize: "22px" }}>Chat</h1>
              </div>
            </nav>
          </section>
          <p style={{ fontSize: "20px" }}>TestChat</p>
        </div>
      </div>
    </div>
  );
};

export default InGame;