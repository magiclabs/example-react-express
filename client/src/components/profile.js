import { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../lib/UserContext';
import Loading from './loading';

const Profile = () => {
  const history = useHistory();
  const [user] = useContext(UserContext);

  // Redirect to login page if not loading and no user found
  useEffect(() => {
    user && !user.loading && !user.issuer && history.push('/login');
  }, [user, history]);

  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : (
        user?.issuer && (
          <>
            <div className='label'>Email</div>
            <div className='profile-info'>{user.email}</div>

            <div className='label'>User Id</div>
            <div className='profile-info'>{user.issuer}</div>
          </>
        )
      )}
      <style>{`
        .label {
          font-size: 12px;
          color: #6851ff;
          margin: 30px 0 5px;
        }
        .profile-info {
          font-size: 17px;
          word-wrap: break-word;
        }
      `}</style>
    </>
  );
};

export default Profile;
