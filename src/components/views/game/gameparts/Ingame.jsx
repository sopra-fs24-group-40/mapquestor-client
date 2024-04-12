import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "@googlemaps/js-api-loader";

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
    <div className="row">
      <div className="col-md-6 text-center mt-5">
        <div className="container-wrap">
          <section id="leaderboard">
            <nav className="ladder-nav" >
              <div className="ladder-title">
                <h1>Leaderboard</h1>
              </div>
            </nav>
            <table id="rankings" className="leaderboard-results" width="100%">
              <thead>
              <tr>
                <th>Name</th>
                <th>Points</th>
              </tr>
              </thead>
            </table>
          </section>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h1>In Game</h1>
      <div id="street-view" style={{ width: "50%", height: "350px" }}></div>
      <div className="button-wrapper">
          <button className="individual-button" >Delay Joker</button>
          <button className="individual-button" >Hint remove Joker</button>
        </div>
    </div>
    </div>
  );
};
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
//       <h1>In Game</h1>
//       <div id="street-view" style={{ width: "50%", height: "350px" }}></div>
//       <div className="button-wrapper">
//           <button className="individual-button" >Delay Joker</button>
//           <button className="individual-button" >Hint remove Joker</button>
//         </div>
//     </div>
//   );
  
// }

export default InGame;
