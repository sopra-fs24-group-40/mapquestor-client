const countries = [
  { name: "France", location: "Eiffel Tower, Paris", latitude: 48.8584, longitude: 2.2945 },
  { name: "Germany", location: "Brandenburg Gate, Berlin", latitude: 52.5163, longitude: 13.3777 },
  { name: "Italy", location: "Colosseum, Rome", latitude: 41.8902, longitude: 12.4922 },
  { name: "Spain", location: "Sagrada Familia, Barcelona", latitude: 41.4036, longitude: 2.1744 },
  { name: "United Kingdom", location: "Big Ben, London", latitude: 51.5007, longitude: -0.1246 },
  { name: "Russia", location: "Red Square, Moscow", latitude: 55.7539, longitude: 37.6208 },
  { name: "Netherlands", location: "Keukenhof Gardens, Lisse", latitude: 52.2707, longitude: 4.5531 },
  { name: "Switzerland", location: "Matterhorn, Zermatt", latitude: 45.9767, longitude: 7.6583 },
  { name: "Austria", location: "Schönbrunn Palace, Vienna", latitude: 48.1780, longitude: 16.3128 },
  { name: "Sweden", location: "Gamla Stan, Stockholm", latitude: 59.3257, longitude: 18.0719 },
  { name: "Norway", location: "Bryggen, Bergen", latitude: 60.3976, longitude: 5.3221 },
  { name: "Denmark", location: "Nyhavn, Copenhagen", latitude: 55.6802, longitude: 12.5890 },
  { name: "Greece", location: "Acropolis of Athens", latitude: 37.9715, longitude: 23.7262 },
  { name: "Portugal", location: "Belém Tower, Lisbon", latitude: 38.6916, longitude: -9.2159 },
  { name: "Belgium", location: "Grand Place, Brussels", latitude: 50.8467, longitude: 4.3525 },
  { name: "Poland", location: "Wawel Castle, Kraków", latitude: 50.0540, longitude: 19.9355 },
  { name: "Czech Republic", location: "Charles Bridge, Prague", latitude: 50.0865, longitude: 14.4110 },
  { name: "Hungary", location: "Chain Bridge, Budapest", latitude: 47.4994, longitude: 19.0429 },
  { name: "Finland", location: "Helsinki Cathedral", latitude: 60.1699, longitude: 24.9520 },
  { name: "Ireland", location: "Cliffs of Moher", latitude: 52.9719, longitude: -9.4309 },
  { name: "Romania", location: "Bran Castle, Brasov", latitude: 45.5149, longitude: 25.3677 },
  { name: "Turkey", location: "Hagia Sophia, Istanbul", latitude: 41.0082, longitude: 28.9795 },
  { name: "Ukraine", location: "Saint Sophia's Cathedral, Kiev", latitude: 50.4526, longitude: 30.5149 },
  { name: "Serbia", location: "Belgrade Fortress, Belgrade", latitude: 44.8231, longitude: 20.4489 },
  { name: "Croatia", location: "Plitvice Lakes National Park", latitude: 44.8654, longitude: 15.5820 },
  { name: "Bulgaria", location: "Rila Monastery", latitude: 42.1333, longitude: 23.3499 },
  { name: "Slovakia", location: "Spiš Castle, Spišské Podhradie", latitude: 48.9953, longitude: 20.7560 },
  { name: "Lithuania", location: "Hill of Crosses, Šiauliai", latitude: 55.2989, longitude: 23.8824 },
  { name: "Latvia", location: "Old Town Riga", latitude: 56.9496, longitude: 24.1052 },
  { name: "Estonia", location: "Tallinn Old Town", latitude: 59.4370, longitude: 24.7536 },
  { name: "Slovenia", location: "Lake Bled", latitude: 46.3683, longitude: 14.1133 },
  { name: "Montenegro", location: "Kotor Old Town", latitude: 42.4247, longitude: 18.7712 },
  { name: "Macedonia", location: "Ohrid Old Town", latitude: 41.1117, longitude: 20.8027 },
  { name: "Luxembourg", location: "Old Town, Luxembourg City", latitude: 49.6116, longitude: 6.1319 },
  { name: "Malta", location: "Valletta Waterfront", latitude: 35.8989, longitude: 14.5146 },
  { name: "Andorra", location: "Vallnord Ski Resort, La Massana", latitude: 42.5449, longitude: 1.5148 },
  { name: "San Marino", location: "Monte Titano", latitude: 43.9361, longitude: 12.4461 },
  { name: "Liechtenstein", location: "Vaduz Castle", latitude: 47.1415, longitude: 9.5215 },
  { name: "Monaco", location: "Monte Carlo Casino", latitude: 43.7396, longitude: 7.4270 },
  { name: "Vatican City", location: "St. Peter's Basilica", latitude: 41.9022, longitude: 12.4533 },
];

