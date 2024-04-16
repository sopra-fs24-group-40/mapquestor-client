class City {
    constructor(data = {}) {
      this.name = null;
      this.capital = null;
      this.longitude = null;
      this.latitude = null;
      Object.assign(this, data);
    }
  }
  
  export default City;