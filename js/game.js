// =========================
// SOCKET.IO
// =========================

const socket = io(
    "http://localhost:3000"
);

let roomCode = "";

// =========================
// ROOM UI
// =========================

document
    .getElementById("create-room-btn")
    .onclick = () => {

        socket.emit("createRoom");

    };

document
    .getElementById("join-room-btn")
    .onclick = () => {

        roomCode =
            document
                .getElementById("room-input")
                .value
                .toUpperCase();

        socket.emit(
            "joinRoom",
            roomCode
        );

    };

// =========================
// SOCKET EVENTS
// =========================

socket.on("roomCreated", code => {

    roomCode = code;

    alert(
        "Room Created: " + code
    );

});

socket.on("gameStart", () => {

    alert(
        "Game Started!"
    );

});

socket.on("errorMessage", message => {

    alert(message);

});

socket.on("gameState", game => {

    onlineGameState = game;

    renderOnlineGame(game);

});

// =========================
// CARD CLASS
// =========================

class Card {

    constructor(
        color,
        type,
        value = null
    ) {

        this.color = color;
        this.type = type;
        this.value = value;

    }

}

// =========================
// GLOBALS
// =========================

const colors = [
    "red",
    "blue",
    "green",
    "yellow"
];

const deck = [];

const players = [
    {
        name: "You",
        hand: []
    },
    {
        name: "Bot",
        hand: []
    }
];

let currentPlayer = 0;

let direction = 1;

let topCard = null;

let stackAmount = 0;

let saidUNO = false;

let onlineGameState = null;

// =========================
// DOM
// =========================

const handDiv =
    document.getElementById("hand");

const topCardDiv =
    document.getElementById("top-card");

// =========================
// CREATE DECK
// =========================

function createDeck() {

    for (const color of colors) {

        for (let i = 0; i <= 9; i++) {

            deck.push(
                new Card(
                    color,
                    "number",
                    i
                )
            );

        }

        deck.push(
            new Card(color, "skip")
        );

        deck.push(
            new Card(color, "reverse")
        );

        deck.push(
            new Card(color, "draw2")
        );

    }

    deck.push(
        new Card("wild", "draw4")
    );

    deck.push(
        new Card("wild", "draw10")
    );

    shuffle(deck);

}

// =========================
// SHUFFLE
// =========================

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];

    }

}

// =========================
// DRAW CARD
// =========================

function drawCard(
    playerIndex,
    amount = 1
) {

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const card = deck.pop();

        players[playerIndex]
            .hand
            .push(card);

    }

    checkMercyRule(playerIndex);

}

// =========================
// START GAME
// =========================

function startGame() {

    createDeck();

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        drawCard(0);
        drawCard(1);

    }

    topCard = deck.pop();

    render();

}

// =========================
// RENDER
// =========================

function render() {

    handDiv.innerHTML = "";

    topCardDiv.innerText =
        topCard.type === "number"
            ? topCard.value
            : topCard.type.toUpperCase();

    topCardDiv.className = "";

    topCardDiv.classList.add(
        topCard.color
    );

    players[0].hand.forEach(
        (card, index) => {

            const div =
                document.createElement(
                    "div"
                );

            div.classList.add(
                "card"
            );

            div.classList.add(
                card.color
            );

            div.innerText =
                card.type === "number"
                    ? card.value
                    : card.type.toUpperCase();

            div.onclick =
                () => playCard(index);

            handDiv.appendChild(div);

        }
    );

    document
        .getElementById("turn-text")
        .innerText =
            "Turn: " +
            players[currentPlayer].name;

    document
        .getElementById("bot-cards")
        .innerText =
            "Bot Cards: " +
            players[1].hand.length;

    document
        .getElementById("stack-text")
        .innerText =
            stackAmount > 0
                ? "+" + stackAmount
                : "";

}

// =========================
// ONLINE RENDER
// =========================

function renderOnlineGame(game) {

    document
        .getElementById("top-card")
        .innerText =
            game.topCard;

}

// =========================
// RULES
// =========================

function canPlay(card) {

    if (stackAmount > 0) {

        const stackValues = {

            draw2: 2,

            draw4: 4,

            draw10: 10

        };

        if (
            !stackValues[card.type]
        ) {

            return false;

        }

        return (
            stackValues[card.type]
            >= stackAmount
        );

    }

    return (

        card.color === topCard.color ||

        card.type === topCard.type ||

        card.value === topCard.value ||

        card.color === "wild"

    );

}

