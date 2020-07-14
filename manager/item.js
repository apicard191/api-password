const connection = require('../config/db');
const Item = require('../model/Item');
const crypto = require('../service/crypto');
const createError = require('http-errors');

class ItemManager {

    static findBy(conditions, callback) {
        console.log('ItemManager:findBy', conditions, callback);
        const queryBlock = [];
        const params = [];

        Object.entries(conditions).forEach(([key, value]) => {
            console.log(value, key);
            if (typeof value === 'object' && value !== null) {
                value = value.id;
                key += '_id';
            }
            queryBlock.push(key + ' = ?');
            params.push(value);
        });
        queryBlock.join(' AND ');
        let query = 'SELECT * FROM item';
        if (queryBlock.length !== 0) {
            query += ' WHERE ' + queryBlock.join(' AND ');
        }
        query += ';';
        console.log(query, params);
        connection.query(query, params,
            (error, results, fields) => {
                if (error) throw error;
                const response = [];
                results.forEach((row) => {
                    response.push(new Item(row))
                });
                if (typeof callback === "function") {
                    callback(response);
                }
            });
    }

    /**
     *
     * @param {int} id
     * @param {function} callback
     */
    static load(id, callback) {
        console.log('ItemManager:load', id, callback);
        connection.query('SELECT * FROM item WHERE item_id = ?', [id],
            (error, results, fields) => {
                if (error) throw error;
                if (typeof results[0] !== 'object' && typeof callback === "function") {
                    callback(null);
                }
                if (typeof callback === "function") {
                    callback(new Item(results[0]));
                }
            });
    }

    /**
     *
     * @param {int|User} user
     * @param {string} icon
     * @param {string} title
     * @param {string} username
     * @param {string} password
     * @param {string} comment
     * @param {function} callback
     */
    static create(user, icon, title, username, password, comment, callback) {
        console.log('ItemManager:create', user, icon, title, username, password, comment, callback);
        let userId = user;
        if (typeof user === 'object' && user !== null) {
            userId = user.id;
        }
        username = crypto.encrypt(username);
        password = crypto.encrypt(password);
        connection.query('INSERT INTO item VALUES(null, ?, ?, ?, ?, ?, ?)', [userId, icon, title, username, password, comment],
            (error, result, fields) => {
                if (error) throw error;
                this.load(result.insertId, callback);
            });
    }

}

module.exports = ItemManager;
