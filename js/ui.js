function renderOnlineGame(
    game
) {

    const handDiv =
        document.getElementById(
            "hand"
        );

    handDiv.innerHTML = "";

    const myHand =
        game.hands[socket.id];

    if (!myHand) {
        return;
    }

    // UNO BUTTON

    const unoBtn =

        document.getElementById(
            "uno-btn"
        );

    if (
        myHand.length === 1
    ) {

        unoBtn.style.display =
            "inline-block";

    } else {

        unoBtn.style.display =
            "none";

    }

    // TURN

    const currentPlayerId =

        Object.keys(
            game.hands
        )[game.currentPlayer];

    document
        .getElementById(
            "turn-text"
        )
        .innerText =

        currentPlayerId === socket.id
            ? "YOUR TURN"
            : "OPPONENT TURN";

    // TOP CARD

    const topDiv =
        document.getElementById(
            "top-card"
        );

    const topParts =
        game.topCard.split("-");

    const topColor =
        topParts[0];

    const topValue =
        topParts[1];

    topDiv.className =
        "";

    topDiv.classList.add(
        "card"
    );

    topDiv.classList.add(
        topColor
    );

    topDiv.innerText =
        topValue.toUpperCase();

    // HAND

    myHand.forEach(
        (
            card,
            index
        ) => {

            const div =
                document.createElement(
                    "div"
                );

            div.classList.add(
                "card"
            );

            const parts =
                card.split("-");

            const color =
                parts[0];

            const value =
                parts[1];

            div.classList.add(
                color
            );

           let displayValue =
    value.toUpperCase();

// ICONS

if (
    value === "skip"
) {

    displayValue = "🚫";

}

else if (
    value === "reverse"
) {

    displayValue = "🔄";

}

else if (
    value === "draw2"
) {

    displayValue = "+2";

}

else if (
    value === "draw4"
) {

    displayValue = "+4";

}

else if (
    value === "draw6"
) {

    displayValue = "+6";

}

else if (
    value === "draw10"
) {

    displayValue = "+10";

}

else if (
    value === "wild"
) {

    displayValue = "🌈";

}

div.setAttribute(
    "data-value",
    displayValue
);

div.innerHTML = `
    <span>
        ${displayValue}
    </span>
`;

            div.onclick = () => {

                playCard(
                    index
                );

            };

            handDiv.appendChild(
                div
            );

        }
    );

}