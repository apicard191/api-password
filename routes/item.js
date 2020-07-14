const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const itemManager = require('../manager/item');

router.get('/list', function (request, response, next) {
    if (request.query.user === undefined || request.query.user === null) {
        throw createError(403, 'Access deny');
    }
    itemManager.findBy({user: request.query.user}, (users)=>{
        response.json(users);
    });
});

router.get('/create', function (request, response, next) {
    if (request.query.user === undefined || request.query.user === null) {
        throw createError(403, 'Access deny');
    }

    itemManager.create(request.query.user, request.query.icon, request.query.title, request.query.username, request.query.password, request.query.comment, (item)=>{
        response.json(item);
    });
});

module.exports = router;
