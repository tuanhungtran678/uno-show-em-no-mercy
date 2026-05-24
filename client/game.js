const colors = ["red", "blue", "green", "yellow"];

const hand = document.getElementById("hand");

const deck = [];

function createDeck() {

    for (const color of colors) {

        for (let i = 0; i <= 9; i++) {

            deck.push({
                color,
                value: i
            });

        }

    }

}

function drawCard() {

    const card = deck.pop();

    const div = document.createElement("div");

    div.classList.add("card");
    div.classList.add(card.color);

    div.innerText = card.value;

    hand.appendChild(div);

}

createDeck();

for (let i = 0; i < 7; i++) {
    drawCard();
}