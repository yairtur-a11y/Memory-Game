const UNFLIP_DELAY_MS = 1000;
const WIN_MODAL_DELAY_MS = 300;
const QUIZ_ADVANCE_DELAY_MS = 1200;

// ── DOM references ─────────────────────────────────────────────────────────

const board = document.getElementById("game-board");
const movesDisplay = document.getElementById("moves");
const pairsProgressDisplay = document.getElementById("pairs-progress");
const timerDisplay = document.getElementById("timer");
const restartButton = document.getElementById("restart-btn");
const homeButton = document.getElementById("home-btn");
const startButton = document.getElementById("start-btn");

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const quizScreen = document.getElementById("quiz-screen");

const winModal = document.getElementById("win-modal");
const winIcon = document.getElementById("win-icon");
const winTitle = document.getElementById("win-title");
const winMessage = document.getElementById("win-message");
const winResultsView = document.getElementById("win-results");
const winSettingsView = document.getElementById("win-settings");
const playAgainButton = document.getElementById("play-again-btn");
const changeDifficultyButton = document.getElementById("change-difficulty-btn");
const winStartButton = document.getElementById("win-start-btn");
const winBackButton = document.getElementById("win-back-btn");

const quizTimerDisplay = document.getElementById("quiz-timer");
const quizProgressDisplay = document.getElementById("quiz-progress");
const quizScoreDisplay = document.getElementById("quiz-score-display");
const quizRestartButton = document.getElementById("quiz-restart-btn");
const quizHomeButton = document.getElementById("quiz-home-btn");

// ── Game state ─────────────────────────────────────────────────────────────

const gameState = {
  firstCard: null,
  secondCard: null,
  lockBoard: false,
  moves: 0,
  matchedPairs: 0,
  timer: 0,
  timerInterval: null,
  totalPairs: 0,
};

const quizState = {
  questions: [],
  currentIndex: 0,
  score: 0,
  answered: false,
};

function resetGameState() {
  gameState.firstCard = null;
  gameState.secondCard = null;
  gameState.lockBoard = false;
  gameState.moves = 0;
  gameState.matchedPairs = 0;
  gameState.timer = 0;
}

// ── Timer ──────────────────────────────────────────────────────────────────

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function startTimer(displayEl) {
  clearInterval(gameState.timerInterval);
  gameState.timer = 0;
  displayEl.textContent = formatTime(0);
  gameState.timerInterval = setInterval(function () {
    gameState.timer++;
    displayEl.textContent = formatTime(gameState.timer);
  }, 1000);
}

function stopTimer() {
  clearInterval(gameState.timerInterval);
}

// ── Card helpers ───────────────────────────────────────────────────────────

function flipCard(card) { card.classList.add("flipped"); }
function unflipCard(card) { card.classList.remove("flipped"); }

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── Modal ──────────────────────────────────────────────────────────────────

function showWinModal() {
  if (selectedGameType === "quiz") {
    const total = quizState.questions.length;
    const pct = Math.round((quizState.score / total) * 100);
    winIcon.textContent = pct === 100 ? "🏆" : pct >= 60 ? "⭐" : "📚";
    winTitle.textContent = pct === 100 ? "Perfect!" : "Quiz Done!";
    winMessage.textContent =
      `You scored ${quizState.score} / ${total} (${pct}%) in ${formatTime(gameState.timer)}.`;
  } else {
    winIcon.textContent = "🏆";
    winTitle.textContent = "You Won!";
    winMessage.textContent =
      `You finished in ${gameState.moves} moves and ${formatTime(gameState.timer)}.`;
  }
  winModal.classList.remove("hidden");
}

function hideWinModal() {
  winModal.classList.add("hidden");
}

// ── Screen switching ───────────────────────────────────────────────────────

function showStartScreen() {
  stopTimer();
  hideWinModal();
  gameScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
}

function showGameScreen() {
  startScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
}

function showQuizScreen() {
  startScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
}

// ── Settings ───────────────────────────────────────────────────────────────

const MAX_PAIRS = 20;
const DEFAULT_PAIRS = { easy: 4, medium: 6, hard: 8 };

