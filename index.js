document.addEventListener('DOMContentLoaded', function() {
    // Game state
    const game = {
        player: {
            name: "Player",
            chips: 200,
            bet: 10
        },
        cards: [],
        sum: 0,
        hasBlackjack: false,
        isPlaying: false,
        message: ""
    };

    // DOM elements
    const elements = {
        message: document.getElementById("message-el"),
        cardsContainer: document.getElementById("cards-container"),
        sum: document.getElementById("sum-el"),
        player: document.getElementById("player-el"),
        startBtn: document.getElementById("start-btn"),
        newCardBtn: document.getElementById("new-card-btn")
    };

    // Event listeners
    elements.startBtn.addEventListener('click', startGame);
    elements.newCardBtn.addEventListener('click', newCard);

    // Initialize game display
    updatePlayerDisplay();

    // Game functions
    function getRandomCard() {
        const randomValue = Math.floor(Math.random() * 13) + 1;
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const randomSuit = suits[Math.floor(Math.random() * 4)];
        
        let cardValue;
        let displayValue;
        
        if (randomValue > 10) {
            cardValue = 10;
            if (randomValue === 11) displayValue = 'J';
            else if (randomValue === 12) displayValue = 'Q';
            else displayValue = 'K';
        } else if (randomValue === 1) {
            cardValue = 11;
            displayValue = 'A';
        } else {
            cardValue = randomValue;
            displayValue = randomValue;
        }
        
        return {
            value: cardValue,
            display: displayValue,
            suit: randomSuit
        };
    }

    function startGame() {
        // Check if player has enough chips
        if (game.player.chips < game.player.bet) {
            game.message = "Not enough chips!";
            updateMessage();
            return;
        }

        // Reset game state
        game.cards = [getRandomCard(), getRandomCard()];
        game.sum = game.cards[0].value + game.cards[1].value;
        game.hasBlackjack = false;
        game.isPlaying = true;
        
        // Place bet
        game.player.chips -= game.player.bet;
        
        // Update UI
        renderGame();
        updatePlayerDisplay();
        toggleButtons();
    }

    function newCard() {
        if (game.isPlaying && !game.hasBlackjack) {
            const card = getRandomCard();
            game.cards.push(card);
            game.sum += card.value;
            renderGame();
        }
    }

    function renderGame() {
        // Clear cards container
        elements.cardsContainer.innerHTML = "";
        
        // Display cards with suits
        game.cards.forEach(card => {
            const cardElement = document.createElement("div");
            cardElement.className = `card ${card.suit}`;
            cardElement.textContent = card.display;
            elements.cardsContainer.appendChild(cardElement);
        });
        
        // Update sum display
        elements.sum.textContent = `Sum: ${game.sum}`;
        
        // Check game status
        if (game.sum < 21) {
            game.message = "Do you want to draw another card?";
        } else if (game.sum === 21) {
            game.message = "BLACKJACK! You win!";
            game.hasBlackjack = true;
            const winnings = Math.floor(game.player.bet * 2.5); // Blackjack pays 3:2
            game.player.chips += winnings;
            endGame();
        } else {
            game.message = "You busted! Game over.";
            endGame();
        }
        
        updateMessage();
    }

    function endGame() {
        game.isPlaying = false;
        toggleButtons();
        updatePlayerDisplay();
    }

    function toggleButtons() {
        elements.startBtn.disabled = game.isPlaying;
        elements.newCardBtn.disabled = !game.isPlaying || game.hasBlackjack;
    }

    function updatePlayerDisplay() {
        elements.player.textContent = `${game.player.name}: $${game.player.chips}`;
    }

    function updateMessage() {
        elements.message.textContent = game.message;
    }
});
