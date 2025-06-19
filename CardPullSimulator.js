// Number of each item per rarity
const EXTICKET_NUM = 4;
const LEGENDARY_NUM = 23;
const GOLD_NUM = 37;
const SILVER_NUM = 37;
const BRONZE_NUM = 45;

// Vial costs for creating cards
const LEGENDARY_VIAL_COST = 3500;
const GOLD_VIAL_COST = 750;
const SILVER_VIAL_COST = 90;
const BRONZE_VIAL_COST = 50;

// Amount of vials obtained by liquidating cards
const LEGENDARY_VIAL_GAIN = 1200;
const GOLD_VIAL_GAIN = 200;
const SILVER_VIAL_GAIN = 20;
const BRONZE_VIAL_GAIN = 10;

// Amount of vials obtained by liquidating animated cards
const ANIMATED_LEGENDARY_VIAL_GAIN = 2500;
const ANIMATED_GOLD_VIAL_GAIN = 450;
const ANIMATED_SILVER_VIAL_GAIN = 50;
const ANIMATED_BRONZE_VIAL_GAIN = 30;

// Amount of cards in a starter deck
const LEGENDARY_STARTER_NUM = 1;
const GOLD_STARTER_NUM = 3;
const SILVER_STARTER_NUM = 18;
const BRONZE_STARTER_NUM = 18;

// Represents the probability mass function for ExTicket/Legendary/Gold/Silver/Bronze for cards 1 to 7 in the pack
const PMF_NORMAL_CARD = [0.0006, 0.015, 0.06, 0.25, 0.6744];
// Same but for Card 8 only, which has a different probability mass function (only Silver or higher)
const PMF_RATEUP_CARD = [0.0006, 0.015, 0.06, 0.9244];
const CARD_RARITY = ["ExTicket", "Legendary", "Gold", "Silver", "Bronze"];

// The cumulative distribution functions for both pmfs. From https://stackoverflow.com/a/57130749.
// Calculated by adding the previous value to the next for each probability in the pmf. The values are: 
// [ 0.0006, 0.0156, 0.0756, 0.3256, 1 ]
// [ 0.0006, 0.0156, 0.0756, 1 ]
const CDF_NORMAL_CARD = PMF_NORMAL_CARD.map((sum => value => sum += value)(0));
const CDF_RATEUP_CARD = PMF_RATEUP_CARD.map((sum => value => sum += value)(0));

// Every card has 8% chance of being animated
const ANIMATED_ART_CHANCE = 0.08;

