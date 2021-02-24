import { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { magic } from '../lib/magic';
import { UserContext } from '../lib/UserContext';
import Loading from './loading';

const Callback = (props) => {
  const history = useHistory();
  const [user, setUser] = useContext(UserContext);

  // The redirect contains a `provider` query param if the user is logging in with a social provider
  useEffect(() => {
    let provider = new URLSearchParams(props.location.search).get('provider');
    provider ? finishSocialLogin() : finishEmailRedirectLogin();
  }, [props.location.search]);

  // `getRedirectResult()` returns an object with user data from Magic and the social provider
  const finishSocialLogin = async () => {
    let result = await magic.oauth.getRedirectResult();
    authenticateWithServer(result.magic.idToken);
  };

  // `loginWithCredential()` returns a didToken for the user logging in
  const finishEmailRedirectLogin = () => {
    let magicCredential = new URLSearchParams(props.location.search).get('magic_credential');
    if (magicCredential)
      magic.auth.loginWithCredential().then((didToken) => authenticateWithServer(didToken));
  };

  // Send token to server to validate
  const authenticateWithServer = async (didToken) => {
    let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + didToken,
      },
    });

    if (res.status === 200) {
      // Set the UserContext to the now logged in user
      let userMetadata = await magic.user.getMetadata();
      await setUser(userMetadata);
      history.push('/profile');
    }
  };

  return <Loading />;
};

export default Callback;
