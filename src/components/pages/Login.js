import React from 'react';
import Image from 'react-bootstrap/Image';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import LoginForm from '../forms/LoginForm';
import image from '../../media/login-fingerprint.jpg';

class Login extends React.Component {
  renderLogin() {
    return (
      <div>
        <Image
          style={{"position":"absolute", "zIndex":"-10", "opacity": ".2" }}
          src={image} fluid
        />
        <LoginForm />
      </div>
    );
  }
  renderConnections() {
    return (
      <Redirect to="/fhir-agency/connections" />
    );
  }
  render() {
    let { isLoggedIn } = this.props
    return (
      <div>
        { !isLoggedIn && this.renderLogin()}
        { isLoggedIn && this.renderConnections()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.isLoggedIn
  }
}

export default connect(mapStateToProps)(Login);
