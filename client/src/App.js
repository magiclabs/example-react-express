import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Home from './components/home';
import Login from './components/login';
import Profile from './components/profile';
import Callback from './components/callback';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/profile' component={Profile} />
        <Route path='/callback' component={Callback} />
      </Switch>
    </Router>
  );
}

export default App;
