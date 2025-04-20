import {postUser, logInUser, getUser, putUser} from './userController.js';

let page = document.getElementById('page-root');
let viewButton = document.getElementById('change-view');
let state = true;

let loginUsernameField = document.getElementById('username');
let logInPasswordField = document.getElementById('password');
let logInButton = document.getElementById('login-button');
let logOutButton = document.getElementById('logout-button');

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

function reloadView() {
  while (page.hasChildNodes()) {
    page.removeChild(page.firstChild);
  }
}

function setPageContent() {
  reloadView();
  if (state) {
    createUserRegister();
    state = false;
  } else {
    createUserProfile();
    state = true;
  }
}

viewButton.addEventListener('click', () => {
  setPageContent();
});

async function createUserProfile() {
  let pageContainer = document.createElement('div');
  pageContainer.setAttribute('class', 'user-settings');
  const profilePictureDiv = document.createElement('div');
  profilePictureDiv.setAttribute('class', 'user-profile');
  let userProfile = document.createElement('img');
  userProfile.src = 'https://placehold.co/100x100';
  const userProfileButton = document.createElement('button');
  userProfileButton.setAttribute('type', 'submit');
  userProfileButton.innerText = 'Change';
  profilePictureDiv.append(userProfile, userProfileButton);

  const screenNameBarLabel = document.createElement('label');
  screenNameBarLabel.setAttribute('for', 'screenname');
  const screenNameBar = document.createElement('input');
  screenNameBar.setAttribute('type', 'text');
  screenNameBar.setAttribute('id', 'screenname');
  const passwordBarLabel = document.createElement('label');
  passwordBarLabel.setAttribute('for', 'password');
  const passwordBar = document.createElement('input');
  passwordBar.setAttribute('type', 'text');
  passwordBar.setAttribute('id', 'password');
  const emailBarLabel = document.createElement('label');
  emailBarLabel.setAttribute('for', 'email');
  const emailBar = document.createElement('input');
  emailBar.setAttribute('type', 'text');
  emailBar.setAttribute('id', 'user-email');
  const submitButton = document.createElement('button');
  submitButton.setAttribute('type', 'submit');
  submitButton.setAttribute('id', 'submit-changes');
  submitButton.innerText = 'Submit Changes';
  viewButton.innerText = 'User Registration';
  try {
    let token = window.localStorage.getItem('token');
    let userResponse = await getUser(token);
    screenNameBarLabel.innerText = 'Username: ' + userResponse.username;
    emailBarLabel.innerText = 'Email: ' + userResponse.email;
  } catch (error) {
    screenNameBarLabel.innerText = 'Username';
    emailBarLabel.innerText = 'Email';
  } finally {
    passwordBarLabel.innerText = 'Password';
  }
  submitButton.addEventListener('click', async () => {
    let token = window.localStorage.getItem('token');
    let name = screenNameBar.value;
    let password = passwordBar.value;
    let email = emailBar.value;
    const logInResponse = await putUser(token, name, password, email);
    console.log(logInResponse);
  });
  pageContainer.append(
    screenNameBarLabel,
    screenNameBar,
    passwordBarLabel,
    passwordBar,
    emailBarLabel,
    emailBar,
    submitButton
  );
  page.append(profilePictureDiv, pageContainer);
}

function createUserRegister() {
  let pageContainer = document.createElement('div');
  pageContainer.setAttribute('class', 'user-register');
  const screenNameBarLabel = document.createElement('label');
  screenNameBarLabel.setAttribute('for', 'screenname');
  screenNameBarLabel.innerText = 'Screenname';
  const screenNameBar = document.createElement('input');
  screenNameBar.setAttribute('type', 'text');
  screenNameBar.setAttribute('id', 'reg-screenname');
  const passwordBarLabel = document.createElement('label');
  passwordBarLabel.setAttribute('for', 'password');
  passwordBarLabel.innerText = 'Password';
  const passwordBar = document.createElement('input');
  passwordBar.setAttribute('type', 'text');
  passwordBar.setAttribute('id', 'reg-password');
  const emailBarLabel = document.createElement('label');
  emailBarLabel.setAttribute('for', 'email');
  emailBarLabel.innerText = 'Email';
  const emailBar = document.createElement('input');
  emailBar.setAttribute('type', 'text');
  emailBar.setAttribute('id', 'reg-email');
  const submitButton = document.createElement('button');
  submitButton.setAttribute('type', 'submit');
  submitButton.setAttribute('id', 'account-creation');
  submitButton.innerText = 'Create Account';
  viewButton.innerText = 'User Profile';
  submitButton.addEventListener('click', async () => {
    let name = screenNameBar.value;
    let password = passwordBar.value;
    let email = emailBar.value;
    await postUser(name, password, email);
  });
  pageContainer.append(
    screenNameBarLabel,
    screenNameBar,
    passwordBarLabel,
    passwordBar,
    emailBarLabel,
    emailBar,
    submitButton
  );
  page.appendChild(pageContainer);
}

if (window.localStorage.getItem('token')) {
  createUserProfile();
} else {
  createUserRegister();
}
