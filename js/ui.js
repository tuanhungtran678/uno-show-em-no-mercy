function render(players, currentPlayer, topCard, stackAmount) {

    const handDiv = document.getElementById("hand");

    handDiv.innerHTML = "";

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

    document.getElementById("turn-text").innerText =
        "Turn: " + players[currentPlayer].name;

    document.getElementById("stack-text").innerText =
        stackAmount > 0
            ? "+" + stackAmount
            : "";

    const top = document.getElementById("top-card");

    top.innerText =
        topCard.type === "number"
            ? topCard.value
            : topCard.type.toUpperCase();

    top.className = topCard.color;

}