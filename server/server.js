const express = require("express");

const http = require("http");

const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const rooms = {};

function generateRoomCode() {

    return Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

}

io.on("connection", socket => {

    console.log(
        "Player connected:",
        socket.id
    );

    socket.on("createRoom", () => {

        const roomCode =
            generateRoomCode();

        rooms[roomCode] = {
            players: [socket.id]
        };

        socket.join(roomCode);

        socket.emit(
            "roomCreated",
            roomCode
        );

        console.log(
            "Room created:",
            roomCode
        );

    });

    socket.on("joinRoom", roomCode => {

        const room = rooms[roomCode];

        if (!room) {

            socket.emit(
                "errorMessage",
                "Room not found"
            );

            return;

        }

        if (room.players.length >= 2) {

            socket.emit(
                "errorMessage",
                "Room full"
            );

            return;

        }

        room.players.push(socket.id);

        socket.join(roomCode);

        io.to(roomCode).emit(
            "gameStart",
            roomCode
        );

        console.log(
            "Player joined room:",
            roomCode
        );

    });

    socket.on("disconnect", () => {

        console.log(
            "Disconnected:",
            socket.id
        );

    });

});

server.listen(3000, () => {

    console.log(
        "Server running on port 3000"
    );

});