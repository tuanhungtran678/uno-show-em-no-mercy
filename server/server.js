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

// =========================
// ROOM STORAGE
// =========================

const rooms = {};

// =========================
// GENERATE ROOM CODE
// =========================

function generateRoomCode() {

    return Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

}

// =========================
// SOCKET CONNECTION
// =========================

io.on("connection", socket => {

    console.log(
        "Player connected:",
        socket.id
    );

    // =====================
    // CREATE ROOM
    // =====================

    socket.on("createRoom", () => {

        const roomCode =
            generateRoomCode();

        rooms[roomCode] = {

            players: [socket.id],

            gameState: {

                topCard: null,

                currentPlayer: 0,

                stackAmount: 0,

                hands: {},

                started: false

            }

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

    // =====================
    // JOIN ROOM
    // =====================

    socket.on(
        "joinRoom",
        roomCode => {

            const room =
                rooms[roomCode];

            if (!room) {

                socket.emit(
                    "errorMessage",
                    "Room not found"
                );

                return;

            }

            if (
                room.players.length >= 2
            ) {

                socket.emit(
                    "errorMessage",
                    "Room full"
                );

                return;

            }

            room.players.push(
                socket.id
            );

            socket.join(roomCode);

            // =================
            // START GAME
            // =================

            const game =
                room.gameState;

            game.started = true;

            game.hands[
                room.players[0]
            ] = [

                "red-5",
                "blue-2",
                "green-9"

            ];

            game.hands[
                room.players[1]
            ] = [

                "yellow-7",
                "red-1",
                "blue-4"

            ];

            game.topCard =
                "green-3";

            // =================
            // EMIT START
            // =================

            io.to(roomCode).emit(
                "gameStart",
                roomCode
            );

            io.to(roomCode).emit(
                "gameState",
                game
            );

            console.log(
                "Player joined room:",
                roomCode
            );

        }
    );

    // =====================
    // PLAY CARD
    // =====================

    socket.on(
        "playCard",
        data => {

            const room =
                rooms[data.roomCode];

            if (!room) {
                return;
            }

            const game =
                room.gameState;

            const playerId =
                socket.id;

            const hand =
                game.hands[playerId];

            if (!hand) {
                return;
            }

            const playedCard =
                hand[data.cardIndex];

            if (!playedCard) {
                return;
            }

            // =================
            // UPDATE GAME
            // =================

            game.topCard =
                playedCard;

            hand.splice(
                data.cardIndex,
                1
            );

            game.currentPlayer =
                (
                    game.currentPlayer + 1
                ) % 2;

            // =================
            // BROADCAST
            // =================

            io.to(
                data.roomCode
            ).emit(
                "gameState",
                game
            );

            console.log(
                "Card played:",
                playedCard
            );

        }
    );

    // =====================
    // DISCONNECT
    // =====================

    socket.on(
        "disconnect",
        () => {

            console.log(
                "Disconnected:",
                socket.id
            );

            // Remove player from rooms

            for (
                const roomCode
                in rooms
            ) {

                const room =
                    rooms[roomCode];

                room.players =
                    room.players.filter(
                        id =>
                            id !== socket.id
                    );

                // Delete empty room

                if (
                    room.players.length === 0
                ) {

                    delete rooms[
                        roomCode
                    ];

                    console.log(
                        "Deleted room:",
                        roomCode
                    );

                }

            }

        }
    );

});

// =========================
// START SERVER
// =========================

server.listen(
    3000,
    () => {

        console.log(
            "Server running on port 3000"
        );

    }
);