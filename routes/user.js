const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const userManager = require('../manager/user');

router.post('/login', function(req, res, next) {
  if(req.query.username === undefined){
    throw createError(400,'username is required');
  }
  if(req.query.password === undefined){
    throw createError(400,'password is required');
  }

  userManager.login(req.query.username, req.query.password, (user)=>{
    res.json(user);
  });
});

router.post('/create', function(req, res, next) {
  if(req.query.username === undefined){
    throw createError(400,'username is required');
  }
  if(req.query.password === undefined){
    throw createError(400,'password is required');
  }

  userManager.create(req.query.username, req.query.password, (user)=>{
    if(user === null){
      throw createError(404,'username and password not fund');
    }
    res.json(user);
  });
});

module.exports = router;
