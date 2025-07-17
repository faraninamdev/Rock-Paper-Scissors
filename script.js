let score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0
};

updateScoreElement();

function playSound(soundId) {
  const sound = document.getElementById(soundId);
  if (sound) {
    sound.currentTime = 0; // Reset sound to start
    sound.play().catch(error => console.log('Error playing sound:', error));
  }
}

// Modify your playGame function to include sounds
function playGame(playerMove) {
  const computerMove = pickComputerMove();
  let result = '';

  playSound('clickSound'); // Play click sound when move is made

  if (playerMove === computerMove) {
    result = 'Tie.';
    score.ties += 1;
  } else if (
    (playerMove === 'rock' && computerMove === 'scissors') ||
    (playerMove === 'paper' && computerMove === 'rock') ||
    (playerMove === 'scissors' && computerMove === 'paper')
  ) {
    result = 'You win.';
    score.wins += 1;
    playSound('winSound');
  } else {
    result = 'You lose.';
    score.losses += 1;
    playSound('loseSound');
  }

  localStorage.setItem('score', JSON.stringify(score));
  updateScoreElement();

  document.querySelector('.js-result').innerHTML = result;
  document.querySelector('.js-moves').innerHTML = `
    You
    <img src="${capitalize(playerMove)}.png" class="move-icon">
    <img src="${capitalize(computerMove)}.png" class="move-icon">
    Computer
  `;
}

function updateScoreElement() {
  document.querySelector('.js-score').innerHTML =
    `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

function pickComputerMove() {
  const moves = ['rock', 'paper', 'scissors'];
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Button event listeners
document.querySelector('.js-rock-button')
  .addEventListener('click', () => playGame('rock'));
document.querySelector('.js-paper-button')
  .addEventListener('click', () => playGame('paper'));
document.querySelector('.js-scissors-button')
  .addEventListener('click', () => playGame('scissors'));

// Auto Play functionality
let isAutoPlaying = false;
let intervalId;

function autoPlay() {
  if (!isAutoPlaying) {
    intervalId = setInterval(() => {
      const moves = ['rock', 'paper', 'scissors'];
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      playGame(randomMove);
    }, 1000);
    isAutoPlaying = true;
    document.querySelector('.auto-play-button').textContent = 'Stop Auto Play';
  } else {
    clearInterval(intervalId);
    isAutoPlaying = false;
    document.querySelector('.auto-play-button').textContent = 'Auto Play';
  }
}

// Keyboard controls
document.addEventListener('keydown', (event) => {
  if (event.key === 'r') playGame('rock');
  if (event.key === 'p') playGame('paper');
  if (event.key === 's') playGame('scissors');
  if (event.key === 'a') autoPlay();
});