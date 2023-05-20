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


module.exports = {
    getUser: getUser
}