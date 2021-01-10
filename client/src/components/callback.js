import { useState, useEffect } from 'react';
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';
import Layout from './layout';

const Callback = (props) => {
  const [magic, setMagic] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showValidatingToken, setShowValidatingToken] = useState(false);

  useEffect(() => {
    !magic &&
      setMagic(
        new Magic(process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY, {
          extensions: [new OAuthExtension()],
        })
      );
    /* if `provider` is in our query params, the user is logging in with a social provider */
    let provider = new URLSearchParams(props.location.search).get('provider');
    if (magic) {
      provider ? finishSocialLogin() : finishEmailRedirectLogin();
    }
  }, [magic, props.location.search]);

  const finishEmailRedirectLogin = async () => {
    let magicCredential = new URLSearchParams(props.location.search).get('magic_credential');
    if (magicCredential) {
      try {
        let didToken = await magic.auth.loginWithCredential();
        setShowValidatingToken(true);
        await authenticateWithServer(didToken);
      } catch (error) {
        console.log(error);
        setErrorMsg('Error logging in. Please try again.');
      }
    }
  };

  const finishSocialLogin = async () => {
    try {
      let {
        magic: { idToken },
      } = await magic.oauth.getRedirectResult();
      setShowValidatingToken(true);
      await authenticateWithServer(idToken);
    } catch (error) {
      console.log(error);
      setErrorMsg('Error logging in. Please try again.');
    }
  };

  const authenticateWithServer = async (didToken) => {
    let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + didToken,
      },
      credentials: 'include',
    });
    res.status === 200 && props.history.push('/');
  };

  return (
    <Layout>
      {errorMsg ? (
        <div className='error'>{errorMsg}</div>
      ) : (
        <div className='callback-container'>
          <div className='auth-step'>Retrieving auth token...</div>
          {showValidatingToken && <div className='auth-step'>Validating token...</div>}
        </div>
      )}

      <style>{`
        .callback-container {
          width: 100%;
          text-align: center;
        }
        .auth-step {
          margin: 30px 0;
          font-size: 17px;
        }
        .error {
          color: red;
        }
      `}</style>
    </Layout>
  );
};

export default Callback;
