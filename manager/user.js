const connection = require('../config/db');
const User = require('../model/User');
const bcrypt = require('bcrypt');
const createError = require('http-errors');

class UserManager {
    /**
     * Login a user
     *
     * @param string username
     * @param string password
     * @param function callback
     */
    static login(username, password, callback) {
        console.log('userManager:login', username, password, callback);
        connection.query('SELECT user_id, password FROM user WHERE username = ?', [username],
            (error, results, fields) => {
                if (error) throw error;
                if (typeof results[0] !== 'object') {
                    if (typeof callback === 'function') {
                        throw createError(404, 'username not found');
                    }
                    return;
                }
                bcrypt.compare(password, results[0].password, (error, response) => {
                    if (error) throw createError(500, error.message);
                    if (!response) {
                        throw createError(400, 'wrong password');
                    }
                    this.generateToken(results[0].user_id, callback);
                });
            });
    }

    static generateToken(id, callback) {
        console.log('userManager:generateToken', id, callback);
        bcrypt.hash((new Date()) + 'id', 10, (error, hash) => {
            if (error) throw error;
            connection.query('UPDATE user SET token = ? WHERE user_id = ?', [hash, id],
                (error) => {
                    if (error) throw error;
                    this.load(id, callback);
                });
        });
    }

    /**
     *
     * @param int id
     * @param function callback
     */
    static load(id, callback) {
        console.log('userManager:load', id, callback);
        connection.query('SELECT user_id, username, token FROM user WHERE user_id = ? OR token = ?', [id, id],
            (error, results) => {
                if (error) throw error;
                if (typeof results[0] !== 'object') {
                    if (typeof callback === "function") {
                        callback(null);
                    }
                    return;
                }
                if (typeof callback === "function") {
                    callback(new User(results[0]));
                }
            });
    }

    /**
     *
     * @param {string} username
     * @param {string} password
     * @param {function} callback
     */
    static create(username, password, callback) {
        console.log('userManager:create', username, password, callback);
        this.hashPassword(password, (hash) => {
            connection.query('INSERT INTO user VALUES(null, ?, ?, null)', [username, hash],
                (error, result, fields) => {
                    if (error) throw error;
                    console.log(result.insertId);
                    this.generateToken(result.insertId, callback);
                });
        });
    }

    static hashPassword(password, callback) {
        console.log('userManager:hashPassword', password, callback);
        bcrypt.hash(password, 10, (error, hash) => {
            if (error) throw error;
            callback(hash)
        });
    }

    static handler(request, response, callback) {
        console.log('userManager:handler', request, response);
        if (request.headers.authorization !== undefined) {
            const token = request.headers.authorization.replace('Bearer ', '');
            this.load(token, (user) => {
                request.query.user = user;
                callback();
            });
        } else {
            callback();
        }
    }
};

module.exports = UserManager;
