import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { magic } from '../lib/magic';
import { UserContext } from '../lib/UserContext';
import { CallToAction, TextButton } from '@magiclabs/ui';

const Header = () => {
  const history = useHistory();
  const [user, setUser] = useContext(UserContext);

  const logout = () => {
    magic.user.logout().then(() => {
      setUser({ user: null });
      history.push('/login');
    });
  };

  return (
    <header>
      <nav>
        <ul>
          {user?.loading ? (
            // If loading, don't display any buttons specific to the loggedIn state
            <div style={{ height: '38px' }}></div>
          ) : user?.issuer ? (
            <>
              <li>
                <TextButton color='primary' size='sm' onPress={() => history.push('/')}>
                  Home
                </TextButton>
              </li>
              <li>
                <TextButton color='primary' size='sm' onPress={() => history.push('/profile')}>
                  Profile
                </TextButton>
              </li>
              <li>
                <TextButton color='warning' size='sm' onPress={logout}>
                  Logout
                </TextButton>
              </li>
            </>
          ) : (
            <li>
              <CallToAction color='primary' size='sm' onPress={() => history.push('/login')}>
                Login
              </CallToAction>
            </li>
          )}
        </ul>
      </nav>
      <style>{`
        nav {
          max-width: 45rem;
          margin: 0 auto 50px;
          padding: 1.25rem 1.25rem;
          border-bottom: 1px solid #f0f0f0;
        }
        ul {
          display: flex;
          list-style: none;
        }
        li {
          margin-right: 1.5rem;
          line-height: 38px;
        }
        li:first-child {
          margin-left: auto;
        }
      `}</style>
    </header>
  );
};

export default Header;
