ruleset user_server {
  meta {
    shares __testing, isValidAuthToken, findCredential
  }
  global {
    __testing = { "queries":
      [ { "name": "__testing" }
      //, { "name": "entry", "args": [ "key" ] }
      ] , "events":
      [ //{ "domain": "d1", "type": "t1" }
      //, { "domain": "d2", "type": "t2", "attrs": [ "a1", "a2" ] }
      ]
    }
    getCredential = function(username) {
      ent:credentials{username}
    }
    validateLogin = function(username, password) {
      cred = ent:credentials{username};
      (not cred) => false |
      (cred{"id"} != username) => false |
      (cred{"secret"} != password) => false |
      true
    }
    isValidAuthToken = function(auth_token) {
      cred = findCredential(auth_token);
      (not cred) => false | cred{["auth_token", "active"]}
    }
    findCredential = function(auth_token) {
      ent:credentials.filter(function(x) {
        x{["auth_token", "value"]} == auth_token
      }).values()[0]
    }
    response401 = {
      "name": "Unauthorized",
      "status_code": 401,
      "message": "User may not have logged in or does not have the permissions to view this page"
    }
    response403 = {
      "name": "Forbidden",
      "status_code": 403,
      "message": "User does not have permissions to view this page"
    }
    response404 = {
      "name": "Not Found",
      "satus_code": 404,
      "message": "Could not find page or resource for your request",
      "messageFun": "This is not the web page you're looking for"
    }
  }

//
// handle route /register
//
  rule user_register_initialize {
    select when user register
    fired {
      ent:credentials := {} if not ent:credentials;
    }
  }
  rule user_register_reminder {
    select when user register
    pre {
      username = event:attr("username")
      credential = getCredential(username)
    }
    if credential then
      send_directive("conflict", {
        "status_code"  : 409,
        "message": "Unavailable username"
      });
    fired { last }
  }
  rule user_register {
    select when user register
    pre {
      username = event:attr("username")
      password = event:attr("password")
      new_credential = {
        "id": username,
        "secret": password,
        "auth_token": {
          "value": random:uuid(),
          "active": true
        }
      }
    }
    send_directive("ok", {
        "status_code": 200,
        "auth_token" : new_credential{["auth_token", "value"]}
      });
    fired {
      ent:credentials{username} := new_credential
    }
  }

  rule user_login_check {
    select when user login
    pre {
      username = event:attr("username")
      password = event:attr("password")
      credential = getCredential(username)
    }
    if not credential then
    send_directive(response401{"name"}, response401)
    fired { last }
  }
  rule user_login {
    select when user login
    pre {
      username = event:attr("username")
      password = event:attr("password")
      credential = getCredential(username).put(["auth_token", "active"], true)
      valid = validateLogin(username, password)
    }
    if valid then send_directive("ok", {
        "status_code": 200,
        "auth_token" : credential{["auth_token", "value"]},
        "location_header" : "localhost:3000/patient" // should be added to the http response header
      });
    fired {
      ent:credentials{username} := credential
    }
  }

// handle token expiration from /login or /register
  rule schedule_token_expiration {
    select when user login or user register
    pre {

    }
    fired {
      schedule user event "token_expired" at time:add(time:now(), {"hours": 1})
        attributes event:attrs
    }
  }
  rule token_expired {
    select when user token_expired
    pre {
      username = event:attr("username")
      credential = getCredential(username).put(["auth_token", "active"], false)
    }
  }

//
// handle route /authorize
//
  rule user_authorize {
    select when user authorize
    pre {
      headers = event:attrs{"_headers"}.klog("headers!")
      auth_token = headers{"authorization"} || headers{"Authorization"}
      valid = isActiveAuthToken(auth_token)
    }
    if valid then send_directive("ok", {
        "status_code": 200,
        "auth_token" : credential{["auth_token", "value"]},
        "location_header" : "localhost:3000/patient" // should be added to the http response header
      });
  }
//
// handle route /connections
//
  rule validate_authorization {
    select when any 1 (user connections,
                      user accept_invitation,
                      user remove_connection)
    pre {
      headers = event:attrs{"_headers"}.klog("headers!")
      auth_token = headers{"authorization"} || headers{"Authorization"}
      valid = isActiveAuthToken(auth_token)
    }
    if not valid then send_directive("Unauthorized", response401)
    fired { last }
  }
  rule get_connections {
    select when user connections

  }
  rule add_connection {
    select when user accept_connection
  }
}
