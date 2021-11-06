const PORT = process.env.PORT || 8080;
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

const { Datastore } = require('@google-cloud/datastore')
const datastore = new Datastore()

const getUserFromToken = (req) => {
  let userId = -1;
  let isAdmin = false;

  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.decode(token);
    userId = decoded.userId;
    isAdmin = decoded.isAdmin;
  }
  return {
    userId,
    isAdmin
  };
}

app.use(express.json());

app.get('/public', async (req, res, next) => {
  res.send('Users Service: PUBLIC ENDPOINT')
});

app.get('/:userId', async (req, res, next) => {
  const { userId, isAdmin } = getUserFromToken(req);
  if (userId === req.params.userId || isAdmin) {
    const query = datastore.createQuery('user').filter('userId', '=', Number(req.params.userId))
    const [users] = await datastore.runQuery(query)
    res.send(users.length ? users[0] : 'User not found.')
  } else {
    res.status(403).end()
  }
});

app.get('/', async (req, res, next) => {
  const { userId, isAdmin } = getUserFromToken(req);
  if (isAdmin) {
    const query = datastore.createQuery('user')
    const [users] = await datastore.runQuery(query)
    res.send(users)
  } else {
    res.status(403).end()
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
