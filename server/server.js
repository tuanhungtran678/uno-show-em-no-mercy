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

        // RED

        "red-0",
        "red-1",
        "red-2",
        "red-3",
        "red-4",
        "red-5",
        "red-6",
        "red-7",
        "red-8",
        "red-9",

        // BLUE

        "blue-0",
        "blue-1",
        "blue-2",
        "blue-3",
        "blue-4",
        "blue-5",
        "blue-6",
        "blue-7",
        "blue-8",
        "blue-9",

        // GREEN

        "green-0",
        "green-1",
        "green-2",
        "green-3",
        "green-4",
        "green-5",
        "green-6",
        "green-7",
        "green-8",
        "green-9",

        // YELLOW

        "yellow-0",
        "yellow-1",
        "yellow-2",
        "yellow-3",
        "yellow-4",
        "yellow-5",
        "yellow-6",
        "yellow-7",
        "yellow-8",
        "yellow-9",

        // SKIP

        "red-skip",
        "blue-skip",
        "green-skip",
        "yellow-skip",

        // REVERSE

        "red-reverse",
        "blue-reverse",
        "green-reverse",
        "yellow-reverse",

        // DRAW 2

        "red-draw2",
        "blue-draw2",
        "green-draw2",
        "yellow-draw2",

        // NO MERCY

        "red-skipeveryone",
        "blue-skipeveryone",

        "red-discardall",
        "blue-discardall",

        // WILD

        "wild-draw4",
        "wild-draw6",
        "wild-draw10",
        "wild-colorroulette"

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

        // =====================
        // CREATE ROOM
        // =====================

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

                        hands: {},

                        uno: {},

                        stackCount: 0,

                        roulette: null

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

        // =====================
        // JOIN ROOM
        // =====================

        socket.on(
            "joinRoom",
            data => {

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

                const parts =
                    playedCard.split("-");

                const color =
                    parts[0];

                const value =
                    playedCard.includes(
                        "draw4"
                    )

                        ? "draw4"

                    : playedCard.includes(
                        "draw6"
                    )

                        ? "draw6"

                    : playedCard.includes(
                        "draw10"
                    )

                        ? "draw10"

                    : playedCard.includes(
                        "colorroulette"
                    )

                        ? "colorroulette"

                    : parts[1];

                // =====================
                // STACK CHECK
                // =====================

                const isStackCard =

                    value === "draw2" ||

                    value === "draw4" ||

                    value === "draw6" ||

                    value === "draw10";

                if (
                    game.stackCount > 0
                ) {

                    // PLAYER STACKS

                    if (
                        isStackCard
                    ) {

                        if (
                            value === "draw2"
                        ) {

                            game.stackCount += 2;

                        }

                        else if (
                            value === "draw4"
                        ) {

                            game.stackCount += 4;

                        }

                        else if (
                            value === "draw6"
                        ) {

                            game.stackCount += 6;

                        }

                        else if (
                            value === "draw10"
                        ) {

                            game.stackCount += 10;

                        }

                    }

                    // PLAYER FAILS

                    else {

                        for (
                            let i = 0;
                            i < game.stackCount;
                            i++
                        ) {

                            hand.push(
                                randomCard()
                            );

                        }

                        game.stackCount = 0;

                        game.currentPlayer =
                            (
                                game.currentPlayer + 1
                            ) % 2;

                        io.to(
                            data.roomCode
                        ).emit(
                            "gameState",
                            game
                        );

                        return;

                    }

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

                if (
                    playedCard.includes(
                        "wild"
                    )
                ) {

                    game.topCard =

                        data.chosenColor +
                        "-wild";

                } else {

                    game.topCard =
                        playedCard;

                }

                // =====================
                // SPECIAL CARDS
                // =====================

                const nextPlayerIndex =

                    (
                        game.currentPlayer + 1
                    ) % 2;

                const nextPlayerId =

                    room.players[
                        nextPlayerIndex
                    ].id;

                // DRAW 2

                if (
                    value === "draw2"
                ) {

                    if (
                        game.stackCount === 0
                    ) {

                        game.stackCount = 2;

                    }

                    game.currentPlayer =
                        (
                            game.currentPlayer + 1
                        ) % 2;

                }

                // DRAW 4

                else if (
                    value === "draw4"
                ) {

                    if (
                        game.stackCount === 0
                    ) {

                        game.stackCount = 4;

                    }

                    game.currentPlayer =
                        (
                            game.currentPlayer + 1
                        ) % 2;

                }

                // DRAW 6

                else if (
                    value === "draw6"
                ) {

                    if (
                        game.stackCount === 0
                    ) {

                        game.stackCount = 6;

                    }

                    game.currentPlayer =
                        (
                            game.currentPlayer + 1
                        ) % 2;

                }

                // DRAW 10

                else if (
                    value === "draw10"
                ) {

                    if (
                        game.stackCount === 0
                    ) {

                        game.stackCount = 10;

                    }

                    game.currentPlayer =
                        (
                            game.currentPlayer + 1
                        ) % 2;

                }

                // SKIP

                else if (
                    value === "skip"
                ) {

                    game.currentPlayer =
                        (
                            game.currentPlayer + 2
                        ) % 2;

                }

                // REVERSE

                else if (
                    value === "reverse"
                ) {

                    game.currentPlayer =
                        (
                            game.currentPlayer + 2
                        ) % 2;

                }

                // SKIP EVERYONE

                else if (
                    value === "skipeveryone"
                ) {

                    game.currentPlayer =
                        game.currentPlayer;

                }

                // 7 SWAP

                else if (
                    value === "7"
                ) {

                    const temp =
                        game.hands[
                            socket.id
                        ];

                    game.hands[
                        socket.id
                    ] = game.hands[
                        nextPlayerId
                    ];

                    game.hands[
                        nextPlayerId
                    ] = temp;

                    game.currentPlayer =
                        (
                            game.currentPlayer + 1
                        ) % 2;

                }

                // 0 PASS

                else if (
                    value === "0"
                ) {

                    const temp =
                        game.hands[
                            socket.id
                        ];

                    game.hands[
                        socket.id
                    ] = game.hands[
                        nextPlayerId
                    ];

                    game.hands[
                        nextPlayerId
                    ] = temp;

                    game.currentPlayer =
                        (
                            game.currentPlayer + 1
                        ) % 2;

                }

                // DISCARD ALL

                else if (
                    value === "discardall"
                ) {

                    const filtered =
                        hand.filter(
                            card =>

                                !card.startsWith(
                                    color
                                )
                        );

                    game.hands[
                        socket.id
                    ] = filtered;

                    game.currentPlayer =
                        (
                            game.currentPlayer + 1
                        ) % 2;

                }

                // COLOR ROULETTE

                else if (
                    value === "colorroulette"
                ) {

                    game.roulette = {

                        victim:
                            nextPlayerId,

                        color:
                            data.chosenColor

                    };

                    game.currentPlayer =
                        (
                            game.currentPlayer + 1
                        ) % 2;

                }

                // NORMAL

                else {

                    game.stackCount = 0;

                    game.currentPlayer =
                        (
                            game.currentPlayer + 1
                        ) % 2;

                }

                // =====================
                // UNO CHECK
                // =====================

                const currentHand =
                    game.hands[
                        socket.id
                    ];

                if (
                    currentHand.length === 1
                ) {

                    if (
                        !game.uno[
                            socket.id
                        ]
                    ) {

                        currentHand.push(
                            randomCard()
                        );

                        currentHand.push(
                            randomCard()
                        );

                    }

                    game.uno[
                        socket.id
                    ] = false;

                }

                // =====================
                // WIN CHECK
                // =====================

                if (
                    currentHand.length === 0
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

        // =====================
        // DRAW CARD
        // =====================

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

                const hand =
                    game.hands[
                        socket.id
                    ];

                // =====================
                // COLOR ROULETTE
                // =====================

                if (
                    game.roulette &&
                    game.roulette.victim ===
                    socket.id
                ) {

                    const drawnCard =
                        randomCard();

                    hand.push(
                        drawnCard
                    );

                    io.to(
                        roomCode
                    ).emit(
                        "gameState",
                        game
                    );

                    if (
                        drawnCard.startsWith(
                            game.roulette.color
                        )
                    ) {

                        game.roulette =
                            null;

                        game.currentPlayer =
                            (
                                game.currentPlayer + 1
                            ) % 2;

                    }

                    return;

                }

                // STACK PENALTY

                if (
                    game.stackCount > 0
                ) {

                    for (
                        let i = 0;
                        i < game.stackCount;
                        i++
                    ) {

                        hand.push(
                            randomCard()
                        );

                    }

                    game.stackCount = 0;

                } else {

                    hand.push(
                        randomCard()
                    );

                }

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

        // =====================
        // SAY UNO
        // =====================

        socket.on(
            "sayUNO",
            roomCode => {

                const room =
                    rooms[roomCode];

                if (!room) {
                    return;
                }

                room.gameState.uno[
                    socket.id
                ] = true;

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

            }
        );

    }
);

server.listen(
    3000,
    () => {

        console.log(
            "Server running on port 3000"
        );

    }
);