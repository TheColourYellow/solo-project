const map = L.map('map');

function drawMap(array) {
  let restaurants = array;
  navigator.geolocation.getCurrentPosition(success, error);

  function success(pos) {
    const crd = pos.coords;

    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    let lat = crd.latitude;
    console.log(`Longitude: ${crd.longitude}`);
    let lon = crd.longitude;
    console.log(`More or less ${crd.accuracy} meters.`);

    map.setView([crd.latitude, crd.longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([crd.latitude, crd.longitude])
      .addTo(map)
      .bindPopup('I am here.')
      .openPopup();

    for (let restaurant of restaurants) {
      let y = restaurant.location.coordinates[0];
      let x = restaurant.location.coordinates[1];
      let marker = new L.marker([x, y]).bindPopup(restaurant.name).addTo(map);
      let distance = map.distance([lat, lon], [x, y]);
      restaurant['distance'] = (distance / 1000).toFixed(2);
    }
    console.log('imrpoved restaurants', restaurants);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
}

export {drawMap};
