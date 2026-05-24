function botTurn(botHand) {

    botHand.sort((a, b) => {

        const priority = {
            draw10: 5,
            draw4: 4,
            draw2: 3,
            skip: 2,
            reverse: 1,
            number: 0
        };

        return priority[b.type] - priority[a.type];

    });

}