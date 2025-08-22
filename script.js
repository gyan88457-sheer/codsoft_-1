// --- GET HTML ELEMENTS ---
const messageText = document.getElementById('message-text');
const guessInput = document.getElementById('guess-input');
const guessButton = document.getElementById('guess-button');
const attemptsLeftSpan = document.getElementById('attempts-left');
const roundsWonSpan = document.getElementById('rounds-won');
const totalScoreSpan = document.getElementById('total-score');
const playAgainButton = document.getElementById('play-again-button');
const hudContainer = document.querySelector('.hud-container');

// --- GAME CONFIGURATION ---
const MIN_RANGE = 1;
const MAX_RANGE = 100;
const MAX_ATTEMPTS = 10;

// --- GAME STATE ---
let totalScore = 0;
let roundsWon = 0;
let numberToGuess = 0;
let attempts = 0;
let gameActive = false;

// --- FUNCTIONS ---

function startNewRound() {
    gameActive = true;
    attempts = 0;
    numberToGuess = Math.floor(Math.random() * (MAX_RANGE - MIN_RANGE + 1)) + MIN_RANGE;

    // Reset UI elements and styles
    messageText.textContent = "AWAITING INPUT...";
    messageText.style.color = "var(--primary-glow)";
    guessInput.value = "";
    guessInput.disabled = false;
    guessButton.disabled = false;
    playAgainButton.classList.add('hidden');
    hudContainer.style.borderColor = "var(--primary-glow)";
    hudContainer.style.boxShadow = "0 0 25px var(--primary-glow), inset 0 0 15px rgba(0, 229, 255, 0.5)";
    
    // Update displays
    updateDisplays();
}

function updateDisplays() {
    attemptsLeftSpan.textContent = MAX_ATTEMPTS - attempts;
    roundsWonSpan.textContent = roundsWon;
    totalScoreSpan.textContent = totalScore;
}

function handleGuess() {
    if (!gameActive) return;

    const userGuess = parseInt(guessInput.value);

    // Input validation
    if (isNaN(userGuess) || userGuess < MIN_RANGE || userGuess > MAX_RANGE) {
        flashMessage(`INVALID INPUT: ENTER NUMBER [${MIN_RANGE}-${MAX_RANGE}]`, "#ff9800");
        hudContainer.classList.add('animate-shake');
        setTimeout(() => hudContainer.classList.remove('animate-shake'), 500);
        guessInput.value = "";
        return;
    }

    attempts++;
    let message = "";
    let color = "";

    if (userGuess < numberToGuess) {
        message = `// ANALYSIS: TOO LOW. TARGET IS HIGHER.`;
        color = "#00e5ff"; // Primary glow
    } else if (userGuess > numberToGuess) {
        message = `// ANALYSIS: TOO HIGH. TARGET IS LOWER.`;
        color = "#ff4d4d"; // Reddish for high
    } else {
        message = `// PASSCODE ACCEPTED: ${numberToGuess}. SYSTEM UNLOCKED.`;
        color = "#00ff7f"; // Green for success
        roundsWon++;
        totalScore += (MAX_ATTEMPTS - attempts + 1);
        endRound(true);
    }
    
    flashMessage(message, color);
    updateDisplays();

    // Check for loss condition after updating displays
    if (attempts >= MAX_ATTEMPTS && gameActive) {
        message = `// ATTEMPTS EXCEEDED. LOCKDOWN INITIATED. CORRECT CODE: ${numberToGuess}`;
        color = "#ff00c1"; // Secondary glow (magenta) for failure
        flashMessage(message, color);
        endRound(false);
    }
}

function flashMessage(msg, color) {
    messageText.textContent = msg;
    messageText.style.color = color;
}

function endRound(isWin) {
    gameActive = false;
    guessInput.disabled = true;
    guessButton.disabled = true;
    playAgainButton.classList.remove('hidden');

    // Update HUD border color based on result
    if (isWin) {
        hudContainer.style.borderColor = "#00ff7f";
        hudContainer.style.boxShadow = "0 0 25px #00ff7f, inset 0 0 15px rgba(0, 255, 127, 0.5)";
    } else {
        hudContainer.style.borderColor = "#ff00c1";
        hudContainer.style.boxShadow = "0 0 25px #ff00c1, inset 0 0 15px rgba(255, 0, 193, 0.5)";
    }
    updateDisplays();
}

// --- EVENT LISTENERS ---
guessButton.addEventListener('click', handleGuess);
guessInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleGuess();
    }
});
playAgainButton.addEventListener('click', startNewRound);

// --- INITIALIZE GAME ---
startNewRound();
