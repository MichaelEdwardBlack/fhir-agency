import { customEvent, databaseECI } from '../apis';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
function loginRequest(username, password) {
  return {
    type: LOGIN_REQUEST,
    username: username,
    password: password
  }
}

export const LOGIN_RESPONSE = 'LOGIN_RESPONSE';
function loginResponse(response) {
  return {
    type: LOGIN_RESPONSE,
    response: response.data.directives[0].options,
    receivedAt: Date.now()
  }
}

export function login(username, password) {
  return function(dispatch) {
    dispatch(loginRequest(username, password))

    return customEvent(
      databaseECI,
      "user",
      "login",
      { username, password },
      "fhir_client"
    ).then(
      response => dispatch(loginResponse(response)),
      error => console.log('An error occured while logging in', error)
    );
  }
}

export const REGISTER_REQUEST = 'REGISTER_REQUEST';
function registerRequest(username, password, agentType) {
  return {
    type: REGISTER_REQUEST,
    username: username,
    password: password,
    agentType: agentType
  }
}

export const REGISTER_RESPONSE = 'REGISTER_RESPONSE';
function registerResponse(response) {
  return {
    type: REGISTER_RESPONSE,
    response: response.data.directives[0].options,
    receivedAt: Date.now()
  }
}

export function register(username, password, agentType) {
  return function(dispatch) {
    dispatch(registerRequest(username, password, agentType))

    return customEvent(
      databaseECI,
      "user",
      "register",
      { username, password },
      "fhir_client"
    ).then(
      response => dispatch(registerResponse(response)),
      error => console.log('An error occured while registering the user', error)
    );
  }
}

export const LOGOUT = 'LOGOUT';
export function logout(username) {
  return function(dispatch) {
    return customEvent(
      databaseECI,
      "user",
      "logout",
      { username },
      "fhir_client"
    ).then(
      response => dispatch({ type: LOGOUT }),
      error => console.log('A problem happened while logging out', error)
    );
  }
}

export const AUTHORIZE_RESPONSE = 'AUTHORIZE_RESPONSE';
function authorizeResponse(response) {
  return {
    type: REGISTER_RESPONSE,
    response: response.data.directives[0].options,
    receivedAt: Date.now()
  }
}
export function authorize() {
  return function(dispatch) {
    return customEvent(
      databaseECI,
      "user",
      "authorize",
      { auth_token: localStorage.getItem("auth_token") },
      "fhir_client"
    ).then(
      response => { if (response.data.directives[0].options.status_code === 200) {
        dispatch(authorizeResponse(response))
      }},
      error => console.log('Could not authorize the user', error)
    )
  }
}
