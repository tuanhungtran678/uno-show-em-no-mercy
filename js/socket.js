const socket = io(
    "http://localhost:3000"
);

// =====================
// GLOBAL ROOM CODE
// =====================

window.roomCode = "";

// =====================
// GUEST NAME
// =====================

window.guestName =

    "Guest" +

    Math.floor(
        Math.random() * 1000
    );

document
    .getElementById(
        "guest-name"
    )
    .innerText =
    guestName;

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

        const code =

            document
                .getElementById(
                    "room-input"
                )
                .value
                .trim()
                .toUpperCase();

        if (!code) {

            alert(
                "Enter room code"
            );

            return;

        }

        roomCode = code;

        socket.emit(
            "joinRoom",
            {
                roomCode,
                guestName
            }
        );

    };

// =====================
// ROOM CREATED
// =====================

socket.on(
    "roomCreated",
    code => {

        roomCode = code;

        console.log(
            "ROOM:",
            roomCode
        );

        document
            .getElementById(
                "waiting-screen"
            )
            .style.display =
            "block";

        document
            .getElementById(
                "room-code-text"
            )
            .innerText =
            roomCode;

    }
);

// =====================
// GAME START
// =====================

socket.on(
    "gameStart",
    () => {

        document
            .getElementById(
                "waiting-screen"
            )
            .style.display =
            "none";

        document
            .getElementById(
                "menu"
            )
            .style.display =
            "none";

    }
);

// =====================
// GAME STATE
// =====================

socket.on(
    "gameState",
    game => {

        console.log(
            "GAME STATE:",
            game
        );

        renderOnlineGame(
            game
        );

    }
);

// =====================
// GAME ENDED
// =====================

socket.on(
    "gameEnded",
    winnerId => {

        if (
            winnerId === socket.id
        ) {

            alert(
                "YOU WIN!"
            );

        } else {

            alert(
                "YOU LOSE!"
            );

        }

    }
);

// =====================
// ERROR
// =====================

socket.on(
    "errorMessage",
    message => {

        alert(message);

    }
);