let selectedDifficulty = "easy";
let selectedPairs = DEFAULT_PAIRS.easy;
let selectedMode = "flags";
let selectedLanguage = "en";
let selectedGameType = "memory";

const SUBTITLES = {
  flags:    "Match every country to its flag",
  capitals: "Match every country to its capital city",
  maps:     "Match every country to its location on the map",
  family:   "Match every name to their photo",
};

function setLanguage(lang) {
  selectedLanguage = lang;
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

function countryName(c) {
  return selectedLanguage === "he" ? c.nameHe : c.country;
}

function capitalName(c) {
  return selectedLanguage === "he" ? c.capitalHe : c.capital;
}

function setGameType(type) {
  selectedGameType = type;
  document.querySelectorAll(".game-type-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.type === type);
  });
  document.querySelectorAll(".pairs-label").forEach(el => {
    el.textContent = type === "quiz" ? "Questions" : "Pairs";
  });
}

function updateSettingsVisibility(mode) {
  const isFamily = mode === "family";
  document.querySelectorAll("[data-setting='language']").forEach(el => {
    el.classList.toggle("setting-hidden", isFamily);
  });
  document.querySelectorAll("[data-setting='difficulty']").forEach(el => {
    el.classList.toggle("setting-hidden", isFamily);
  });
}

function setMode(mode) {
  selectedMode = mode;
  document.querySelectorAll(".toggle-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });
  const subtitle = document.getElementById("start-subtitle");
  if (subtitle) subtitle.textContent = SUBTITLES[mode];
  if (mode === "maps") loadWorldData();
  updateSettingsVisibility(mode);
  updatePairsDisplay();
}

function getPoolForDifficulty(difficulty) {
  if (selectedMode === "family") return [...familyMembers];
  let pool;
  if (difficulty === "easy")        pool = allCountries.filter(c => c.difficulty === "easy");
  else if (difficulty === "medium") pool = allCountries.filter(c => ["easy", "medium"].includes(c.difficulty));
  else                              pool = [...allCountries];
  if (selectedMode === "maps") pool = pool.filter(c => c.code in COUNTRY_MAP_CONFIG);
  return pool;
}

function setDifficulty(difficulty) {
  selectedDifficulty = difficulty;
  document.querySelectorAll(".diff-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.difficulty === difficulty);
  });
  const maxPairs = Math.min(getPoolForDifficulty(difficulty).length, MAX_PAIRS);
  if (selectedPairs > maxPairs) selectedPairs = maxPairs;
  updatePairsDisplay();
}

function setPairs(delta) {
  const maxPairs = Math.min(getPoolForDifficulty(selectedDifficulty).length, MAX_PAIRS);
  selectedPairs = Math.max(2, Math.min(selectedPairs + delta, maxPairs));
  updatePairsDisplay();
}

function updatePairsDisplay() {
  const maxPairs = Math.min(getPoolForDifficulty(selectedDifficulty).length, MAX_PAIRS);
  document.querySelectorAll(".pairs-value").forEach(el => {
    el.textContent = selectedPairs;
  });
  document.querySelectorAll(".pairs-down-btn").forEach(btn => {
    btn.disabled = selectedPairs <= 2;
  });
  document.querySelectorAll(".pairs-up-btn").forEach(btn => {
    btn.disabled = selectedPairs >= maxPairs;
  });
}

function getGameSettings() {
  return {
    pool: getPoolForDifficulty(selectedDifficulty),
    pairsCount: selectedPairs,
    columns: 4,
  };
}

// ── Map rendering ──────────────────────────────────────────────────────────

let worldData = null;
const mapSvgCache = {};

async function loadWorldData() {
  if (worldData) return;
  try {
    const res = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
    worldData = await res.json();
  } catch (e) {
    console.error("Failed to load world map data:", e);
  }
}

