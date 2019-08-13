import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import NavigationBar from './NavigationBar';
import Home from './pages/Home';
import Connections from './pages/Connections';
import Login from './pages/Login';
import Register from './pages/Register';
import './styles.css';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <NavigationBar />
        <div className="page">
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/connections" component={Connections} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
