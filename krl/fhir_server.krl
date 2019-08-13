ruleset fhir.server {
  meta {
    shares __testing, patients, getResource
  }
  global {
    __testing =  {
      "queries": [
                { "name": "__testing" },
                { "name": "patients" },
                { "name": "getResource", "args": [ "type", "id", "vid" ] }
      ],
       "events": [
                { "domain": "fhir", "type": "register",
                   "attrs": [ "username", "password", "redirect_uri", "patient_uri","patient_img","patient_rids" ] },
                { "domain": "fhir", "type": "authorize", "attrs": [ "patient_id", "redirect_uri" ] },
                { "domain": "fhir", "type": "test" }
      ]
    }
    getPatient = function(patient_id) {
      ent:patients{patient_id}
    }
    patients = function() {
      ent:patients
    }
    getCredential = function(username) {
      ent:credentials.filter(function(v,k) {
        v{"username"} == username
      }).values()[0]
      // credential = {
      //   "username"  : username,
      //   "password"  : password,
      //   "id"        : id,
      //   "auth_token": {
      //     "value": random:uuid(),
      //     "type": "Basic",
      //     "active": true
      //   }
      // }
    }
    validateLogin = function(username, password) {
      credential = getCredential(username);
      credential{"username"} == username &&
      credential{"password"} == password
    }
    requestResource = function(_headers, type, id, vid) {
      headers = event:attr("_headers") || _headers;
      client_auth_token = headers{"Authorization"} || headers{"authorization"};
      server_auth_token = ent:credentials{[id, "auth_token"]};
      (not client_auth_token) => response401 |
      (client_auth_token != server_auth_token{"value"}) => response403 |
      (server_auth_token{"active"}) => getResource(type.lc(), id, vid) |
      response404
    }
    getResource = function(type, id, vid) {
      type == "patient" => ent:patients{id} |
      page404.put("message", "Currently does not support resources types other than 'Patient'")
    }
    response401 = {
      "name": "Unauthorized",
      "status_code": 401,
      "message": "User may not have logged in or does not have the permissions to view the resource"
    }
    response403 = {
      "name": "Forbidden",
      "status_code": 403,
      "message": "User does not have permissions to view specified resource"
    }
    response404 = {
      "name": "Not Found",
      "satus_code": 404,
      "message": "Could not find page or resource for your request",
      "messageFun": "This is not the web page you're looking for"
    }

    patientResourceTemplate = function() {
      identifier          = {
        "use"   : "usual",
        "type"  : {
          "coding" : {
            "system" : "", // uri of the terminology system
            "code" : "", // symbol in syntax defined by the system
            "display" : "", // representation defined by the system
            "userSelected": false // if this coding was chosen directly by the user
          },
          "text": "" // plain text representation of the concept
        },
        "system": "" ,// the namespace for the identifier value
        "value" : "",
        "period": {
          "start": time:now(),
          "end": ""
        },
        "assigner": "sovrin.org"
      };
      name                = []; // array of objects
      telecom             = []; // array of objects
      birthDate           = "";
      address             = []; // array of objects
      maritalStatus       = "";
      contact             = []; // array of objects
      communication       = []; // array of objects
      generalPractitioner = []; // array of objects
      new_resource        = {
        "resourceType"  : "Patient",
        "identifier"    : identifier,
        "active"        : true,
        "name"          : name,
        "telecom": telecom,
        "gender":    gender,
        "birthDate": birthDate,
        "deceasedBoolean": false,
        "deceasedDateTime": "",
        "address": address,
        "maritalStatus": maritalStatus,
        "multipleBirthBoolean": false,
        "multipleBirthInteger": 0,
        "photo" : [], // array of objects
        "contact": contact,
        "communication": communication,
        "generalPractitioner": generalPractitioner,
        "managingOrganization": {},
        "link": [] // array of objects
      };
      new_resource
    }
  }

  rule test {
    select when fhir test
    pre {
      attrs = event:attrs{"_headers"}.klog("headers!")
    }
  }
//
// handle route /register
//
  rule fhir_register_initialize {
    select when fhir register
    fired {
      ent:patients := {} if not ent:patients;
      ent:credentials := {} if not ent:credentials;
    }
  }
  rule fhir_register_reminder {
    select when fhir register
    pre {
      username = event:attr("username")
      username_taken = getCredential(username)
    }
    if username_taken then
      send_directive("conflict", {
        "status_code"  : 409,
        "message": "Unavailable Username"
      });
    fired { last }
  }
  rule fhir_register {
    select when fhir register
    pre {
      username    = event:attr("username")
      password    = event:attr("password")
      id          = random:uuid()
      credential  = {
        "username"  : username,
        "password"  : password,
        "id"        : id,
        "auth_token": {
          "value": random:uuid(),
          "type": "Basic",
          "active": true
        }
      }
      already_registered = ent:patients >< patient_id
    }
    if not already_registered then
      send_directive("ok", {
        "status_code": 200,
        "patient_id" : id,
        "version_id" : 1,
        "auth_token" : credential{["auth_token", "value"]},
        "location_header" : "localhost:3000/patient" // should be added to the http response header
      });
    fired {
      ent:credentials{id} := credential
    }
  }
//
// handle route /patient
//
  rule fhir_patient_update {
    select when fhir patient
    pre {
      name = [{
        "use": "usual",
        "text": event:attr("firstName") + " " + event:attr("lastName"),
        "family": event:attr("lastName"),
        "given": [event:attr("firstName")].append(event:attr("middleInitial")),
        "prefix": [],
        "suffix": [],
        "period": {
          "start": time:now(),
          "end": ""
        }
      }]
      telecom = [{
          "system": "phone",
          "value": event:attr("homePhone"),
          "use": "home",
          "rank": event:attr("homePhonePriority").defaultsTo(0),
          "period": {
            "start": time:now(),
            "end": ""
          }
        },
        {
          "system": "phone",
          "value": event:attr("cellPhone"),
          "use": "mobile",
          "rank": event:attr("cellPhonePriority").defaultsTo(0),
          "period": {
            "start": time:now(),
            "end": ""
          }
        },
        {
          "system": "phone",
          "value": event:attr("workPhone"),
          "use": "work",
          "rank": event:attr("workPhonePriority").defaultsTo(0),
          "period": {
            "start": time:now(),
            "end": ""
          }
        }
      ]
      birthDate = event:attr("dob")
      address = [{}]
      maritalStatus = event:attr("maritalStatus")
      contact = [{
          "relationship": [], // array of objects
          "name": {},
          "telecom": [], // array of objects
          "address": {},
          "gender": "unknown", // different than biological sex
          "organization": {},
          "period": {
            "start": time:now(),
            "end": ""
          }
        }
      ]
      communication = [{ // language which can be used to communicate with the patient
        "language": event:attr("language").defaultsTo("en"),
        "preffered": true
      }]
      generalPractitioner = [{}]
      new_resource = patientResourceTemplate()
                      .put("name", name)
                      .put("telecom", telecom)
                      .put("birthDate", birthDate)
                      .put("address", address)
                      .put("maritalStatus", maritalStatus)
                      .put("contact", contact)
                      .put("communication", communication)
                      .put("generalPractitioner", generalPractitioner)
      already_registered = ent:patients >< patient_id
    }
    if not already_registered then
      send_directive("ok", {
        "status_code": 200,
        "patient_id" : new_resource{["identifier", "value"]},
        "version_id" : 1,
        "auth_token" : credential{["auth_token", "value"]},
        "location_header" : "localhost:3000/patient" // should be added to the http response header
      });
    fired {
      ent:patients{id} := new_patient;
      ent:credentials{id} := credential
    }
  }
//
// handle route /login
//
  rule fhir_login {
    select when fhir login
    pre {
      username = event:attr("username")
      password = event:attr("password")
      credential = getCredential(username).put(["auth_token", "active"], true)
      valid = validateLogin(username)
    }
    if valid  then
    send_directive("ok", {
        "status_code": 200,
        "auth_token" : credential{["auth_token", "value"]},
        "location_header" : "localhost:3000/patient" // should be added to the http response header
      });
    fired {
      ent:credentials{credential{"id"}} := credential
    }
  }
//
// handle route /authorize
//
  rule fhir_authorize_initialize_requests {
    select when fhir authorize
    if not ent:requests then noop()
    fired {
      ent:requests := {}
    }
  }
  rule fhir_authorize_check_patient_id {
    select when fhir authorize
    pre {
      patient_id = event:attr("patient_id")
      patient = getPatient(patient_id)
    }
    if not patient then
      send_directive("error", {"error_message": "Unknown patient " + patient_id})
    fired { last }
    else { ent:patient := patient }
  }
  rule fhir_authorize_check_redirect_uri {
    select when fhir authorize
    pre {
      redirect_uri = event:attr("redirect_uri")
    }
    if not (ent:patient{"redirect_uris"} >< redirect_uri) then
      send_directive("error", {"error_message": "Invalid redirect URI"})
    fired { clear ent:patient; last }
  }
  rule fhir_authorize_render_approve {
    select when fhir authorize
    pre {
      reqid     = random:uuid()
    }
    if true then
      send_directive("approve", {
        "patient_id": ent:patient{"patient_id"},
        "patient_name": ent:patient{"patient_name"},
        "patient_img":  ent:patient{"patient_img"},
        "reqid": reqid
      });
    fired {
      ent:requests{reqid} := event:attrs;
      clear ent:patient; last
    }
  }
//
// handle route /approve
//
  rule fhir_approve_initialize {
    select when fhir approve
    if not ent:codes then noop()
    fired { ent:codes := {} }
  }
  rule fhir_approve_check_query {
    select when fhir approve
    pre {
      reqid = event:attr("reqid")
      query = ent:requests{reqid}
    }
    if not query then
      send_directive("error", {"error": "No matching authorization request"})
    fired { last }
    else { ent:query := query }
    finally {
      ent:requests{reqid} := null
    }
  }
  rule fhir_approve_check_approval {
    select when fhir approve
    pre {
      approved = event:attr("approve") == "Approve"
    }
    if not approved then
      send_directive("respond", {
        "error": "access_denied",
        "redirect_uri": ent:query{"redirect_uri"}
      });
    fired { last; clear ent:query }
  }
  rule fhir_approve_check_response_type {
    select when fhir approve
    if ent:query{"response_type"} != "code" then
      send_directive("respond", {
        "error": "unsupported_response_type",
        "redirect_uri": ent:query{"redirect_uri"}
      })
    fired { last; clear ent:query }
  }
  rule fhir_approve_supply_code {
    select when fhir approve
    pre {
      code = random:uuid()
      owner_id = event:attr("owner_id")
    }
    send_directive("respond", {
      "code": code,
      "state": ent:query{"state"},
      "redirect_uri": ent:query{"redirect_uri"}
    })
    fired {
      ent:codes{code} := { "request": ent:query, "owner_id": owner_id };
      clear ent:query;
      last
    }
  }
//
// handle route /token
//
  rule fhir_token_check_patient_id {
    select when fhir token
    pre {
      patient_id = event:attr("patient_id")
      patient = getPatient(patient_id)
    }
    if not patient then
      send_directive("error", {"statusCode": 401, "message": "invalid_patient"})
    fired { last }
    else { ent:patient := patient }
  }
  rule fhir_token_check_patient_secret {
    select when fhir token
    if ent:patient{"patient_secret"} != event:attr("patient_secret") then
      send_directive("error", {"statusCode": 401, "message": "invalid_patient"})
    fired { last; clear ent:patient }
  }
  rule fhir_token_check_grant_type {
    select when fhir token
    if event:attr("grant_type") != "authorization_code" then
      send_directive("error", {"statusCode": 400, "message": "unsupported_grant_type"})
    fired { last; clear ent:patient }
  }
  rule fhir_token_check_code {
    select when fhir token
    pre {
      code = ent:codes{event:attr("code")}
    }
    if not code then
      send_directive("error", {"statusCode": 400, "message": "invalid_grant"})
    fired { last; clear ent:patient }
    else { ent:code := code}
    finally { ent:codes{event:attr("code")} := null }
  }
  rule fhir_token_check_code_patient_id {
    select when fhir token
    if ent:code{["request","patient_id"]} != ent:patient{"patient_id"} then
      send_directive("error", {"statusCode": 400, "message": "invalid_grant"})
    fired { last; clear ent:code; clear ent:patient }
  }
  rule fhir_token_access_token {
    select when fhir token
    pre {
      patient_id = ent:patient{"patient_id"}
      patient_rids = (ent:patient{"patient_rids"}).split(re#;#)
      owner_id = ent:code{"owner_id"}.klog("owner_id in fhir_token_access_token");
    }
    every {
      engine:newChannel(owner_id, patient_id, "fhir") setting(new_channel) //HEY !!!!! TODO this should use wrangler and not engine!!!
      engine:installRuleset(owner_id,patient_rids)
      event:send(
        { "eci": new_channel{"id"},
          "domain": "wrangler", "type": "ruleset_added",
          "attrs": ({
           "rids": patient_rids
          })
      });
      send_directive("ok", {"access_token": new_channel{"id"}, "token_type": "Bearer"})
    }
    fired {
      last; clear ent:code; clear ent:patient
    }
  }
}
