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

// =====================
// ROOMS
// =====================

const rooms = {};

// =====================
// ROOM CODE
// =====================

function generateRoomCode() {

    return Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

}

// =====================
// RANDOM CARD
// =====================

function randomCard() {

    const cards = [

        "red-1",
        "red-5",
        "red-9",

        "blue-2",
        "blue-7",

        "green-3",
        "green-8",

        "yellow-4",
        "yellow-6",

        "red-skip",
        "blue-skip",

        "green-reverse",
        "yellow-reverse",

        "red-draw2",
        "blue-draw2",

        "wild-draw4",
        "wild-draw10"

    ];

    return cards[
        Math.floor(
            Math.random() *
            cards.length
        )
    ];

}

// =====================
// VALIDATE CARD
// =====================

function canPlayCard(
    playedCard,
    topCard
) {

    if (
        !playedCard ||
        !topCard
    ) {

        return false;

    }

    const played =
        playedCard.split("-");

    const top =
        topCard.split("-");

    const playedColor =
        played[0];

    const playedValue =
        played[1];

    const topColor =
        top[0];

    const topValue =
        top[1];

    return (

        playedColor === topColor ||

        playedValue === topValue ||

        playedColor === "wild"

    );

}

// =====================
// SOCKET
// =====================

io.on(
    "connection",
    socket => {

        console.log(
            "Connected:",
            socket.id
        );

        // =================
        // CREATE ROOM
        // =================

        socket.on(
            "createRoom",
            guestName => {

                const roomCode =
                    generateRoomCode();

                rooms[roomCode] = {

                    players: [

                        {
                            id: socket.id,
                            name: guestName
                        }

                    ],

                    gameState: {

                        started: false,

                        topCard: null,

                        currentPlayer: 0,

                        hands: {}

                    }

                };

                socket.join(
                    roomCode
                );

                socket.emit(
                    "roomCreated",
                    roomCode
                );

                console.log(
                    "Room created:",
                    roomCode
                );

            }
        );

        // =================
        // JOIN ROOM
        // =================

        socket.on(
            "joinRoom",
            data => {

                console.log(
                    "JOIN DATA:",
                    data
                );

                const roomCode =
                    data.roomCode;

                const guestName =
                    data.guestName;

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

                room.players.push({

                    id: socket.id,

                    name: guestName

                });

                socket.join(
                    roomCode
                );

                // =================
                // START GAME
                // =================

                const game =
                    room.gameState;

                game.started = true;

                const player1 =
                    room.players[0].id;

                const player2 =
                    room.players[1].id;

                game.hands[player1] = [];
                game.hands[player2] = [];

                for (
                    let i = 0;
                    i < 7;
                    i++
                ) {

                    game.hands[player1]
                        .push(
                            randomCard()
                        );

                    game.hands[player2]
                        .push(
                            randomCard()
                        );

                }

                game.topCard =
                    randomCard();

                io.to(
                    roomCode
                ).emit(
                    "gameStart"
                );

                io.to(
                    roomCode
                ).emit(
                    "gameState",
                    game
                );

                console.log(
                    "Game started:",
                    roomCode
                );

            }
        );

        // =================
        // PLAY CARD
        // =================

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

                const currentPlayerId =

                    room.players[
                        game.currentPlayer
                    ].id;

                if (
                    socket.id !==
                    currentPlayerId
                ) {

                    socket.emit(
                        "errorMessage",
                        "Not your turn!"
                    );

                    return;

                }

                const hand =
                    game.hands[
                        socket.id
                    ];

                if (!hand) {
                    return;
                }

                const playedCard =
                    hand[
                        data.cardIndex
                    ];

                if (!playedCard) {
                    return;
                }

                if (
                    !canPlayCard(
                        playedCard,
                        game.topCard
                    )
                ) {

                    socket.emit(
                        "errorMessage",
                        "Invalid card!"
                    );

                    return;

                }

                // REMOVE CARD

                hand.splice(
                    data.cardIndex,
                    1
                );

                // UPDATE TOP CARD

                game.topCard =
                    playedCard;

                // NEXT TURN

                game.currentPlayer =
                    (
                        game.currentPlayer + 1
                    ) % 2;

                // WIN CHECK

                if (
                    hand.length === 0
                ) {

                    io.to(
                        data.roomCode
                    ).emit(
                        "gameEnded",
                        socket.id
                    );

                    return;

                }

                io.to(
                    data.roomCode
                ).emit(
                    "gameState",
                    game
                );

            }
        );

        // =================
        // DRAW CARD
        // =================

        socket.on(
            "drawCard",
            roomCode => {

                const room =
                    rooms[roomCode];

                if (!room) {
                    return;
                }

                const game =
                    room.gameState;

                const currentPlayerId =

                    room.players[
                        game.currentPlayer
                    ].id;

                if (
                    socket.id !==
                    currentPlayerId
                ) {

                    socket.emit(
                        "errorMessage",
                        "Not your turn!"
                    );

                    return;

                }

                game.hands[
                    socket.id
                ].push(
                    randomCard()
                );

                game.currentPlayer =
                    (
                        game.currentPlayer + 1
                    ) % 2;

                io.to(
                    roomCode
                ).emit(
                    "gameState",
                    game
                );

            }
        );

        // =================
        // DISCONNECT
        // =================

        socket.on(
            "disconnect",
            () => {

                console.log(
                    "Disconnected:",
                    socket.id
                );

            }
        );

    }
);

// =====================
// START SERVER
// =====================

server.listen(
    3000,
    () => {

        console.log(
            "Server running on port 3000"
        );

    }
);