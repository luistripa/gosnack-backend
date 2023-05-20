var express = require('express');
var router = express.Router();

const users_db = require('../database/user_db');

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.user) {
        return res.send(req.session.user);
    } else {
        return res.send("Not logged in");
    }
});


router.post('/login', (req, res) => {
    const username = req.body.username;

    users_db.getUser(username).then((user) => {
        req.session.user = user;
        res.send(user);

    }).catch((err) => {
        res.send(err);
    });
});


module.exports = router;
