const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
const PORT = process.env.PORT || 5002;

mongoose.connect('mongodb+srv://srirambangam:srirambangam@cluster0.gsi1t.mongodb.net/CodeSphereDatabase?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const connectedUsers = new Map(); // socket.id -> username (or user info)

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('join', (username) => {
        const usernameExists = Array.from(connectedUsers.values()).includes(username);

        if (!usernameExists) {
            connectedUsers.set(socket.id, username);
            const userList = Array.from(connectedUsers.values());

            socket.broadcast.emit('user-joined', {
            newUser: username,
            usersOnline: userList
            });

            socket.emit('your-info', {
            socketId: socket.id,
            usersOnline: userList
            });
        }
    })
    socket.on('sendMessage', (msg) => {
        io.emit('receiveMessage', msg);
        //msgt = msg;
        //setMessage();
    });
    socket.on('disconnect', (reason) => {
        const disconnectedUser = connectedUsers.get(socket.id);
        if (disconnectedUser) {
            connectedUsers.delete(socket.id);

            const updatedUserList = Array.from(connectedUsers.values());

            socket.broadcast.emit('user-disconnected', {
                user: disconnectedUser,
                usersOnline: updatedUserList
            });
        }
    });
});

const authrouter = require('./routes/auth');
const messagesrouter = require('./routes/messages');
const groupsrouter = require('./routes/groups');
app.use('/auth',authrouter);
app.use('/messages',messagesrouter);
app.use('/groups',groupsrouter);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
