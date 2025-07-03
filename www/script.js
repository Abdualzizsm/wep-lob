// --- STATE MANAGEMENT ---
let userPoints = parseInt(localStorage.getItem('userPoints')) || 0;
let weeklyVotes = JSON.parse(localStorage.getItem('weeklyVotes')) || {};

const nominees = ['labubu_fall', 'zimomo_ghost', 'labubu_macaron', 'labubu_camping'];
const initialVoteData = {
    labubu_fall: 4512,
    zimomo_ghost: 2534,
    labubu_macaron: 1588,
    labubu_camping: 1410
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    updateUserPointsDisplay();
    initializeContest();
    startCountdown();
    // Simulate live vote updates
    setInterval(simulateLiveVotes, 5000);
});

// --- CORE FUNCTIONS ---

/**
 * Initializes the contest state, updating UI from localStorage or initial data.
 */
function initializeContest() {
    const totalVotes = Object.values(initialVoteData).reduce((sum, current) => sum + current, 0);

    nominees.forEach(id => {
        const card = document.querySelector(`.nominee-card[data-id='${id}']`);
        if (!card) return;

        const votes = initialVoteData[id];
        const percentage = (votes / totalVotes * 100).toFixed(1);

        card.querySelector('.progress-fill').style.width = `${percentage}%`;
        card.querySelector('.vote-count').textContent = `${votes.toLocaleString()} صوت`;

        const voteButton = card.querySelector('.btn-vote');
        if (weeklyVotes[id]) {
            markAsVoted(voteButton);
        }
    });
}

/**
 * Handles the voting process for a specific nominee.
 * @param {string} nomineeId - The ID of the nominee being voted for.
 */
function vote(nomineeId) {
    const card = document.querySelector(`.nominee-card[data-id='${nomineeId}']`);
    const voteButton = card.querySelector('.btn-vote');

    if (voteButton.classList.contains('voted')) {
        showNotification('لقد صوتت لهذا المرشح بالفعل!', 'warning');
        return;
    }

    // Update state
    userPoints += 10;
    weeklyVotes[nomineeId] = true;
    initialVoteData[nomineeId]++;

    // Save state
    localStorage.setItem('userPoints', userPoints);
    localStorage.setItem('weeklyVotes', JSON.stringify(weeklyVotes));

    // Update UI
    updateUserPointsDisplay();
    markAsVoted(voteButton);
    showNotification('شكراً لتصويتك! +10 نقاط', 'success');
    
    // Re-calculate and update all percentages
    updateAllVoteDisplays();
}

/**
 * Updates the display for all nominees after a vote.
 */
function updateAllVoteDisplays() {
    const totalVotes = Object.values(initialVoteData).reduce((sum, current) => sum + current, 0);

    nominees.forEach(id => {
        const card = document.querySelector(`.nominee-card[data-id='${id}']`);
        if (!card) return;

        const votes = initialVoteData[id];
        const percentage = (votes / totalVotes * 100).toFixed(1);

        card.querySelector('.progress-fill').style.width = `${percentage}%`;
        card.querySelector('.vote-count').textContent = `${votes.toLocaleString()} صوت`;
    });
}

/**
 * Simulates incoming votes to make the page feel alive.
 */
function simulateLiveVotes() {
    const randomNomineeId = nominees[Math.floor(Math.random() * nominees.length)];
    initialVoteData[randomNomineeId] += Math.floor(Math.random() * 5) + 1;
    updateAllVoteDisplays();
}


// --- UI HELPERS ---

/**
 * Updates the user points display in the header.
 */
function updateUserPointsDisplay() {
    const pointsEl = document.getElementById('userPoints');
    if (pointsEl) {
        pointsEl.textContent = userPoints.toLocaleString();
    }
}

/**
 * Visually marks a button as 'voted'.
 * @param {HTMLElement} button - The button element to modify.
 */
function markAsVoted(button) {
    button.classList.add('voted');
    button.innerHTML = '<i class="fas fa-check"></i> تم التصويت';
    button.disabled = true;
}

/**
 * Displays a notification to the user.
 * @param {string} message - The message to display.
 * @param {string} type - The type of notification (e.g., 'success', 'warning').
 */
function showNotification(message, type = 'success') {
    const container = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

/**
 * Starts the countdown timer for the contest.
 */
function startCountdown() {
    const countdownEl = document.getElementById('timeRemaining');
    if (!countdownEl) return;

    // Set contest end date to the next Sunday
    const now = new Date();
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (7 - now.getDay()) % 7);
    endOfWeek.setHours(23, 59, 59, 999);

    function updateTimer() {
        const timeLeft = endOfWeek - new Date();

        if (timeLeft <= 0) {
            countdownEl.textContent = 'المسابقة انتهت! بانتظار النتائج.';
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        countdownEl.textContent = `${days} يوم, ${hours} ساعة, ${minutes} دقيقة, ${seconds} ثانية`;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}
