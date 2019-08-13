import axios from 'axios';

const eventURL = "http://localhost:8080/sky/event";
const queryURL = "http://localhost:8080/sky/cloud";

function encodeQueryData(data) {
  let ret = [];
  for (let d in data){
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  }
  return ret.join('&');
}

export function customEvent(eci, domain, type, attributes, eid) {
  eid = eid ? eid : "customEvent";
  const attrs = encodeQueryData(attributes);
  return axios.post(`${eventURL}/${eci}/${eid}/${domain}/${type}?${attrs}`);
}

export function customQuery(eci, ruleset, funcName, params){
  const parameters = encodeQueryData(params);
  return axios.get(`${queryURL}/${eci}/${ruleset}/${funcName}?${parameters}`);
}

export const databaseECI = "KpDEHSGj8oRiEfmNWf5Bfq";
