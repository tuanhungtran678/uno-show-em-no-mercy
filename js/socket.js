const socket = io("http://localhost:3000");

let roomCode = "";

// CREATE ROOM
document
    .getElementById("create-room-btn")
    .onclick = () => {

        console.log("Creating room...");

        socket.emit("createRoom");

    };

// JOIN ROOM
document
    .getElementById("join-room-btn")
    .onclick = () => {

        roomCode =
            document
                .getElementById("room-input")
                .value
                .toUpperCase();

        socket.emit(
            "joinRoom",
            roomCode
        );

    };

// ROOM CREATED
socket.on("roomCreated", code => {

    roomCode = code;

    console.log(
        "Room created:",
        code
    );

    alert(
        "Room Code: " + code
    );

});

// GAME START
socket.on("gameStart", () => {

    alert(
        "Game Started!"
    );

});

// ERRORS
socket.on("errorMessage", message => {

    alert(message);

});