function renderCountryMapSVG(code) {
  if (mapSvgCache[code]) return mapSvgCache[code];
  if (!worldData) return null;

  const config = COUNTRY_MAP_CONFIG[code];
  const numericId = ISO_TO_NUMERIC[code];
  if (!config || !numericId) return null;

  try {
    const W = 960, H = 500;
    const projection = d3.geoMercator()
      .center(config.center)
      .scale(config.scale)
      .translate([W / 2, H / 2]);
    const path = d3.geoPath(projection);

    const countries = topojson.feature(worldData, worldData.objects.countries);
    const borders   = topojson.mesh(worldData, worldData.objects.countries, (a, b) => a !== b);

    const parts = [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">`,
      `<rect width="${W}" height="${H}" fill="#bfdbfe"/>`,
    ];

    for (const feature of countries.features) {
      const d = path(feature);
      if (!d) continue;
      const isTarget = String(feature.id) === String(numericId);
      parts.push(
        `<path d="${d}" fill="${isTarget ? "#22c55e" : "#f1f5f9"}" ` +
        `stroke="#94a3b8" stroke-width="${isTarget ? 1 : 0.3}"/>`
      );
    }

    const borderD = path(borders);
    if (borderD) parts.push(`<path d="${borderD}" fill="none" stroke="#94a3b8" stroke-width="0.3"/>`);

    parts.push("</svg>");
    const svg = parts.join("");
    mapSvgCache[code] = svg;
    return svg;
  } catch (e) {
    console.error("Map render error for", code, e);
    return null;
  }
}

// ── Memory: card deck ──────────────────────────────────────────────────────

function buildCardDeck() {
  const settings = getGameSettings();
  const pool = shuffleArray([...settings.pool]).slice(0, settings.pairsCount);

  gameState.totalPairs = settings.pairsCount;

  const cards = [];

  if (selectedMode === "family") {
    for (const member of pool) {
      cards.push({ type: "family-name",  display: member.name, pairId: member.code });
      cards.push({ type: "family-photo", display: member.name, pairId: member.code, image: member.image });
    }
    return { cards: shuffleArray(cards), columns: settings.columns };
  }

  for (let i = 0; i < pool.length; i++) {
    cards.push({
      type: "country",
      display: countryName(pool[i]),
      pairId: pool[i].code
    });

    if (selectedMode === "flags") {
      cards.push({ type: "flag",    display: countryName(pool[i]), pairId: pool[i].code });
    } else if (selectedMode === "capitals") {
      cards.push({ type: "capital", display: capitalName(pool[i]), pairId: pool[i].code });
    } else {
      cards.push({ type: "map",     display: countryName(pool[i]), pairId: pool[i].code });
    }
  }

  return { cards: shuffleArray(cards), columns: settings.columns };
}

function createCardBackHTML(cardData) {
  if (cardData.type === "flag") {
    return `
      <div class="card-back flag-card">
        <img class="flag-image"
          src="https://flagcdn.com/w160/${cardData.pairId}.png"
          alt="Flag of ${cardData.display}"/>
      </div>`;
  }
  if (cardData.type === "capital") {
    return `
      <div class="card-back capital-card">
        <span class="capital-name">${cardData.display}</span>
      </div>`;
  }
  if (cardData.type === "map") {
    const svg = renderCountryMapSVG(cardData.pairId);
    return svg
      ? `<div class="card-back map-card">${svg}</div>`
      : `<div class="card-back map-card map-loading">🗺️</div>`;
  }
  if (cardData.type === "family-photo") {
    return `
      <div class="card-back photo-card">
        <img class="family-photo-img" src="${cardData.image}" alt="${cardData.display}">
      </div>`;
  }
  if (cardData.type === "family-name") {
    return `
      <div class="card-back family-name-card">
        <span class="family-name-text" dir="rtl">${cardData.display}</span>
      </div>`;
  }
  return `
    <div class="card-back text-card">
      <span class="country-name">${cardData.display}</span>
    </div>`;
}

function addPairBadge(card, number) {
  const badge = document.createElement("div");
  badge.className = "pair-badge";
  badge.textContent = number;
  card.appendChild(badge);
}

