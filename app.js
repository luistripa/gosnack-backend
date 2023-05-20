const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const vendingMachinesRouter = require('./routes/vending_machines');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: "random secret",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    })
)

app.set('trust proxy', 1);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/vending_machines', vendingMachinesRouter);

module.exports = app;
