import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import PokerTable from '../components/PokerTable';
import About from '../components/About';
import withAuthentication from '../containers/withAuthentication';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/dashboard" component={withAuthentication(Dashboard)} />
          <Route path="/table/:userId/:tableId" component={withAuthentication(PokerTable)} />
          <Route path="/about" component={About} />
        </Switch>
      </Router>
    );
  }
}

export default App;
