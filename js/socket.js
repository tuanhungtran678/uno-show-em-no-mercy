const socket = io("http://localhost:3000");

socket.on("connect", () => {

    console.log("Connected!");

});
socket.on("roomCreated", roomCode => {

    alert(
        "Room Code: " + roomCode
    );

});

socket.on("gameStart", roomCode => {

    alert(
        "Game Started!"
    );

});

socket.on("errorMessage", message => {

    alert(message);

});