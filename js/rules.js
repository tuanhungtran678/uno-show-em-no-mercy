function canPlay(
    card,
    topCard
) {

    // =====================
    // SAFETY CHECK
    // =====================

    if (
        !card ||
        !topCard
    ) {

        return false;

    }

    // =====================
    // SPLIT CARD DATA
    // =====================

    // Example:
    // "red-5"
    // "blue-skip"
    // "wild-draw4"

    const cardParts =
        card.split("-");

    const topParts =
        topCard.split("-");

    // =====================
    // CARD VALUES
    // =====================

    const cardColor =
        cardParts[0];

    const cardValue =
        cardParts[1];

    const topColor =
        topParts[0];

    const topValue =
        topParts[1];

    // =====================
    // RULES
    // =====================

    // Same color

    if (
        cardColor === topColor
    ) {

        return true;

    }

    // Same value

    if (
        cardValue === topValue
    ) {

        return true;

    }

    // Wild cards

    if (
        cardColor === "wild"
    ) {

        return true;

    }

    // Invalid

    return false;

}