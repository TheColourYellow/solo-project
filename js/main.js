import fetchData from './fetchData.js';
import {drawMap} from './leaflet-map.js';
import {logInUser} from './userController.js';

let coll = document.getElementsByClassName('collapsible');

for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener('click', function () {
    this.classList.toggle('active');
    var content = this.nextElementSibling;
    if (content.style.display === 'block') {
      content.style.display = 'none';
    } else {
      content.style.display = 'block';
    }
  });
}

let logInButton = document.getElementById('login-button');
let loginUsernameField = document.getElementById('username');
let logOutButton = document.getElementById('logout-button');
let logInPasswordField = document.getElementById('password');

const url = 'https://media2.edu.metropolia.fi/restaurant/api/v1';
const restaurantTable = document.getElementById('restaurant-list');
const modal = document.getElementById('modal');
const filterButton = document.getElementById('submit-button');

let restaurantSearch = document.getElementById('searchbar');
let caterer = document.getElementById('providers');
let location = document.getElementById('location');

let restaurants = [];

filterButton.addEventListener('click', async () => {
  await reloadList();
  let newList = filterRestaurants();
  createListRow(newList);
  setFavouriteRestaurant();
});

logInButton.addEventListener('click', async () => {
  let name = loginUsernameField.value;
  let password = logInPasswordField.value;
  const logInResponse = await logInUser(name, password);
  console.log(logInResponse);
  window.localStorage.setItem('token', logInResponse.token);
});

logOutButton.addEventListener('click', () => {
  window.localStorage.clear();
});

async function getRestaurants() {
  try {
    restaurants = await fetchData(`${url}/restaurants`);
    console.log(restaurants);
  } catch (error) {
    console.error(error);
  }
}

async function getMenu(id, lang) {
  try {
    return await fetchData(`${url}/restaurants/weekly/${id}/${lang}`);
  } catch (error) {
    console.log(error);
  }
}

function createListRow(array) {
  for (const restaurant of array) {
    const tr = document.createElement('tr');
    tr.addEventListener('click', async () => {
      try {
        const coursesResponse = await getMenu(restaurant._id, 'fi');
        const menuHtmlDays = createModalContent(coursesResponse.days);
        modal.innerHTML = '';
        modal.showModal();

        createModalHtml(restaurant, modal);
        modal.insertAdjacentHTML('beforeend', menuHtmlDays);
      } catch (error) {
        console.log(error);
      }
    });
    populateRow(restaurant, tr);
    restaurantTable.appendChild(tr);
  }
}

function populateRow(theRestaurant, row) {
  const nameTd = document.createElement('td');
  const distanceTd = document.createElement('td');
  nameTd.innerText = theRestaurant.name;
  distanceTd.innerText = theRestaurant.distance;
  row.append(nameTd, distanceTd);
}

function createModalHtml(restaurant, modal) {
  const nameH3 = document.createElement('h3');
  nameH3.innerText = restaurant.name;
  const addressP = document.createElement('p');
  addressP.innerText = `${restaurant.address}, puhelin: ${restaurant.phone}`;
  const btn = document.createElement('button');
  modal.append(nameH3, addressP);
}

function filterRestaurants() {
  let filteredList = restaurants;

  filteredList =
    caterer.value.length > 0
      ? restaurants.filter((item) => item.company === caterer.value)
      : filteredList;
  filteredList =
    location.value.length > 0
      ? restaurants.filter((item) => item.company === location.value)
      : filteredList;

  if (sorting.value === 'alphabet') {
    filteredList.sort(function (a, b) {
      return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
    });
  }
  if (sorting.value === 'distance') {
    filteredList.sort(function (a, b) {
      return a.distance - b.distance;
    });
  } else {
    filteredList;
  }

  filteredList =
    restaurantSearch.value.length > 0
      ? filteredList.filter((item) => item.name == restaurantSearch.value)
      : filteredList;
  console.log(filteredList);
  return filteredList;
}

function setFavouriteRestaurant() {
  const html = `<tr>
  <td class="favourite">
  Favourite Restaurant
  </td>
  </tr>`;
  restaurantTable.insertAdjacentHTML('afterbegin', html);
}

function createModalContent(list) {
  let html = '';
  for (let item of list) {
    html += `<h2>${item.date}</h2>`;
    for (let i = 0; i < item.courses.length; i++) {
      html += `<article class="course">
        <p><strong>${item.courses[i].name}</strong>,
        Hinta: ${item.courses[i].price},
        Allergeenit: ${item.courses[i].diets}</p>
    </article>`;
    }
  }
  return html;
}

async function reloadList() {
  while (restaurantTable.hasChildNodes()) {
    restaurantTable.removeChild(restaurantTable.firstChild);
  }
}

async function main() {
  await getRestaurants();
  drawMap(restaurants);
  createListRow(restaurants);
  setFavouriteRestaurant();
}

main();
