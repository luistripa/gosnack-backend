var express = require('express');
var router = express.Router();

const user_db = require('../database/user_db');

/* GET users listing. */
router.get('/', function(req, res, next) {
    let username = req.query.username;

    user_db.getUser(username)
        .then(user => {
            console.log(user)
            if (user) {
                res.json({
                    status: "success",
                    data: user,
                })
            } else {
                console.error("User not found: ", username);
                res.json({
                    status: "error",
                    message: "User not found: " + username
                })
            }
        })
});


router.post('/login', (req, res) => {
    const username = req.body.username;

    user_db.getUser(username)
        .then(user => {
            if (!user) {
                res.json({
                    status: "error",
                    message: "User not found",
                })
            } else {
                res.json({
                    status: "sucess",
                    data: user
                })
            }

        })
        .catch(err => {
            console.error(err);
        })
});

router.get('/history', (req, res) => {
    const username = req.query.username;

    user_db.getHistory(username)
        .then(rows => {
            res.json({
                status: "success",
                data: rows
            })
        })
        .catch(err => {
            console.error(err);
        });
})


module.exports = router;
