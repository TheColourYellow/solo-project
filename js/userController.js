import fetchData from './fetchData.js';

function postUser(username, password, email) {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
      email: email,
    }),
  };

  const response = fetchData(
    'https://media2.edu.metropolia.fi/restaurant/api/v1/users',
    fetchOptions
  );
  console.log(response);
  return response;
}

function logInUser(username, password) {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  };

  const response = fetchData(
    'https://media2.edu.metropolia.fi/restaurant/api/v1/auth/login',
    fetchOptions
  );
  console.log(response);
  return response;
}

function getUser(token) {
  const fetchOptions = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer: ' + token,
    },
  };

  const response = fetchData(
    'https://media2.edu.metropolia.fi/restaurant/api/v1/users/token',
    fetchOptions
  );
  console.log(response);
  return response;
}

function putUser(token, username, password, email) {
  const fetchOptions = {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer: ' + token,
    },
    body: JSON.stringify({
      username: username,
      password: password,
      email: email,
    }),
  };

  const response = fetchData(
    'https://media2.edu.metropolia.fi/restaurant/api/v1/users',
    fetchOptions
  );
  console.log(response);
  return response;
}
export {postUser, logInUser, getUser, putUser};
