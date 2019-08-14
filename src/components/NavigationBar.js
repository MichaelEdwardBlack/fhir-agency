import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { logout } from '../actions';
import logo from '../media/fhir-agent-logo.svg';

class NavigationBar extends React.Component {
  onLogout = () => {
    this.props.logout(this.props.currentUser);
    return <Redirect to="/fhir-agency/home"/>
  }
  // https://smilecdr.com/images/partner-logos/fhir-logo.png
  // https://sovrin.org/wp-content/themes/sovrin/assets/images/logo.svg
  render() {
    const { isLoggedIn, history, location } = this.props;
    return (
      <Navbar bg="dark" variant="dark" expand="sm" fixed="top">
        <Navbar.Brand>
          <img
            onClick={() => isLoggedIn ? history.push("/fhir-agency/connections") : history.push("/fhir-agency/home")}
            src={logo}
            height="50px"
            width="50px"
            alt="Sovrin Logo"
          />
        </Navbar.Brand>
        <Nav activeKey={location.pathname} onSelect={selectedKey => history.push(selectedKey)} className="mr-auto">
          {!isLoggedIn && <Nav.Link eventKey="/fhir-agency/home">Home</Nav.Link>}
          {isLoggedIn && <Nav.Link eventKey="/fhir-agency/connections">My Connections</Nav.Link>}
        </Nav>
        <Nav activeKey={location.pathname} onSelect={selectedKey => history.push(selectedKey)} className="justify-content-end">
          {!isLoggedIn && <Nav.Link eventKey="/fhir-agency/login">Login</Nav.Link>}
          {!isLoggedIn && <Nav.Link eventKey="/fhir-agency/register">Register</Nav.Link>}
          {isLoggedIn && <Link to="/fhir-agency/home"><Button variant="outline-warning" onClick={this.onLogout}>Logout</Button></Link>}
        </Nav>
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.isLoggedIn,
    currentUser: state.currentUser
  }
}
const mapDispatchToProps = dispatch => {
  return {
    logout: (username) => {
      dispatch(logout(username))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavigationBar));
