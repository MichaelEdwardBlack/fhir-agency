import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { customEvent, databaseECI } from '../../apis';
import './register.css';

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      agentType: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0
        && this.state.password.length > 0
        && this.state.agentType.length > 0;
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.validateForm()) {
      let promise = customEvent(
        databaseECI,
        "user",
        "register",
        {
          "username": this.state.email,
          "password": this.state.password,
          "agentType": this.state.agentType,
        },
        "fhir_agent_register"
      ) //(eci, domain, type, attributes, eid) {
      promise.then((resp) => {
        let response = resp.data.directives[0].options
        console.log(resp.data);
        if (response.status_code === 200) {
          // ok response
          localStorage.setItem("auth_token", response.auth_token)
        }
        else {
          // error response
          console.error(response.message);
        }
      });
    }
  }

  render() {
    let { email, password, agentType } = this.state
    return (
      <div className="Register">
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              value={email}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              value={password}
              onChange={this.handleChange}
              type="password"
            />
          </Form.Group>
          <Form.Group className="radioButtonGroup">
            <Form.Label>Are you a Patient or Practitioner?</Form.Label>
              <Button
                size="lg"
                variant={agentType === "patient" ? "primary" : "secondary"}
                onClick={() => {this.setState({ agentType: "patient" })}}>
                Patient
              </Button>{'   '}
              <Button
                size="lg"
                variant={agentType === "practitioner" ? "primary" : "secondary"}
                onClick={() => {this.setState({ agentType: "practitioner" })}}>
                Practitioner
              </Button>
          </Form.Group>
          <Button
            block
            size="lg"
            disabled={!this.validateForm()}
            type="submit">
            Create My Agent
          </Button>
        </Form>
      </div>
    );
  }
}

export default RegistrationForm;
