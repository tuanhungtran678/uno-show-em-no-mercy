

// =====================
// CREATE ROOM
// =====================

document
    .getElementById(
        "create-room-btn"
    )
    .onclick = () => {

        socket.emit(
            "createRoom",
            guestName
        );

    };

// =====================
// JOIN ROOM
// =====================

document
    .getElementById(
        "join-room-btn"
    )
    .onclick = () => {

        const input =

            document
                .getElementById(
                    "room-input"
                )
                .value
                .trim()
                .toUpperCase();

        if (!input) {

            alert(
                "Enter room code!"
            );

            return;

        }

        roomCode = input;

        socket.emit(
            "joinRoom",
            {
                roomCode,
                guestName
            }
        );

    };

// =====================
// DRAW CARD
// =====================

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

// =====================
// PLAY CARD
// =====================

function playCard(
    cardIndex
) {

    socket.emit(
        "playCard",
        {
            roomCode,
            cardIndex
        }
    );

}