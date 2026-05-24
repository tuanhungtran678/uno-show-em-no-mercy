const colors = ["red", "blue", "green", "yellow"];

class Card {
    constructor(color, type, value = null) {
        this.color = color;
        this.type = type;
        this.value = value;
    }
}

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

const handDiv = document.getElementById("hand");

const topCardDiv = document.getElementById("top-card");

function createDeck() {

    for (const color of colors) {

        for (let i = 0; i <= 9; i++) {

            deck.push(new Card(color, "number", i));

        }

        deck.push(new Card(color, "skip"));
        deck.push(new Card(color, "reverse"));
        deck.push(new Card(color, "draw2"));

    }

    deck.push(new Card("wild", "draw4"));
    deck.push(new Card("wild", "draw10"));

    shuffle(deck);
}

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

}

function drawCard(playerIndex, amount = 1) {

    for (let i = 0; i < amount; i++) {

        const card = deck.pop();

        players[playerIndex].hand.push(card);

    }

}

function startGame() {

    createDeck();

    for (let i = 0; i < 7; i++) {

        drawCard(0);
        drawCard(1);

    }

    topCard = deck.pop();

    render();
}

function render() {

    handDiv.innerHTML = "";

    topCardDiv.innerText =
        topCard.type === "number"
            ? topCard.value
            : topCard.type.toUpperCase();

    topCardDiv.className = "";
    topCardDiv.classList.add(topCard.color);

    players[0].hand.forEach((card, index) => {

        const div = document.createElement("div");

        div.classList.add("card");
        div.classList.add(card.color);

        div.innerText =
            card.type === "number"
                ? card.value
                : card.type.toUpperCase();

        div.onclick = () => playCard(index);

        handDiv.appendChild(div);

    });

}

function canPlay(card) {

    if (stackAmount > 0) {

        const stackValues = {
            draw2: 2,
            draw4: 4,
            draw10: 10
        };

        if (!stackValues[card.type]) {
            return false;
        }

        return stackValues[card.type] >= stackAmount;
    }

    return (
        card.color === topCard.color ||
        card.type === topCard.type ||
        card.value === topCard.value ||
        card.color === "wild"
    );

}

function playCard(index) {

    if (currentPlayer !== 0) {
        return;
    }

    const card = players[0].hand[index];

    if (!canPlay(card)) {

        alert("Invalid card!");

        return;
    }

    players[0].hand.splice(index, 1);

    topCard = card;

    applyCardEffect(card, 1);

    render();

    setTimeout(botTurn, 1000);

}

function applyCardEffect(card, nextPlayer) {

    switch (card.type) {

        case "skip":

            currentPlayer = (currentPlayer + direction * 2 + players.length) % players.length;

            break;

        case "reverse":

            direction *= -1;

            currentPlayer = (currentPlayer + direction + players.length) % players.length;

            break;

        case "draw2":

            stackAmount += 2;

            currentPlayer = nextPlayer;

            break;

        case "draw4":

            stackAmount += 4;

            currentPlayer = nextPlayer;

            break;

        case "draw10":

            stackAmount += 10;

            currentPlayer = nextPlayer;

            break;

        default:

            currentPlayer = nextPlayer;

    }

}

function nextTurn() {

    currentPlayer =
        (currentPlayer + direction + players.length) %
        players.length;

}

function botTurn() {

    if (currentPlayer !== 1) {
        return;
    }

    const botHand = players[1].hand;

    let played = false;

    for (let i = 0; i < botHand.length; i++) {

        const card = botHand[i];

        if (canPlay(card)) {

            botHand.splice(i, 1);

            topCard = card;

            applyCardEffect(card, 0);

            played = true;

            break;

        }

    }

    if (!played) {

        if (stackAmount > 0) {

            drawCard(1, stackAmount);

            stackAmount = 0;

        } else {

            drawCard(1, 1);

        }

        nextTurn();

    }

    render();

}

document.getElementById("draw-btn").onclick = () => {

    if (currentPlayer !== 0) {
        return;
    }

    if (stackAmount > 0) {

        drawCard(0, stackAmount);

        stackAmount = 0;

    } else {

        drawCard(0, 1);

    }

    nextTurn();

    render();

    setTimeout(botTurn, 1000);

};

startGame();