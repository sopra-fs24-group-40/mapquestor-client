import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import { Loader } from "@googlemaps/js-api-loader";

const InGame = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const apiOptions = {
      apiKey: "AIzaSyDKZd3AoAgVQyvXXGptbGAnpmBBzLbXG0A" // Replace with your Google Maps API key
    };

    const loader = new Loader(apiOptions);

    loader.load().then(() => {
      const streetView = new google.maps.StreetViewPanorama(
        document.getElementById("street-view"), {
          position: { lat: 37.86926, lng: -122.254811 },
          pov: { heading: 165, pitch: 0 },
          zoom: 1,
        }
      );
    }).catch(error => {
      console.error("Error loading Google Maps API:", error);
    });
  }, []);

  return (
    <div>
      <h1>In Game</h1>
      <div id="street-view" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
}

export default InGame;
