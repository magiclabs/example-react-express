require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user');
const path = require('path');
const cors = require('cors');

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', userRouter);

/* For heroku deployment */
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const listener = app.listen(process.env.PORT || 8080, function () {
  console.log('Listening on port ' + listener.address().port);
});
