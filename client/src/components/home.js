import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { UserContext } from '../lib/UserContext';
import Loading from './loading';

const Home = () => {
  const [user] = useContext(UserContext);
  const history = useHistory();

  // If not loading and no user found, redirect to /login
  useEffect(() => {
    user && !user.loading && !user.issuer && history.push('/login');
  }, [user, history]);

  return <>{user?.loading ? <Loading /> : user?.issuer && <div>You're logged in!</div>}</>;
};

export default Home;
