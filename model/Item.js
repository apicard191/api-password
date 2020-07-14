class Item {
    constructor(row) {
        this.id = row.user_id;
        this.externalId = 'ITEM_' + row.user_id;
        this.icon = row.icon;
        this.title = row.title;
        this.username = row.username;
        this.password = row.password;
        this.comment = row.comment;
    }
}

module.exports = Item;
