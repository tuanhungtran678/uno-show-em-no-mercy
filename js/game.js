let pendingWild = null;

// DRAW CARD

document
    .getElementById(
        "draw-btn"
    )
    .onclick = () => {

        socket.emit(
            "drawCard",
            roomCode
        );

    };

// PLAY CARD

function playCard(
    cardIndex
) {

    const game =
        window.latestGameState;

    const myHand =
        game.hands[
            socket.id
        ];

    const card =
        myHand[
            cardIndex
        ];

    // WILD CARD

    if (
        card.includes(
            "wild"
        )
    ) {

        pendingWild =
            cardIndex;

        document
            .getElementById(
                "color-picker"
            )
            .style.display =
            "flex";

        return;

    }

    socket.emit(
        "playCard",
        {
            roomCode,
            cardIndex
        }
    );

}

// UNO BUTTON

document
    .getElementById(
        "uno-btn"
    )
    .onclick = () => {

        socket.emit(
            "sayUNO",
            roomCode
        );

    };

document
    .querySelectorAll(
        ".color-btn"
    )
    .forEach(
        btn => {

            btn.onclick = () => {

                const color =

                    btn.innerText
                    .toLowerCase();

                socket.emit(
                    "playCard",
                    {
                        roomCode,

                        cardIndex:
                            pendingWild,

                        chosenColor:
                            color
                    }
                );

                document
                    .getElementById(
                        "color-picker"
                    )
                    .style.display =
                    "none";

            };

        }
    );