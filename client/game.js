const colors = ["red", "blue", "green", "yellow"];

class Card {
    constructor(color, value) {
        this.color = color;
        this.value = value;
    }
}

const deck = [];

function createDeck() {

    for (const color of colors) {

        for (let i = 0; i <= 9; i++) {
            deck.push(new Card(color, i));
        }

    }

    shuffle(deck);
}

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

}

const playerHand = [];

function drawCard() {

    const card = deck.pop();

    playerHand.push(card);

    renderHand();
}

function renderHand() {

    const hand = document.getElementById("hand");

    hand.innerHTML = "";

    playerHand.forEach((card, index) => {

        const div = document.createElement("div");

        div.classList.add("card");
        div.classList.add(card.color);

        div.innerText = card.value;

        div.onclick = () => playCard(index);

        hand.appendChild(div);
    });

}

function playCard(index) {

    const card = playerHand[index];

    document.getElementById("top-card").innerText = card.value;
    document.getElementById("top-card").className = card.color;

    playerHand.splice(index, 1);

    renderHand();
}

createDeck();

for (let i = 0; i < 7; i++) {
    drawCard();
}

document.getElementById("draw-btn").onclick = drawCard;
