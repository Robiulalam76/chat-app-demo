// const express = require('express');
// const connectDB = require('./confiq/DB');
// const app = express()
const PORT = process.env.PORT || 5500


// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// connectDB()

const server = require("http").createServer();
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

io.on("connection", (socket) => {
    console.log(`Client ${socket.id} connected`);

    // Join a conversation
    const { roomId } = socket.handshake.query;
    socket.join(roomId);

    // Listen for new messages
    socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
        io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
    });

    // Leave the room if the user closes the socket
    socket.on("disconnect", () => {
        console.log(`Client ${socket.id} diconnected`);
        socket.leave(roomId);
    });
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

// //----------------------------
// app.get('/', async (req, res) => {
//     res.send('Hello World!')
// })

// app.listen(PORT, () => {
//     console.log(`app listening on port ${PORT}`)
// })