const express = require('express');
const router = express.Router();
const axios = require('axios');
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');

// SIGNUP
router.get('/login', (req,res)=>{
  res.render('auth/login');
});

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup',  passport.authenticate('local.signup', {
  successRedirect: 'http://localhost:5000/aplicacion/Usuario'   ,
  failureRedirect: '/authentication/login',
  failureFlash: true
}));

// SINGIN
router.get('/signin', (req, res) => {
  res.render('/authentication/login');
});

router.post('/signin', (req, res, next) => {
 
  passport.authenticate('local.signin', { 
    successRedirect: '/aplicacion/dashboard' ,
    failureRedirect: '/authentication/login', 
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/authentication/login');
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

module.exports = router;