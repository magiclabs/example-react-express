<!--
1. fix reload on nav change (maybe _document.js needed here)
2. social login
 -->

### Demo

https://magic-react-express.herokuapp.com/login

### Quick start

Start server

```
$ git clone <repo>
$ cd example-react-express
$ mv .env.example .env
// enter your env variables
$ yarn install
$ node server.js
```

Start client (in a new CLI tab)

```
$ cd client
$ mv .env.example .env
// enter your env variables
$ yarn install
$ yarn start
```

## Tutorial

### File Structure

The root directory will contain our server-side files. And inside `client` will be our frontend files.

```
├── README.md
├── client
│   ├── package.json
│   ├── public
│   │   └── (static files, such as images)
│   ├── src
│   │   ├── App.js
│   │   ├── components
│   │   │   ├── callback.js
│   │   │   ├── form.js
│   │   │   ├── header.js
│   │   │   ├── home.js
│   │   │   ├── layout.js
│   │   │   ├── login.js
│   │   │   ├── profile.js
│   │   │   └── social-logins.js
│   │   ├── index.js
│   │   └── lib
│   │       ├── helpers.js
│   │       └── hooks.js
│   └── yarn.lock
├── lib
│   ├── cookie.js
│   └── magic.js
├── package.json
├── routes
│   └── user.js
├── server.js
└── yarn.lock
```

### Magic Setup

Your Magic setup will depend on what login options you want. For magic link minimal setup is required. For social login integrations, follow our documentation for configuration instructions https://docs.magic.link/social-login.

Once you have social logins configured (if applicable), grab your API keys from Magic’s dashboard and in `.env` enter your Test Secret Key such as `MAGIC_SECRET_KEY=sk_test_1234567890` and in `client/.env` enter your Test Publishable Key such as `REACT_APP_MAGIC_PUBLISHABLE_KEY=pk_test1234567890`.

### Magic Link Auth

In `client/src/components/login.js`, we handle `magic.auth.loginWithMagicLink()` which is what triggers the magic link to be emailed to the user. It takes an object with two parameters, `email` and an optional `redirectURI`. Magic allows you to configure the email link to open up a new tab, bringing the user back to your application. With the redirect in place, a user will get logged in on both the original and new tab. Once the user clicks the email link, send the `DID token` to our server endpoint at `/api/login` where we validate it.

```js
async function handleLoginWithEmail(email) {
  try {
    let didToken = await magic.auth.loginWithMagicLink({
      email,
      redirectURI: `${process.env.REACT_APP_CLIENT_URL}/callback`,
    });
    await authenticateWithServer(didToken);
  } catch (error) {
    // handle error
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
  // if server response is 200, redirect home
}
```

### Social Login Auth

The social login implementation is similar. `magic.oauth.loginWithRedirect()` takes an object with provider, and a redirectURI for where to redirect back to once the user is authenticated. We authenticate with the server on the `/callback` page.

```js
async function handleLoginWithSocial(provider) {
  await magic.oauth.loginWithRedirect({
    provider,
    redirectURI: `${process.env.REACT_APP_CLIENT_URL}/callback`,
  });
}
```

### Completing the Login Redirect

In the `/callback` page, check if the query parameters include a `provider`, and if so, finish the social login, otherwise, it’s a user completing the email login.

```js
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
  try {
    let didToken = await magic.auth.loginWithCredential();
    setShowValidatingToken(true);
    await authenticateWithServer(didToken);
  } catch (error) {
    // handle error
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
    // handle error
  }
};
```

### Server-side

In `/api/login`, verify the `DID token`, create a `JWT`, then set it inside a cookie. On subsequent requests to the server, to check if the user is already authenticated for example, all we have to do is verify the JWT to know if the user has already been authenticated, and is authorized.

