class User {
    constructor(row) {
        this.id = row.user_id;
        this.externalId = 'USER_' + row.user_id;
        this.username = row.username;
        this.token = row.token;
    }
}

module.exports = User;
