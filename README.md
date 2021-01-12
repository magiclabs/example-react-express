# Demo

https://magic-react-express.herokuapp.com/login

# Quick Start Instructions

#### Start server

```txt
$ git clone https://github.com/magiclabs/example-react-express.git
$ cd example-react-express
$ mv .env.example .env
$ yarn install
$ node server.js
```

#### Start client (in a new CLI tab)

```txt
$ cd client
$ mv .env.example .env
$ yarn install
$ yarn start
```

# .env Files

There are two environment files for the application, one client-side and one server-side.

You can grab your `REACT_APP_MAGIC_PUBLISHABLE_KEY` and `MAGIC_SECRET_KEY` from [**Magic's Dashboard**](https://dashboard.magic.link). And you can randomly generate a secure 32+ character `JWT_SECRET` which will be used to sign the JSON web tokens that the server issues once a user logs in. You'll also use the secret when you verify the JWT, and if it's altered in any way, the signature will not match when calling `jwt.verify(token)`. A great tool to visualize this is https://jwt.io/.

### client/.env (client)

```txt
REACT_APP_MAGIC_PUBLISHABLE_KEY=your-magic-publishable-key
REACT_APP_CLIENT_URL=http://localhost:3000
REACT_APP_SERVER_URL=http://localhost:8080
```

### .env (server)

```txt
MAGIC_SECRET_KEY=your-magic-secret-key
JWT_SECRET=your-32+-character-secret
CLIENT_URL=http://localhost:3000
```

- _Note: the tutorial was built using Magic UI components. If you swap them out for your own custom CSS, you can delete `@magiclabs/ui` and `framer-motion`from your `client/package.json` dependencies._

# Tutorial

https://magic.link/posts/magic-react-express
