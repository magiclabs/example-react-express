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

You can grab the `REACT_APP_MAGIC_PUBLISHABLE_KEY` (`client/.env`) and `MAGIC_SECRET_KEY` (`.env`) from [**Magic's Dashboard**](https://dashboard.magic.link).

### client/.env (client)

```txt
REACT_APP_MAGIC_PUBLISHABLE_KEY=pk_test_1234567890
REACT_APP_CLIENT_URL=http://localhost:3000
```

### .env (server)

```txt
MAGIC_SECRET_KEY=sk_test_1234567890
CLIENT_URL=http://localhost:3000
```

- _Note: the tutorial was built using Magic UI components. If you swap them out for your own custom CSS, you can delete `@magiclabs/ui` and `framer-motion`from your `client/package.json` dependencies._

# Tutorial

https://magic.link/posts/magic-react-express
