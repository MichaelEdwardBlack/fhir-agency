import {
  LOGIN_REQUEST,
  LOGIN_RESPONSE,
  REGISTER_REQUEST,
  REGISTER_RESPONSE,
  AUTHORIZE_RESPONSE,
  LOGOUT
} from '../actions';

export const initialState = {
  isLoggedIn: false,
  currentUser: "",
  authToken: {
    value: "",
    active: false
  },
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        currentUser: action.username
      })
    case LOGIN_RESPONSE:
      localStorage.setItem('auth_token', action.response.auth_token);
      return Object.assign({}, state, {
        isLoggedIn: true,
        authToken: {
          value: action.response.auth_token,
          active: true
        }
      })
    case REGISTER_REQUEST:
      return Object.assign({}, state, {
        currentUser: action.username
      })
    case REGISTER_RESPONSE:
      localStorage.setItem('auth_token', action.response.auth_token);
      return Object.assign({}, state, {
        isLoggedIn: true,
        authToken: {
          value: action.response.auth_token,
          active: true
        }
      })
    case AUTHORIZE_RESPONSE:
      return Object.assign({}, state, {
        currentUser: action.response.username,
        isLoggedIn: true,
        authToken: {
          value: action.response.auth_token,
          active: true
        }
      })
    case LOGOUT:
      return initialState
    default:
      return initialState
  }
}

export default reducer;
