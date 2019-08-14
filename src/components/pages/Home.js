import React from 'react';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Footer from '../Footer';
import image from '../../media/bright-cardiac-cardiology.jpg';
import './home.css';

class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <Image
          style={{"position":"absolute", "zIndex":"-10", "opacity": ".2" }}
          src={image} fluid
        />
        <div className="header">
          <h1>Welcome to the FHIR Agency!</h1>
          <p>Keep your medical and personal records safe with your FHIR Agent</p>
          <Button href="#learn" variant="primary" size="lg">Learn More</Button>{'   '}
        </div>
        <div id="learn" className="content">
          <Jumbotron style={{ "backgroundColor": "#f49315", "marginBottom": "0" }}>
            <h2>What is an Agent?</h2>
            <p>An agent is blah blah blah</p>
            <p>An agent does blah blah blah</p>
            <Button href="/fhir-agency/register" variant="outline-light" size="lg">Get An Agent</Button>
          </Jumbotron>
          <Jumbotron style={{ "marginBottom": "0" }}>
            <h2>How do Agents work?</h2>
          </Jumbotron>
          <Jumbotron style={{ "backgroundColor": "#343a40", "color": "white", "marginBottom": "0" }}>
            <h2>Why should I have an Agent?</h2>
          </Jumbotron>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Home;
