function canPlay(card, topCard) {

    return (
        card.color === topCard.color ||
        card.value === topCard.value
    );

}

module.exports = {
    canPlay
};
