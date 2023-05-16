const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const vendingMachinesRouter = require('./routes/vending_machines');

const net = require('net');


// Create a net socket server on port 1234
const server = net.createServer((socket) => {
    // When the client connects, print it out
    console.log('Client connected');
    socket.write("Hello");

    // When the client sends data, print it out
    socket.on('data', (data) => {
        console.log(data.toString());
    });

    // When the client disconnects, print it out
    socket.on('end', (socket) => {
        console.log('Client disconnected');
    });
});

server.listen(1234, () => {
    console.log('Server listening on port 1234');
});


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/vending_machines', vendingMachinesRouter);

module.exports = app;
