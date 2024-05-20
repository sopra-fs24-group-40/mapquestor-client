require("dotenv").config();

const config = {
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
};

module.exports = config;