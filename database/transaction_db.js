
const db = require('./connection');

async function getTransactionsFromUserId(user_id) {
    const sql = "SELECT * FROM transactions WHERE user_id = ?";

    return new Promise((resolve, reject) => {
        db.all(sql, [user_id], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}


async function getPendingTransactions(user_id) {

    const sql = "SELECT * FROM transactions WHERE user_id = ? AND pending;";

    return new Promise((resolve, reject) => {
        db.all(sql, [user_id], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}


async function setTransactionProcessed(transaction_id) {
    const sql = "UPDATE transactions SET pending = false WHERE id = ?";

    return new Promise((resolve, reject) => {
        db.run(sql, [transaction_id], (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

module.exports = {
    getTransactionsFromUserId: getTransactionsFromUserId,
    getPendingTransactions: getPendingTransactions,
    setTransactionProcessed: setTransactionProcessed
}