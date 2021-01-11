import { useUser } from '../lib/hooks';
import { CallToAction, TextButton } from '@magiclabs/ui';
import { useHistory } from 'react-router-dom';

const Header = () => {
  const user = useUser();
  const history = useHistory();

  return (
    <header>
      <nav>
        <ul>
          <li>
            <TextButton color='primary' size='sm' onPress={() => history.push('/')}>
              Home
            </TextButton>
          </li>
          {user ? (
            <>
              <li>
                <TextButton color='primary' size='sm' onPress={() => history.push('/profile')}>
                  Profile
                </TextButton>
              </li>
              <li>
                <a href={`${process.env.REACT_APP_SERVER_URL}/api/logout`}>
                  <TextButton color='primary' size='sm'>
                    Logout
                  </TextButton>
                </a>
              </li>
            </>
          ) : (
            <li>
              <CallToAction color='primary' size='sm' onPress={() => history.push('/profile')}>
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
          box-sizing: border-box;
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
        li > a {
          text-decoration: none;
        }
      `}</style>
    </header>
  );
};

export default Header;
