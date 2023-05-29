const db = require('./connection');


/**
 * Get a user by username
 * @param username
 * @returns {Promise<{id: number, username: string, credit: number}>}
 */
async function getUser(username) {
    const sql = "SELECT * FROM users WHERE username = ?";


    return new Promise((resolve, reject) => {
        db.get(sql, [username], (err, user) => {
            if (err) {
                reject(err);
            }
            resolve(user);
        });
    });
}

async function getHistory(username) {
    const sql = "SELECT * FROM vw_user_recent_transactions WHERE username=?";

    return new Promise((resolve, reject) => {
        db.all(sql, [username], (err, rows) => {
            if (err)
                reject(err);
            resolve(rows);
        })
    })
}

async function addTransaction(user, slot) {
    const sql = `
        INSERT INTO transactions VALUES (NULL, ?, ?, ?);
    `;

    return new Promise((resolve, reject) => {
        db.run(sql, [user.id, slot.product_id, slot.product_price], err => {
            if (err)
                reject(err);
            resolve();
        })
    });
}

async function updateCredit(username, delta_credit) {
    const sql = `
        UPDATE users
        SET credit = credit + ?
        WHERE username = ?
    `;

    return new Promise((resolve, reject) => {
        db.run(sql, [delta_credit, username], err => {
            if (err)
                reject(err);
            resolve();
        })
    })
}


module.exports = {
    getUser: getUser,
    getHistory: getHistory,
    addTransaction: addTransaction,
    updateCredit: updateCredit,
}