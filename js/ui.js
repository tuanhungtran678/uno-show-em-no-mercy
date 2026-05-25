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

    // =====================
    // TURN
    // =====================

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

    // =====================
    // TOP CARD
    // =====================

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

    // =====================
    // HAND
    // =====================

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

            div.innerText =
                value.toUpperCase();

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