import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import picoLogo from '../media/pico-labs-logo.png';

const Footer = function() {

  return (
    <div className="footer">
      <Col>
        <h5>Interested in Learning More? Contact Us</h5>
      </Col>
      <Row>
        <Col>
          <h6>Matthew Norton</h6>
          <a href="https://www.linkedin.com/in/matt-norton">
            <i className="fa fa-linkedin-square" />
          </a>{' '}
          <a href="mailto:matthewnorton15@gmail.com">
            <i className="fa fa-envelope" aria-hidden="true" />
          </a>
        </Col>
        <Col>
          <h6>Michael Black</h6>
          <a href="https://www.linkedin.com/in/michaelblack117">
            <i className="fa fa-linkedin-square" />
          </a>{' '}
          <a href="mailto:michaelblack117@gmail.com">
            <i className="fa fa-envelope" aria-hidden="true" />
          </a>
        </Col>
      </Row>
      <Navbar className="justify-content-center" sticky="bottom">
        <Navbar.Brand href="https://sovrin.org">
          <img
            src="https://sovrin.org/wp-content/themes/sovrin/assets/images/logo.svg"
            height="30px"
            alt="Sovrin Logo" />
        </Navbar.Brand>
        <Navbar.Brand href="https://picolabs.io">
          <img
            src={picoLogo}
            height="30px"
            alt="PicoLabs Logo" />
        </Navbar.Brand>
      </Navbar>
    </div>
  );
}

export default Footer;
