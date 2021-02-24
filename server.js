require('dotenv').config(); // enables loading .env vars
const express = require('express');
const app = express();
const { Magic } = require('@magic-sdk/admin');
const path = require('path');
const cors = require('cors');

// Initiating Magic instance for server-side methods
const magic = new Magic(process.env.MAGIC_SECRET_KEY);

// Allow requests from client-side
app.use(cors({ origin: process.env.CLIENT_URL }));

app.post('/api/login', async (req, res) => {
  try {
    const didToken = req.headers.authorization.substr(7);
    await magic.token.validate(didToken);
    res.status(200).json({ authenticated: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// For heroku deployment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const listener = app.listen(process.env.PORT || 8080, () =>
  console.log('Listening on port ' + listener.address().port)
);