const countries2 = [
  { name: "France", capital: "Paris", latitude: 48.8566, longitude: 2.3522 },
  { name: "Germany", capital: "Berlin", latitude: 52.5200, longitude: 13.4050 },
  { name: "Italy", capital: "Rome", latitude: 41.9028, longitude: 12.4964 },
  { name: "Spain", capital: "Madrid", latitude: 40.4168, longitude: -3.7038 },
  { name: "United Kingdom", capital: "London", latitude: 51.5074, longitude: -0.1278 },
  { name: "Russia", capital: "Moscow", latitude: 55.7558, longitude: 37.6176 },
  { name: "Netherlands", capital: "Amsterdam", latitude: 52.3676, longitude: 4.9041 },
  { name: "Switzerland", capital: "Bern", latitude: 46.9480, longitude: 7.4474 },
  { name: "Austria", capital: "Vienna", latitude: 48.2082, longitude: 16.3738 },
  { name: "Sweden", capital: "Stockholm", latitude: 59.3293, longitude: 18.0686 },
  { name: "Norway", capital: "Oslo", latitude: 59.9139, longitude: 10.7522 },
  { name: "Denmark", capital: "Copenhagen", latitude: 55.6761, longitude: 12.5683 },
  { name: "Greece", capital: "Athens", latitude: 37.9838, longitude: 23.7275 },
  { name: "Portugal", capital: "Lisbon", latitude: 38.7223, longitude: -9.1393 },
  { name: "Belgium", capital: "Brussels", latitude: 50.8503, longitude: 4.3517 },
  { name: "Poland", capital: "Warsaw", latitude: 52.2297, longitude: 21.0122 },
  { name: "Czech Republic", capital: "Prague", latitude: 50.0755, longitude: 14.4378 },
  { name: "Hungary", capital: "Budapest", latitude: 47.4979, longitude: 19.0402 },
  { name: "Finland", capital: "Helsinki", latitude: 60.1695, longitude: 24.9354 },
  { name: "Ireland", capital: "Dublin", latitude: 53.3498, longitude: -6.2603 },
  { name: "Romania", capital: "Bucharest", latitude: 44.4268, longitude: 26.1025 },
  { name: "Turkey", capital: "Ankara", latitude: 39.9334, longitude: 32.8597 },
  { name: "Ukraine", capital: "Kyiv", latitude: 50.4501, longitude: 30.5234 },
  { name: "Serbia", capital: "Belgrade", latitude: 44.7866, longitude: 20.4489 },
  { name: "Croatia", capital: "Zagreb", latitude: 45.8150, longitude: 15.9819 },
  { name: "Bulgaria", capital: "Sofia", latitude: 42.6977, longitude: 23.3219 },
  { name: "Slovakia", capital: "Bratislava", latitude: 48.1486, longitude: 17.1077 },
  { name: "Lithuania", capital: "Vilnius", latitude: 54.6872, longitude: 25.2797 },
  { name: "Latvia", capital: "Riga", latitude: 56.9496, longitude: 24.1052 },
  { name: "Estonia", capital: "Tallinn", latitude: 59.4370, longitude: 24.7536 },
  { name: "Slovenia", capital: "Ljubljana", latitude: 46.0569, longitude: 14.5058 },
  { name: "Montenegro", capital: "Podgorica", latitude: 42.4304, longitude: 19.2594 },
  { name: "Macedonia", capital: "Skopje", latitude: 41.9973, longitude: 21.4280 },
  { name: "Luxembourg", capital: "Luxembourg City", latitude: 49.6116, longitude: 6.1319 },
  { name: "Malta", capital: "Valletta", latitude: 35.8989, longitude: 14.5146 },
  { name: "Andorra", capital: "Andorra la Vella", latitude: 42.5063, longitude: 1.5218 },
  { name: "San Marino", capital: "San Marino", latitude: 43.9424, longitude: 12.4578 },
  { name: "Liechtenstein", capital: "Vaduz", latitude: 47.1410, longitude: 9.5209 },
  { name: "Monaco", capital: "Monaco", latitude: 43.7384, longitude: 7.4246 },
  { name: "Vatican City", capital: "Vatican City", latitude: 41.9029, longitude: 12.4534 },
];

export function getRandomCountry() {
  return countries2[Math.floor(Math.random() * countries2.length)];
}


