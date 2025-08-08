const game = {
    player: {
        name: "Player",
        chips: 200,
        bet: 10
    },
    cards: [],
    sum: 0,
    hasBlackJack: false,
    isPlaying: false
};

const messageEl = document.getElementById("message-el");
const cardsEl = document.getElementById("cards-el");
const sumEl = document.getElementById("sum-el");
const playerEl = document.getElementById("player-el");
const startBtn = document.getElementById("start-btn");
const newCardBtn = document.getElementById("new-card-btn");

startBtn.addEventListener("click", startGame);
newCardBtn.addEventListener("click", newCard);

updatePlayer();

function getRandomCard() {
    const randomValue = Math.floor(Math.random() * 13) + 1;
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const suit = suits[Math.floor(Math.random() * 4)];
    
    let value, displayValue;

    if (randomValue > 10) {
        value = 10;
        const royals = ['J', 'Q', 'K'];
        displayValue = royals[randomValue - 11] || 'J';
    } else if (randomValue === 1) {
        value = 11;
        displayValue = 'A';
    } else {
        value = randomValue;
        displayValue = randomValue;
    }

    return { value, displayValue, suit };
}

function startGame() {
    if (game.player.chips <= 0) {
        messageEl.textContent = "Not enough chips!";
        return;
    }

    game.isPlaying = true;
    game.hasBlackJack = false;
    game.cards = [getRandomCard(), getRandomCard()];
    game.sum = game.cards[0].value + game.cards[1].value;
    game.player.chips -= game.player.bet;

    renderGame();
    updateButtons();
    updatePlayer();
}

function newCard() {
    if (!game.isPlaying || game.hasBlackJack) return;

    const card = getRandomCard();
    game.cards.push(card);
    game.sum += card.value;

    renderGame();
}

function renderGame() {
    cardsEl.innerHTML = "";
    game.cards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.className = `card ${card.suit}`;
        cardElement.innerHTML = `
            <span>${card.suit === 'hearts' ? '♥' : 
                   card.suit === 'diamonds' ? '♦' : 
                   card.suit === 'clubs' ? '♣' : '♠'}</span>
            ${card.displayValue}
        `;
        cardsEl.appendChild(cardElement);
    });

    sumEl.textContent = `Sum: ${game.sum}`;

    if (game.sum < 21) {
        messageEl.textContent = "Do you want to draw another card?";
    } else if (game.sum === 21) {
        messageEl.textContent = "BLACKJACK! You win!";
        game.hasBlackJack = true;
        game.player.chips += Math.floor(game.player.bet * 2.5);
        endGame();
    } else {
        messageEl.textContent = "You're out of the game!";
        endGame();
    }
}

function endGame() {
    game.isPlaying = false;
    updateButtons();
    updatePlayer();
}

function updateButtons() {
    startBtn.disabled = game.isPlaying;
    newCardBtn.disabled = !game.isPlaying || game.hasBlackJack;
}

function updatePlayer() {
    playerEl.textContent = `${game.player.name}: $${game.player.chips}`;
}
