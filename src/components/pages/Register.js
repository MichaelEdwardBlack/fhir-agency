import React from 'react';
import RegistrationForm from '../forms/RegistrationForm';
import Image from 'react-bootstrap/Image';
import image from '../../media/registration-clipboard.jpg';

class Register extends React.Component {
  render() {
    return (
      <div>
      <Image
        style={{"position":"absolute", "zIndex":"-10", "opacity": ".2" }}
        src={image} fluid
      />
        <RegistrationForm />
      </div>
    );
  }
}

export default Register;
