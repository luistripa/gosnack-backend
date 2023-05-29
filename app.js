const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const vendingMachinesRouter = require('./routes/vending_machines');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.set('trust proxy', 1);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/vending_machine', vendingMachinesRouter);

module.exports = app;