// Create the card pool. Used to check the rarity of a card.
// In theory it's better memory-wise to use a bunch of if-statements
// to check if a card index is between the rarity amounts, but
// accessing an array element is faster than stepping through the if-statements.
function createCardPool() {
    let cardPool = []
    for(let i = 0; i < EXTICKET_NUM; i++) {
        cardPool.push("ExTicket");
    }
    for(let i = 0; i < LEGENDARY_NUM; i++) {
        cardPool.push("Legendary");
    }
    for(let i = 0; i < GOLD_NUM; i++) {
        cardPool.push("Gold");
    }
    for(let i = 0; i < SILVER_NUM; i++) {
        cardPool.push("Silver");
    }
    for(let i = 0; i < BRONZE_NUM; i++) {
        cardPool.push("Bronze");
    }
    return cardPool;
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

// These get functions return the index of a random card with the specified rarity in the card pool
function getRandomExTicket() {
    return getRandomInt(0, EXTICKET_NUM);
}

function getRandomLegendary() {
    return getRandomInt(EXTICKET_NUM, EXTICKET_NUM + LEGENDARY_NUM);
}

function getRandomGold() {
    return getRandomInt(EXTICKET_NUM + LEGENDARY_NUM, EXTICKET_NUM + LEGENDARY_NUM + GOLD_NUM);
}

function getRandomSilver() {
    return getRandomInt(EXTICKET_NUM + LEGENDARY_NUM + GOLD_NUM, EXTICKET_NUM + LEGENDARY_NUM + GOLD_NUM + SILVER_NUM);
}

function getRandomBronze() {
    return getRandomInt(EXTICKET_NUM + LEGENDARY_NUM + GOLD_NUM + SILVER_NUM, EXTICKET_NUM + LEGENDARY_NUM + GOLD_NUM + SILVER_NUM + BRONZE_NUM);
}

function getRandomCard(rarity) {
    switch(rarity) {
        case 0:
            return getRandomExTicket();
        case 1:
            return getRandomLegendary();
        case 2:
            return getRandomGold();
        case 3:
            return getRandomSilver();
        case 4:
            return getRandomBronze();
    }
}

// Function to draw cards 1 to 7 in the pack, returning the index of the drawn card
function drawNormalCard() {
    const randomNumber = Math.random();
    const rarity = CDF_NORMAL_CARD.findIndex(x => randomNumber <= x);
    return getRandomCard(rarity);
}

// Same as above but used to draw card 8 in the pack
function drawRateUpCard() {
    const randomNumber = Math.random();
    const rarity = CDF_RATEUP_CARD.findIndex(x => randomNumber <= x);
    return getRandomCard(rarity);
}

function drawPack(pity) {
    let pack = [];
    for(let i = 0; i < 7; i++) {
        pack.push(drawNormalCard());
    }
    if(pity < 10) {
        pack.push(drawRateUpCard());
    } else {
        // Guaranteed legendary on pity
        pack.push(getRandomLegendary());
    }
    return pack;
}

function isPackContainsLegendary(pack) {
    return pack.some((element) => element >= EXTICKET_NUM && element < EXTICKET_NUM + LEGENDARY_NUM);
}

function getCardVialCost(card, cardPool) {
    switch(cardPool[card]) {
        case "ExTicket":
            return 0;
        case "Legendary":
            return LEGENDARY_VIAL_COST;
        case "Gold":
            return GOLD_VIAL_COST;
        case "Silver":
            return SILVER_VIAL_COST;
        case "Bronze":
            return BRONZE_VIAL_COST;
    }
}

function getCardVialGain(card, cardPool) {
    switch(cardPool[card]) {
        case "ExTicket":
            return 0;
        case "Legendary":
            return LEGENDARY_VIAL_GAIN;
        case "Gold":
            return GOLD_VIAL_GAIN;
        case "Silver":
            return SILVER_VIAL_GAIN;
        case "Bronze":
            return BRONZE_VIAL_GAIN;
    }
}

function getAnimatedCardVialGain(card, cardPool) {
    switch(cardPool[card]) {
        case "ExTicket":
            return 0;
        case "Legendary":
            return ANIMATED_LEGENDARY_VIAL_GAIN;
        case "Gold":
            return ANIMATED_GOLD_VIAL_GAIN;
        case "Silver":
            return ANIMATED_SILVER_VIAL_GAIN;
        case "Bronze":
            return ANIMATED_BRONZE_VIAL_GAIN;
    }
}

function getNumVialsToCompleteSet(ownedCards, cardPool) {
    const vialsNeededPerCard = ownedCards.map((x, i) => Math.max(0, 3 - x[0] - x[1]) * getCardVialCost(i, cardPool));
    return vialsNeededPerCard.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

// Returns the vials you get from liquidizing extra cards,
// prioritizing cards with animated art since they give more vials.
// This function mutates ownedCards.
function liquidizeExtraCards(ownedCards, cardPool) {
    let vialsGainedPerCard = []
    for(let i = 0; i < ownedCards.length; i++) {
        let numVials = 0;
        while(ownedCards[i][0] + ownedCards[i][1] > 3) {
            if(ownedCards[i][1] > 0) {
                ownedCards[i][1] -= 1;
                numVials += getAnimatedCardVialGain(i, cardPool)
            } else {
                ownedCards[i][0] -= 1;
                numVials += getCardVialGain(i, cardPool);
            }
        }
        vialsGainedPerCard[i] = numVials;
    }
    return vialsGainedPerCard.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

function runTrial() {
    let numPacksToCompleteSet = 0;
    const cardPool = createCardPool();
    let ownedCards = [];
    for(let i = 0; i < cardPool.length; i++) {
        // First entry is regular art. Second entry is animated art.
        ownedCards.push([0, 0]);
    }

    // Simulate 30 daily packs which don't count for pity.
    // Uncomment if you want to use this.
    // for(let i = 0; i < 30; i++) {
    //     const pack = drawPack(0);
    //     for(let j = 0; j < pack.length; j++) {
    //         const card = pack[j];
    //         const isCardAnimated = Math.random() <= ANIMATED_ART_CHANCE;
    //         if(isCardAnimated) {
    //             ownedCards[card][1] += 1;
    //         } else {
    //             ownedCards[card][0] += 1;
    //         }
    //     }
    // }

    // Add starter deck cards to owned cards.
    // Since each card in the same rarity is equally likely to be pulled given the rarity,
    // it doesn't matter which card ID we use as long as the starting number of cards are the same.
    ownedCards[EXTICKET_NUM] = [LEGENDARY_STARTER_NUM, 0];
    ownedCards[EXTICKET_NUM + LEGENDARY_NUM] = [GOLD_STARTER_NUM, 0];
    for(let i = 0; i < SILVER_STARTER_NUM/3; i++) {
        ownedCards[EXTICKET_NUM + LEGENDARY_NUM + GOLD_NUM + i] = [3, 0];
    }
    for(let i = 0; i < BRONZE_STARTER_NUM/3; i++) {
        ownedCards[EXTICKET_NUM + LEGENDARY_NUM + GOLD_NUM + SILVER_NUM + i] = [3, 0];
    }

    let pity = 0;
    let ownedVials = 0;
    while(getNumVialsToCompleteSet(ownedCards, cardPool) > ownedVials) {
        pity += 1;
        const pack = drawPack(pity);
        numPacksToCompleteSet += 1;
        if(isPackContainsLegendary(pack)) {
            pity = 0;
        }
        for(let i = 0; i < pack.length; i++) {
            const card = pack[i];
            const isCardAnimated = Math.random() <= ANIMATED_ART_CHANCE;
            // Technically here you can generate an "animated ExTicket". It doesn't mean anything,
            // and it doesn't matter in this case because you can't vial it anyway.
            if(isCardAnimated) {
                ownedCards[card][1] += 1;
            } else {
                ownedCards[card][0] += 1;
            }
        }
        ownedVials += liquidizeExtraCards(ownedCards, cardPool);
    }
    return numPacksToCompleteSet;
}

const results = [];
const NUM_TRIALS = 100000;
const fs = require('node:fs');

for(let i = 0; i < NUM_TRIALS; i++) {
    results.push(runTrial());
    if(i % (NUM_TRIALS/100) == 0) {
        console.log("Progress: " + Math.round(i/NUM_TRIALS * 100) + "%");
    }
}
const filePath = 'trial_results_without_daily_packs.csv';
fs.writeFile(filePath, results.join('\n'), err => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('Finished.');
    }
});