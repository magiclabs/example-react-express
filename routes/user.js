require('dotenv').config();
const express = require('express');
const router = express.Router();
const { magic } = require('../lib/magic');
const jwt = require('jsonwebtoken');
const { removeTokenCookie, setTokenCookie } = require('../lib/cookie');

/**
 * 1. verify DID token (proof of authentication)
 * 2. create a JWT for authorization
 * 3. set JWT inside a cookie
 */
router.post('/login', async (req, res) => {
  try {
    const didToken = req.headers.authorization.substr(7);
    await magic.token.validate(didToken);
    const metadata = await magic.users.getMetadataByToken(didToken);
    let token = jwt.sign(
      {
        ...metadata,
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

/**
 * Checks if a user is logged in
 * 1. verify the JWT
 * 2. create a new token with a one week lifespan
 * 3. override the existing JWT with the new one
 */
router.get('/user', async (req, res) => {
  try {
    if (!req.cookies.token) return res.json({ user: null });
    let token = req.cookies.token;
    let user = jwt.verify(token, process.env.JWT_SECRET);
    let { issuer, publicAddress, email } = user;
    let newToken = jwt.sign(
      {
        issuer,
        publicAddress,
        email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // one week
      },
      process.env.JWT_SECRET
    );
    setTokenCookie(res, newToken);
    res.status(200).json({ user });
  } catch (error) {
    res.status(200).json({ user: null });
  }
});

/**
 * 1. log user out of their session with Magic
 * 2. clear the JWT, logging user out of their session with our app
 */
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
    res.status(401).json({ message: 'User is not logged in' });
  }
});

module.exports = router;