// =========================
// PLAY CARD
// =========================

function playCard(index) {

    if (currentPlayer !== 0) {
        return;
    }

    const card =
        players[0].hand[index];

    if (!canPlay(card)) {

        alert(
            "Invalid card!"
        );

        return;

    }

    if (card.color === "wild") {

        const chosenColor =
            prompt(
                "Choose color: red, blue, green, yellow"
            );

        card.color =
            chosenColor;

    }

    players[0]
        .hand
        .splice(index, 1);

    topCard = card;

    applyCardEffect(card, 1);

    if (
        players[0].hand.length === 1
        &&
        !saidUNO
    ) {

        alert(
            "Forgot UNO! Draw 2."
        );

        drawCard(0, 2);

    }

    if (
        players[0].hand.length === 0
    ) {

        alert("You Win!");

        location.reload();

    }

    socket.emit(
        "playCard",
        {
            roomCode,
            cardIndex: index
        }
    );

    render();

    setTimeout(
        botTurn,
        1000
    );

}

// =========================
// CARD EFFECTS
// =========================

function applyCardEffect(
    card,
    nextPlayer
) {

    switch (card.type) {

        case "skip":

            currentPlayer = (
                currentPlayer +
                direction * 2 +
                players.length
            ) % players.length;

            break;

        case "reverse":

            direction *= -1;

            currentPlayer = (
                currentPlayer +
                direction +
                players.length
            ) % players.length;

            break;

        case "draw2":

            stackAmount += 2;

            currentPlayer =
                nextPlayer;

            break;

        case "draw4":

            stackAmount += 4;

            currentPlayer =
                nextPlayer;

            break;

        case "draw10":

            stackAmount += 10;

            currentPlayer =
                nextPlayer;

            break;

        default:

            currentPlayer =
                nextPlayer;

    }

}

// =========================
// NEXT TURN
// =========================

function nextTurn() {

    currentPlayer = (

        currentPlayer +
        direction +
        players.length

    ) % players.length;

}

// =========================
// BOT TURN
// =========================

function botTurn() {

    if (currentPlayer !== 1) {
        return;
    }

    const botHand =
        players[1].hand;

    botHand.sort((a, b) => {

        const priority = {

            draw10: 5,

            draw4: 4,

            draw2: 3,

            skip: 2,

            reverse: 1,

            number: 0

        };

        return (
            priority[b.type]
            -
            priority[a.type]
        );

    });

    let played = false;

    for (
        let i = 0;
        i < botHand.length;
        i++
    ) {

        const card =
            botHand[i];

        if (canPlay(card)) {

            botHand.splice(i, 1);

            topCard = card;

            applyCardEffect(
                card,
                0
            );

            played = true;

            break;

        }

    }

    if (!played) {

        if (stackAmount > 0) {

            drawCard(
                1,
                stackAmount
            );

            stackAmount = 0;

        } else {

            drawCard(1, 1);

        }

        nextTurn();

    }

    if (botHand.length === 0) {

        alert("Bot Wins!");

        location.reload();

    }

    render();

}

// =========================
// MERCY RULE
// =========================

function checkMercyRule(
    playerIndex
) {

    if (
        players[playerIndex]
            .hand
            .length >= 25
    ) {

        alert(

            players[playerIndex].name +
            " eliminated!"

        );

        location.reload();

    }

}

// =========================
// DRAW BUTTON
// =========================

document
    .getElementById("draw-btn")
    .onclick = () => {

        if (
            currentPlayer !== 0
        ) {
            return;
        }

        if (stackAmount > 0) {

            drawCard(
                0,
                stackAmount
            );

            stackAmount = 0;

        } else {

            drawCard(0, 1);

        }

        nextTurn();

        render();

        setTimeout(
            botTurn,
            1000
        );

    };

// =========================
// UNO BUTTON
// =========================

document
    .getElementById("uno-btn")
    .onclick = () => {

        if (
            players[0].hand.length === 2
        ) {

            saidUNO = true;

            alert("UNO!");

        }

    };

// =========================
// START
// =========================

startGame();