```js
router.post('/login', async (req, res) => {
  try {
    const didToken = req.headers.authorization.substr(7);
    await magic.token.validate(didToken);
    const metadata = await magic.users.getMetadataByToken(didToken);
    let token = jwt.sign(
      {
        issuer: metadata.issuer,
        publicAddress: metadata.publicAddress,
        email: metadata.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // one week
      },
      process.env.JWT_SECRET
    );
    setTokenCookie(res, token);
    res.status(200).json({ done: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Persisting Sessions

To make sessions persist, we rely on the JWT that’s stored in a cookie and automatically sent on each request to our server. The endpoint we check is `/api/user` which verifies the token, then refreshes it on each request. If we didn’t refresh the token, we could run into the scenario where a user logs in, then is browsing our site a week later and gets logged out in the middle of their session because the cookie and token we set had expired.

```js
router.get('/user', async (req, res) => {
  try {
    if (!req.cookies.token) return res.json({ user: null });
    let token = req.cookies.token;
    let user = jwt.verify(token, process.env.JWT_SECRET);
    let newToken = jwt.sign(
      {
        issuer: user.issuer,
        publicAddress: user.publicAddress,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // one week
      },
      process.env.JWT_SECRET
    );
    user.token = newToken;
    setTokenCookie(res, newToken);
    res.status(200).json({ user });
  } catch (error) {
    res.status(200).json({ user: null });
  }
});
```

Leveraging Vercel’s SWR (stale while revalidate) library, our `useUser` hook sends a request to the server with the `JWT`, and as long as we get a user returned, we know it’s valid and to keep the user logged in.

```js
const fetchUser = (url) =>
  fetch(url, {
    method: 'GET',
    credentials: 'include',
  })
    .then((r) => r.json())
    .then((data) => {
      return { user: data?.user || null };
    });

export function useUser({ redirectTo, redirectIfFound } = {}) {
  const history = useHistory();
  const { data, error } = useSWR(`${process.env.REACT_APP_SERVER_URL}/api/user`, fetchUser);
  const user = data?.user;
  const finished = Boolean(data);
  const hasUser = Boolean(user);

  useEffect(() => {
    if (!redirectTo || !finished) return;
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      history.push(redirectTo);
    }
  }, [redirectTo, redirectIfFound, finished, hasUser]);
  return error ? null : user;
}
```

### Logout

To complete the authentication, we need to allow users to log out. In `/api/logout` we use Magic’s admin-sdk method to clear the cookie containing the JWT and log the user out of their session with Magic.

```js
router.get('/logout', async (req, res) => {
  try {
    if (!req.cookies.token) return res.status(401).json({ message: 'User is not logged in' });
    let token = req.cookies.token;
    let user = jwt.verify(token, process.env.JWT_SECRET);
    await magic.users.logoutByIssuer(user.issuer);
    removeTokenCookie(res);
    res.writeHead(302, { Location: `${process.env.CLIENT_URL}/login` });
    res.end();
  } catch (error) {
    res.status(200).json({ message: 'Error logging out' });
  }
});
```

### Deployment

When you're ready to deploy your app on Heroku, there are a few configurations needed. Run the following command to generate a new Heroku project. It will return your Heroku app URL.

```
$ heroku create
```

#### Environment variable changes

- Remove `.env` from your .`gitignore` file so the env variables are pushed to Heroku
- In `.env`, change `CLIENT_URL=http://localhost:3000` to your Heroku deployment URL, such as `CLIENT_URL=https://your-app-name.herokuapp.com/`
- In `client/.env` change `REACT_APP_CLIENT_URL=http://localhost:3000` to your Heroku deployment URL, such as `REACT_APP_CLIENT_URL=https://your-app-name.herokuapp.com/`
- In `client/.env` change `REACT_APP_SERVER_URL=http://localhost:8080` to your Heroku deployment URL, such as `REACT_APP_SERVER_URL=https://your-app-name.herokuapp.com/`

In `server.js`

```js
/* For heroku deployment */
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
```

In `package.json`, in the `scripts` object

```
"heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client"
```

Then you're ready

```
$ git add .
$ git commit -m 'your message'
$ git push heroku master
```
