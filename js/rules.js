function canPlay(card, topCard, stackAmount) {

    if (stackAmount > 0) {

        const values = {
            draw2: 2,
            draw4: 4,
            draw10: 10
        };

        return values[card.type] >= stackAmount;

    }

    return (
        card.color === topCard.color ||
        card.type === topCard.type ||
        card.value === topCard.value ||
        card.color === "wild"
    );

}