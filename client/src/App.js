import React, { useState, useEffect } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { magic } from './lib/magic';
import { UserContext } from './lib/UserContext';
import Home from './components/home';
import Login from './components/login';
import Profile from './components/profile';
import Callback from './components/callback';
import Layout from './components/layout';

function App() {
  const [user, setUser] = useState();

  // If isLoggedIn is true, set the UserContext with user data
  // Otherwise, set it to {user: null}
  useEffect(() => {
    setUser({ loading: true });
    magic.user.isLoggedIn().then((isLoggedIn) => {
      return isLoggedIn
        ? magic.user.getMetadata().then((userData) => setUser(userData))
        : setUser({ user: null });
    });
  }, []);

  return (
    <Router>
      <Switch>
        <UserContext.Provider value={[user, setUser]}>
          <Layout>
            <Route path='/' exact component={Home} />
            <Route path='/login' component={Login} />
            <Route path='/profile' component={Profile} />
            <Route path='/callback' component={Callback} />
          </Layout>
        </UserContext.Provider>
      </Switch>
    </Router>
  );
}

export default App;
