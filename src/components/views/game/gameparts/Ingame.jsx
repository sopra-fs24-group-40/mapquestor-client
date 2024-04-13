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
          position: { lat: 47.3786, lng: 8.5400 },
          pov: { heading: 165, pitch: 0 },
          zoom: 1,
        }
      );
    }).catch(error => {
      console.error("Error loading Google Maps API:", error);
    });
  }, []);

  return (
    <div className="row mt-5">
      <div className="col-md-3 text-center">
        <div className="container-wrap">
          <section id="leaderboard">
            <nav className="ladder-nav">
              <div className="ladder-title">
              <h1 style={{ fontSize: '20px' }}>Leaderboard</h1>
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
      <div className="col-md-6 justify-content-center text-center">
      <h1>In Game</h1>
      <div id="street-view" style={{ width: "100%", height: "350px" }}></div>
      
      <div className="button-wrapper">
          <button className="individual-button" style={{ fontSize: '20px' }} >Delay Joker</button>
          <button className="individual-button" style={{ fontSize: '20px' }} >Hint remove Joker</button>
        </div>
    </div>
  
      <div className="col-md-3 text-center">
        <div className="container-wrap">
          <section id="leaderboard">
            <nav className="ladder-nav">
              <div className="ladder-title">
              <h1 style={{ fontSize: '28px' }}>Chat</h1>
              </div>
            </nav>
          </section>
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
