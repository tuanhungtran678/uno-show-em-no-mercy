const colors = ["red", "blue", "green", "yellow"];

class Card {

    constructor(color, type, value = null) {

        this.color = color;
        this.type = type;
        this.value = value;

    }

}

function createDeck(deck) {

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

}