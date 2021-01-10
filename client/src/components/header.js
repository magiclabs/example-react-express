import { useUser } from '../lib/hooks';
import { Link } from 'react-router-dom';
import { CallToAction, TextButton } from '@magiclabs/ui';

const Header = () => {
  const user = useUser();

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to='/'>
              <TextButton color='primary' size='sm'>
                Home
              </TextButton>
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to='/profile'>
                  <TextButton color='primary' size='sm'>
                    Profile
                  </TextButton>
                </Link>
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
              <Link to='/login'>
                <CallToAction color='primary' size='sm'>
                  Login
                </CallToAction>
              </Link>
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
