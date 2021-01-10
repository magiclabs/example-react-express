import { useState, useEffect } from 'react';
import { Magic } from 'magic-sdk';
import { useUser } from '../lib/hooks';
import { OAuthExtension } from '@magic-ext/oauth';
import { WebAuthnExtension } from '@magic-ext/webauthn';
import Layout from './layout';
import Form from './form';
import { useHistory } from 'react-router-dom';
import SocialLogins from './social-logins';

const Login = () => {
  useUser({ redirectTo: '/', redirectIfFound: true });
  const history = useHistory();
  const [magic, setMagic] = useState(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    !magic &&
      setMagic(
        new Magic(process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY, {
          extensions: [new OAuthExtension(), new WebAuthnExtension()],
        })
      );
    magic?.preload();
  }, [magic]);

  async function handleLoginWithEmail(email) {
    try {
      setDisabled(true); // disable login button to prevent multiple emails from being triggered
      let didToken = await magic.auth.loginWithMagicLink({
        email,
        redirectURI: `${process.env.REACT_APP_CLIENT_URL}/callback`,
      });
      authenticateWithServer(didToken);
    } catch (error) {
      setDisabled(false); // re-enable login button - user may have requested to edit their email
      console.log(error);
    }
  }

  async function handleLoginWithSocial(provider) {
    await magic.oauth.loginWithRedirect({
      provider,
      redirectURI: `${process.env.REACT_APP_CLIENT_URL}/callback`,
    });
  }

  // try to login with webauthn, if that fails, revert to registering with webauthn
  async function handleLoginWithWebauthn(email) {
    try {
      let didToken = await magic.webauthn.login({ username: email });
      authenticateWithServer(didToken);
    } catch (error) {
      try {
        let didToken = await magic.webauthn.registerNewUser({ username: email });
        authenticateWithServer(didToken);
      } catch (err) {
        alert(
          'Failed to authenticate. Must be using a supported device and a username not already taken.'
        );
        console.log(err);
      }
    }
  }

  async function authenticateWithServer(didToken) {
    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + didToken,
      },
      credentials: 'include',
    });
    res.status === 200 && history.push('/');
  }

  return (
    <Layout>
      <div className='login'>
        <Form
          disabled={disabled}
          onEmailSubmit={handleLoginWithEmail}
          onWebauthnSubmit={handleLoginWithWebauthn}
        />
        <SocialLogins onSubmit={handleLoginWithSocial} />
      </div>
      <style>{`
        .login {
          max-width: 20rem;
          margin: 40px auto 0;
          padding: 1rem;
          border: 1px solid #dfe1e5;
          border-radius: 4px;
          text-align: center;
          box-shadow: 0px 0px 6px 6px #f7f7f7;
          box-sizing: border-box;
        }
      `}</style>
    </Layout>
  );
};

export default Login;
