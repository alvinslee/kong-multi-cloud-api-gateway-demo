const PORT = process.env.PORT || 8080;
const express = require('express');
const app = express();
const orders = require('./orders.json')
const jwt = require('jsonwebtoken')

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
  res.send('Orders Service: PUBLIC ENDPOINT');
});

app.get('/:userId', async (req, res, next) => {
  const { userId, isAdmin } = getUserFromToken(req);
  if (userId === req.params.userId || isAdmin) {
    const ordersForUser = orders[req.params.userId];
    res.send(ordersForUser && ordersForUser.length ? ordersForUser : 'No orders for that user.');
  } else {
    res.status(403).end()
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
