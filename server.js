const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const server = express();
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys.js');

const lenderRouter= require('./lender/lenderCollection-router.js');
const borrowerRouter= require('./borrower/borrowerWishlist-router.js');

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(
  cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [keys.cookieKey],
  })
);

server.use(passport.initialize());
server.use(passport.session());


// server.use('/api/auth', authRouter);
// server.use('/api/users', usersRouter);
server.use('/api/lender-collection', lenderRouter);
server.use('/api/borrower-wishlist', borrowerRouter);


server.get('/', (req, res) => {
    res.status(200).json("Welcome to myVivlio!");
  });
  
  module.exports = server;
  