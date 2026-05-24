const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const socket = io("http://localhost:3000");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

let players = [];

io.on("connection", socket => {

    console.log("Player joined");

    players.push(socket.id);

    socket.emit("playerIndex", players.length - 1);

    socket.on("playCard", data => {

        socket.broadcast.emit("opponentPlayed", data);

    });

    socket.on("disconnect", () => {

        players = players.filter(id => id !== socket.id);

    });

});

server.listen(3000);