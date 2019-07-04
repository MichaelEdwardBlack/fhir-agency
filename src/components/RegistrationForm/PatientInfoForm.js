import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

export default class RegistrationForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      validated: false,
      firstName: "",
      middleInitial: "",
      lastName: "",
      previousName: "",
      mailingAddress: "",
      apartment: "",
      city: "",
      state: "",
      zip: "",
      homePhone: "",
      cellPhone: "",
      workPhone: "",
      prefferedContactMethod: "",
      physician: "",
      dob: "",
      gender: "",
      maritalStatus: "",
      ssn: "",
      employerName: "",
      contactName: "",
      contactNumber: "",
      contactRelationship: ""
    }
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'radio' ? target.id : target.value;
    const id = target.type === 'radio' ? target.name : target.id;

    this.setState({ [id]: value });
  }


  handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    this.setState({ validated: true });
    console.log(this.state);
  }
  render() {
    const { validated, firstName, lastName, middleInitial, previousName,
            mailingAddress, apartment, city, state, zip, homePhone, cellPhone,
            workPhone, physician, dob, gender, maritalStatus, ssn, employerName,
            contactName, contactNumber, contactRelationship } = this.state;
    return (
      <Form
        noValidate
        validated={validated}
        onSubmit={e => this.handleSubmit(e)}
      >
        <Form.Row>
          <Form.Group as={Col} controlId="firstName">
            <Form.Label>First name</Form.Label>
            <Form.Control
              required
              type="text"
              value={firstName}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group as={Col} md="1" controlId="middleInitial">
            <Form.Label>M.I.</Form.Label>
            <Form.Control
              type="text"
              value={middleInitial}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="lastName">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              required
              type="text"
              value={lastName}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="previousName">
            <Form.Label>Previous Name</Form.Label>
            <Form.Control
              type="text"
              value={previousName}
              onChange={this.handleInputChange}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="mailingAddress">
            <Form.Label>Mailing Address</Form.Label>
            <Form.Control
              required
              type="text"
              value={mailingAddress}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group as={Col} md="1" controlId="apartment">
            <Form.Label>Apt #</Form.Label>
            <Form.Control
              type="text"
              value={apartment}
              onChange={this.handleInputChange}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              required
              type="text"
              value={city}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group as={Col} md="1" controlId="state">
            <Form.Label>State</Form.Label>
            <Form.Control
              required
              type="text"
              size="2"
              value={state}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="zip">
            <Form.Label>Zip Code</Form.Label>
            <Form.Control
              required
              type="number"
              value={zip}
              onChange={this.handleInputChange}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="homePhone">
            <Form.Label>Home Phone</Form.Label>
            <Form.Control
              type="tel"
              pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
              value={homePhone}
              onChange={this.handleInputChange}
            />
            <Form.Control.Feedback type="invalid">Format: 123456789</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="cellPhone">
            <Form.Label>Cell Phone</Form.Label>
            <Form.Control
              type="tel"
              pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
              value={cellPhone}
              onChange={this.handleInputChange}
            />
            <Form.Control.Feedback type="invalid">Format: 123456789</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="workPhone">
            <Form.Label>Work Phone</Form.Label>
            <Form.Control
              type="tel"
              pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
              value={workPhone}
              onChange={this.handleInputChange}
            />
            <Form.Control.Feedback type="invalid">Format: 123456789</Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <fieldset>
            <Form.Group as={Col}>
              <Form.Label as="legend">Preffered Method of Contact</Form.Label>
              <Row>
                <Form.Check
                  type="radio"
                  label="Voice"
                  name="prefferedContactMethod"
                  id="voice"
                  onChange={this.handleInputChange}
                  inline={true}
                />
                <Form.Check
                  type="radio"
                  label="Text"
                  name="prefferedContactMethod"
                  id="text"
                  onChange={this.handleInputChange}
                  inline={true}
                />
              </Row>
            </Form.Group>
          </fieldset>
          <fieldset>
            <Form.Group as={Col}>
              <Form.Label as="legend">If Voice, Select Preffered Number</Form.Label>
              <Row>
                <Form.Check
                  type="radio"
                  label="Home"
                  name="prefferedNumber"
                  id="home"
                  inline={true}
                />
                <Form.Check
                  type="radio"
                  label="Cell"
                  name="prefferedNumber"
                  id="mobile"
                  inline={true}
                />
                <Form.Check
                  type="radio"
                  label="Work"
                  name="prefferedNumber"
                  id="work"
                  inline={true}
                />
              </Row>
            </Form.Group>
          </fieldset>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="physician">
            <Form.Label>Family Physician or Pediatrician</Form.Label>
            <Form.Control
              type="text"
              value={physician}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="dob">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              value={dob}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <fieldset>
            <Form.Group as={Col} controlId="gender">
              <Form.Label as="legend">Gender</Form.Label>
              <Row>
                <Form.Check
                  type="radio"
                  label="Male"
                  name="gender"
                  id="male"
                  inline={true}
                />
                <Form.Check
                  type="radio"
                  label="Female"
                  name="gender"
                  id="female"
                  inline={true}
                />
                <Form.Check
                  type="radio"
                  label="Other"
                  name="gender"
                  id="other"
                  inline={true}
                />
              </Row>
            </Form.Group>
          </fieldset>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="maritalStatus">
            <Form.Label>Marital Status</Form.Label>
            <Form.Control as="select" value={maritalStatus} onChange={this.handleInputChange}>
              <option value="">Choose...</option>
              <option value="A">Annulled</option>
              <option value="D">Divorced</option>
              <option value="I">Interlocutory</option>
              <option value="L">Legally Separated</option>
              <option value="M">Married</option>
              <option value="P">Polygamous</option>
              <option value="S">Never Married</option>
              <option value="T">Domestic Partner</option>
              <option value="U">Unmarried</option>
              <option value="W">Widowed</option>
              <option value="UNK">Other</option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} controlId="ssn">
            <Form.Label>Social Security #</Form.Label>
            <Form.Control
              type="number"
              value={ssn}
              onChange={this.handleInputChange}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="employerName">
            <Form.Label>Employer Name</Form.Label>
            <Form.Control
              type="text"
              value={employerName}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="contactName">
            <Form.Label>Emergency Contact Name</Form.Label>
            <Form.Control
              type="text"
              value={contactName}
              onChange={this.handleInputChange}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="contactNumber">
            <Form.Label>Emergency Contact Phone #</Form.Label>
            <Form.Control
              type="tel"
              pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
              value={contactNumber}
              onChange={this.handleInputChange}
            />
            <Form.Control.Feedback type="invalid">Format: 123456789</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="contactRelationship">
            <Form.Label>Relationship to Patient</Form.Label>
            <Form.Control
              type="text"
              value={contactRelationship}
              onChange={this.handleInputChange}
            />
          </Form.Group>
        </Form.Row>
        <Button type="submit">Submit</Button>
      </Form>
    );
  }
}