function createBoard() {
  hideWinModal();
  board.innerHTML = "";

  const gameData = buildCardDeck();
  const cards = gameData.cards;

  board.style.gridTemplateColumns = `repeat(${gameData.columns}, var(--card-size))`;

  resetGameState();
  movesDisplay.textContent = gameState.moves;
  pairsProgressDisplay.textContent = `0/${gameState.totalPairs}`;

  startTimer(timerDisplay);

  for (let i = 0; i < cards.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.pairId = cards[i].pairId;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">?</div>
        ${createCardBackHTML(cards[i])}
      </div>`;

    if (selectedLanguage === "he") card.setAttribute("dir", "rtl");

    card.addEventListener("click", function () {
      if (gameState.lockBoard || card === gameState.firstCard || card.classList.contains("matched")) return;

      flipCard(card);

      if (!gameState.firstCard) {
        gameState.firstCard = card;
        return;
      }

      gameState.secondCard = card;
      gameState.moves++;
      movesDisplay.textContent = gameState.moves;

      if (gameState.firstCard.dataset.pairId === gameState.secondCard.dataset.pairId) {
        gameState.firstCard.classList.add("matched");
        gameState.secondCard.classList.add("matched");

        gameState.matchedPairs++;
        addPairBadge(gameState.firstCard, gameState.matchedPairs);
        addPairBadge(gameState.secondCard, gameState.matchedPairs);
        pairsProgressDisplay.textContent = `${gameState.matchedPairs}/${gameState.totalPairs}`;

        gameState.firstCard = null;
        gameState.secondCard = null;

        if (gameState.matchedPairs === gameState.totalPairs) {
          stopTimer();
          gameState.lockBoard = true;
          setTimeout(showWinModal, WIN_MODAL_DELAY_MS);
        }
      } else {
        gameState.lockBoard = true;
        setTimeout(() => {
          unflipCard(gameState.firstCard);
          unflipCard(gameState.secondCard);
          gameState.firstCard = null;
          gameState.secondCard = null;
          gameState.lockBoard = false;
        }, UNFLIP_DELAY_MS);
      }
    });

    board.appendChild(card);
  }
}

// ── Quiz ───────────────────────────────────────────────────────────────────

function buildQuizQuestions() {
  const pool = getPoolForDifficulty(selectedDifficulty);
  const selected = shuffleArray([...pool]).slice(0, selectedPairs);

  return selected.map(item => {
    const wrong = shuffleArray(pool.filter(c => c.code !== item.code)).slice(0, 3);
    const answers = shuffleArray([item, ...wrong]);
    return { correct: item, answers };
  });
}

function renderQuizQuestion() {
  const q = quizState.questions[quizState.currentIndex];
  const total = quizState.questions.length;

  const feedbackEl = document.getElementById("quiz-feedback");
  if (feedbackEl) feedbackEl.className = "quiz-feedback hidden";

  quizProgressDisplay.textContent = `${quizState.currentIndex + 1} / ${total}`;
  quizScoreDisplay.textContent = `${quizState.score} / ${quizState.currentIndex}`;

  const promptEl = document.getElementById("quiz-prompt");
  if (selectedMode === "family") {
    // Show the photo — player guesses the name
    promptEl.innerHTML =
      `<img class="quiz-family-photo" src="${q.correct.image}" alt="מי זה?">`;
  } else if (selectedMode === "flags") {
    promptEl.innerHTML =
      `<img class="quiz-flag" src="https://flagcdn.com/w320/${q.correct.code}.png" alt="Flag">`;
  } else if (selectedMode === "maps") {
    const svg = renderCountryMapSVG(q.correct.code);
    promptEl.innerHTML = svg
      ? `<div class="quiz-map">${svg}</div>`
      : `<div class="quiz-map-loading">🗺️</div>`;
  } else {
    // capitals mode: show country name, answer is the capital
    const dir = selectedLanguage === "he" ? ' dir="rtl"' : "";
    promptEl.innerHTML = `<div class="quiz-text-prompt"${dir}>${countryName(q.correct)}</div>`;
  }

  const answersEl = document.getElementById("quiz-answers");
  answersEl.innerHTML = "";
  quizState.answered = false;

  q.answers.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    if (selectedMode === "family") {
      btn.textContent = item.name;
      btn.setAttribute("dir", "rtl");
    } else if (selectedMode === "capitals") {
      btn.textContent = capitalName(item);
      if (selectedLanguage === "he") btn.setAttribute("dir", "rtl");
    } else {
      btn.textContent = countryName(item);
      if (selectedLanguage === "he") btn.setAttribute("dir", "rtl");
    }
    btn.dataset.code = item.code;
    btn.addEventListener("click", () => handleAnswer(btn, q));
    answersEl.appendChild(btn);
  });
}

function handleAnswer(btn, question) {
  if (quizState.answered) return;
  quizState.answered = true;

  const isCorrect = btn.dataset.code === question.correct.code;
  if (isCorrect) quizState.score++;

  const feedbackEl = document.getElementById("quiz-feedback");
  if (feedbackEl) {
    feedbackEl.textContent = isCorrect ? "✓" : "✗";
    feedbackEl.className = `quiz-feedback ${isCorrect ? "feedback-correct" : "feedback-wrong"}`;
  }

  document.querySelectorAll(".answer-btn").forEach(b => {
    b.disabled = true;
    if (b.dataset.code === question.correct.code) b.classList.add("answer-correct");
    else if (b === btn) b.classList.add("answer-wrong");
  });

  quizScoreDisplay.textContent = `${quizState.score} / ${quizState.currentIndex + 1}`;

  setTimeout(() => {
    quizState.currentIndex++;
    if (quizState.currentIndex >= quizState.questions.length) {
      stopTimer();
      setTimeout(showWinModal, WIN_MODAL_DELAY_MS);
    } else {
      renderQuizQuestion();
    }
  }, QUIZ_ADVANCE_DELAY_MS);
}

function startQuiz() {
  hideWinModal();
  quizState.questions = buildQuizQuestions();
  quizState.currentIndex = 0;
  quizState.score = 0;
  quizState.answered = false;
  quizScoreDisplay.textContent = "0 / 0";
  showQuizScreen();
  startTimer(quizTimerDisplay);
  renderQuizQuestion();
}

// ── Start game ─────────────────────────────────────────────────────────────

async function startGame() {
  if (selectedMode === "maps") {
    startButton.disabled = true;
    startButton.textContent = "Loading map…";
    await loadWorldData();
    startButton.disabled = false;
    startButton.textContent = "Start Game";
  }
  if (selectedGameType === "quiz") {
    startQuiz();
  } else {
    showGameScreen();
    createBoard();
  }
}

// ── Event listeners ────────────────────────────────────────────────────────

document.querySelectorAll(".lang-btn").forEach(btn => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

document.querySelectorAll(".game-type-btn").forEach(btn => {
  btn.addEventListener("click", () => setGameType(btn.dataset.type));
});

document.querySelectorAll(".toggle-btn").forEach(btn => {
  btn.addEventListener("click", () => setMode(btn.dataset.mode));
});

document.querySelectorAll(".diff-btn").forEach(btn => {
  btn.addEventListener("click", () => setDifficulty(btn.dataset.difficulty));
});

document.querySelectorAll(".pairs-down-btn").forEach(btn => {
  btn.addEventListener("click", () => setPairs(-1));
});

document.querySelectorAll(".pairs-up-btn").forEach(btn => {
  btn.addEventListener("click", () => setPairs(1));
});

startButton.addEventListener("click", startGame);

homeButton.addEventListener("click", showStartScreen);
quizHomeButton.addEventListener("click", showStartScreen);

restartButton.addEventListener("click", createBoard);
quizRestartButton.addEventListener("click", startQuiz);

playAgainButton.addEventListener("click", function () {
  hideWinModal();
  if (selectedGameType === "quiz") startQuiz();
  else createBoard();
});

changeDifficultyButton.addEventListener("click", function () {
  winResultsView.classList.add("hidden");
  winSettingsView.classList.remove("hidden");
});

winBackButton.addEventListener("click", function () {
  winSettingsView.classList.add("hidden");
  winResultsView.classList.remove("hidden");
});

winStartButton.addEventListener("click", async function () {
  hideWinModal();
  await startGame();
});

loadWorldData();
updatePairsDisplay();
showStartScreen();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(err => {
      console.warn("SW registration failed:", err);
    });

    // When a new SW takes control (skipWaiting activated a new version),
    // show the update banner. This does NOT fire on first install.
    let reloading = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloading) return;
      reloading = true;

      const banner = document.getElementById("update-banner");
      const btn = document.getElementById("update-refresh-btn");
      if (banner) banner.classList.remove("hidden");
      if (btn) btn.addEventListener("click", () => location.reload());
    });
  });
}
