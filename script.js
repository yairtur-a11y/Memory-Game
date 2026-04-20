const VERSION = "3.1";

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
const typeScreen = document.getElementById("type-screen");
const typeTimerDisplay = document.getElementById("type-timer");
const typeProgressDisplay = document.getElementById("type-progress");
const typeScoreDisplay = document.getElementById("type-score-display");
const typeRestartButton = document.getElementById("type-restart-btn");
const typeHomeButton = document.getElementById("type-home-btn");

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

const typeState = {
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

// ── Personal best ──────────────────────────────────────────────────────────

function getPbKey() {
  const diff = selectedCategory === "family" ? "any" : selectedDifficulty;
  const mode = selectedCategory === "family" ? "family" : selectedMode;
  return `pb_${selectedGameType}_${selectedCategory}_${mode}_${diff}_${selectedPairs}`;
}

function loadPb(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}

function savePb(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

function updatePbDisplay(t) {
  const pbEl = document.getElementById("win-pb");
  if (!pbEl) return;

  const key  = getPbKey();
  const prev = loadPb(key);
  let isBetter, current, recordStr, prevStr;

  if (selectedGameType === "memory") {
    current  = { moves: gameState.moves, time: gameState.timer };
    isBetter = !prev || current.moves < prev.moves
                     || (current.moves === prev.moves && current.time < prev.time);
    recordStr = t.pbMemoryRecord(current.moves, formatTime(current.time));
    prevStr   = prev ? t.pbMemoryRecord(prev.moves, formatTime(prev.time)) : null;
  } else {
    const qs    = selectedGameType === "type" ? typeState : quizState;
    const total = qs.questions.length;
    const pct   = Math.round((qs.score / total) * 100);
    current  = { pct, score: qs.score, total, time: gameState.timer };
    isBetter = !prev || pct > prev.pct || (pct === prev.pct && current.time < prev.time);
    recordStr = t.pbQuizRecord(pct, current.score, total, formatTime(current.time));
    prevStr   = prev ? t.pbQuizRecord(prev.pct, prev.score, prev.total, formatTime(prev.time)) : null;
  }

  if (isBetter) {
    savePb(key, current);
    pbEl.innerHTML = prevStr
      ? `<div class="pb-new">${t.pbNew}</div><div class="pb-prev">${t.pbPrevious} ${prevStr}</div>`
      : `<div class="pb-new">${t.pbNew}</div>`;
  } else {
    pbEl.innerHTML = `<div class="pb-existing">${t.pbBest} ${prevStr}</div>`;
  }
}

// ── Leaderboard ────────────────────────────────────────────────────────────

function getLbKey() {
  const diff = selectedCategory === "family" ? "any" : selectedDifficulty;
  const mode = selectedCategory === "family" ? "family" : selectedMode;
  return `lb_${selectedGameType}_${selectedCategory}_${mode}_${diff}_${selectedPairs}`;
}

function loadLeaderboard() {
  try { return JSON.parse(localStorage.getItem(getLbKey())) || []; } catch { return []; }
}

function saveLeaderboard(board) {
  try { localStorage.setItem(getLbKey(), JSON.stringify(board)); } catch {}
}

function getCurrentResult() {
  if (selectedGameType === "memory") {
    return { moves: gameState.moves, time: gameState.timer };
  }
  const qs = selectedGameType === "type" ? typeState : quizState;
  const total = qs.questions.length;
  const pct = Math.round((qs.score / total) * 100);
  return { pct, score: qs.score, total, time: gameState.timer };
}

function isBetterThanEntry(current, entry) {
  if (selectedGameType === "memory") {
    if (current.moves !== entry.moves) return current.moves < entry.moves;
    return current.time < entry.time;
  }
  if (current.pct !== entry.pct) return current.pct > entry.pct;
  return current.time < entry.time;
}

function checkLbQualification() {
  const board = loadLeaderboard();
  if (board.length < 3) return true;
  return isBetterThanEntry(getCurrentResult(), board[board.length - 1]);
}

function addToLeaderboard(name) {
  const board = loadLeaderboard();
  const entry = { name, ...getCurrentResult() };
  board.push(entry);
  board.sort((a, b) => {
    if (selectedGameType === "memory") {
      if (a.moves !== b.moves) return a.moves - b.moves;
      return a.time - b.time;
    }
    if (a.pct !== b.pct) return b.pct - a.pct;
    return a.time - b.time;
  });
  const top3 = board.slice(0, 3);
  saveLeaderboard(top3);
  return top3.indexOf(entry);
}

function renderLeaderboard(highlightIdx) {
  const board = loadLeaderboard();
  const lbTable = document.getElementById("lb-table");
  const lbList = document.getElementById("lb-list");
  if (board.length === 0) return;
  const t = UI_TEXT[selectedLanguage];
  lbList.innerHTML = "";
  board.forEach((entry, i) => {
    const li = document.createElement("li");
    li.className = "lb-entry" + (i === highlightIdx ? " lb-entry-current" : "");
    const scoreStr = selectedGameType === "memory"
      ? t.pbMemoryRecord(entry.moves, formatTime(entry.time))
      : t.pbQuizRecord(entry.pct, entry.score, entry.total, formatTime(entry.time));
    li.innerHTML =
      `<span class="lb-rank">${i + 1}</span>` +
      `<span class="lb-name">${entry.name}</span>` +
      `<span class="lb-score">${scoreStr}</span>`;
    lbList.appendChild(li);
  });
  lbTable.classList.remove("hidden");
}

// ── Modal ──────────────────────────────────────────────────────────────────

function showWinModal() {
  const t = UI_TEXT[selectedLanguage];
  if (selectedGameType === "quiz" || selectedGameType === "type") {
    const qs = selectedGameType === "type" ? typeState : quizState;
    const total = qs.questions.length;
    const pct = Math.round((qs.score / total) * 100);
    winIcon.textContent = pct === 100 ? "🏆" : pct >= 60 ? "⭐" : "📚";
    winTitle.textContent = pct === 100 ? t.winPerfect : t.winQuizDone;
    winMessage.textContent = t.winQuizMsg(qs.score, total, pct, formatTime(gameState.timer));
  } else {
    winIcon.textContent = "🏆";
    winTitle.textContent = t.winYouWon;
    winMessage.textContent = t.winMemoryMsg(gameState.moves, formatTime(gameState.timer));
  }
  updatePbDisplay(t);

  // Leaderboard
  const lbNameEntry = document.getElementById("lb-name-entry");
  const lbTable    = document.getElementById("lb-table");
  const lbNameInput = document.getElementById("lb-name-input");
  const lbQualifyMsg = document.getElementById("lb-qualify-msg");

  lbNameEntry.classList.add("hidden");
  lbTable.classList.add("hidden");

  if (checkLbQualification()) {
    lbQualifyMsg.textContent = t.lbQualify;
    lbNameInput.value = "";
    lbNameInput.placeholder = t.lbNamePlaceholder;
    lbNameEntry.classList.remove("hidden");
    setTimeout(() => lbNameInput.focus(), 150);
  } else {
    renderLeaderboard(-1);
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
  typeScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
}

function showTypeScreen() {
  startScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  typeScreen.classList.remove("hidden");
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
const DEFAULT_PAIRS = { easy: 4, hard: 6, mix: 8 };

let selectedDifficulty = "mix";
let selectedPairs = 6;
let selectedCategory = "world"; // "world" | "america" | "family"
let selectedMode = "flags";     // "flags" | "capitals" | "maps"
let selectedLanguage = "he";
let selectedGameType = "quiz";
let selectedQuizDirection = "photo-to-name";

const UI_TEXT = {
  en: {
    labelLanguage:     "Language / שפה",
    labelGameType:     "Game Type",
    labelCategory:     "Category",
    labelMode:         "Mode",
    labelDifficulty:   "Difficulty",
    labelPairs:        "Pairs",
    labelQuestions:    "Questions",
    labelFeedback:     "Feedback",
    btnMemory:         "🎴 Cards",
    btnQuiz:           "❓ Quiz",
    btnType:           "✍️ Type",
    btnWorld:          "🌍 World",
    btnAmerica:        "🇺🇸 America",
    btnFamily:         "👨‍👩‍👧‍👦 Family",
    btnCars:           "🚗 Cars",
    btnAnimals:        "🐾 Animals",
    btnFlags:          "🏳️ Flags",
    btnCapitals:       "🏙️ Capitals",
    btnMaps:           "🗺️ Maps",
    btnLogos:          "🚗 Logos",
    btnOrigin:         "🌍 Origin",
    btnEasy:           "Easy",
    btnHard:           "Hard",
    btnMix:            "Mix",
    btnSound:          "🔊 Sound",
    btnHaptics:        "📳 Haptics",
    btnStart:          "Start Game",
    labelMoves:        "Moves",
    labelPairsBar:     "Pairs",
    labelTime:         "Time",
    labelQuestion:     "Question",
    labelScore:        "Score",
    btnRestart:        "Restart",
    btnPlayAgain:      "Play Again",
    btnChangeSettings: "Change Settings",
    winNewGame:        "New Game",
    btnWinStart:       "Start Game",
    btnBack:           "Back",
    updateMsg:         "🔄 New version available",
    btnRefresh:        "Refresh",
    subtitleWorldFlags:      "Match every country to its flag",
    subtitleWorldCapitals:   "Match every country to its capital city",
    subtitleWorldMaps:       "Match every country to its location on the map",
    subtitleAmericaFlags:    "Match every US state to its flag",
    subtitleAmericaCapitals: "Match every US state to its capital city",
    subtitleAmericaMaps:     "Match every US state to its location on the map",
    subtitleFamily:          "Match every name to their photo",
    subtitleCarsFlags:       "Match every car brand to its logo",
    subtitleCarsCapitals:    "Match every car brand to its country of origin",
    subtitleAnimals:         "Identify the animal in each photo",
    winYouWon:         "You Won!",
    winPerfect:        "Perfect!",
    winQuizDone:       "Quiz Done!",
    winMemoryMsg:      (moves, time) => `You finished in ${moves} moves and ${time}.`,
    winQuizMsg:        (score, total, pct, time) => `You scored ${score} / ${total} (${pct}%) in ${time}.`,
    pbNew:             "⭐ Personal best!",
    pbPrevious:        "Previous:",
    pbBest:            "Your best:",
    pbMemoryRecord:    (moves, time) => `${moves} moves · ${time}`,
    pbQuizRecord:      (pct, score, total, time) => `${pct}% (${score}/${total}) · ${time}`,
    winHome:           "🏠 Home",
    labelQuizDirection:  "Question Style",
    btnPhotoToName:      "📷 → 🏷️ Name",
    btnNameToPhoto:      "🏷️ → 📷 Photo",
    typePlaceholder:     "Type your answer…",
    typeSubmit:          "Submit ↵",
    typeNext:            "Next →",
    typeAnswerWas:       "The answer was:",
    lbTitle:             "Top 3",
    lbQualify:           "🏅 You made the top 3! Enter your name:",
    lbSave:              "Save",
    lbSkip:              "Skip",
    lbNamePlaceholder:   "Your name",
    btnLearn:            "🎓 Learn Geography",
    learnTitle:          "🎓 Learn Geography",
    learnSearchPlaceholder: "🔍 Search country or capital…",
  },
  he: {
    labelLanguage:     "שפה / Language",
    labelGameType:     "סוג משחק",
    labelCategory:     "קטגוריה",
    labelMode:         "מצב",
    labelDifficulty:   "רמת קושי",
    labelPairs:        "זוגות",
    labelQuestions:    "שאלות",
    labelFeedback:     "משוב",
    btnMemory:         "🎴 קלפים",
    btnQuiz:           "❓ חידון",
    btnType:           "✍️ כתוב",
    btnWorld:          "🌍 עולם",
    btnAmerica:        "🇺🇸 אמריקה",
    btnFamily:         "👨‍👩‍👧‍👦 משפחה",
    btnCars:           "🚗 מכוניות",
    btnAnimals:        "🐾 חיות",
    btnFlags:          "🏳️ דגלים",
    btnCapitals:       "🏙️ בירות",
    btnMaps:           "🗺️ מפות",
    btnLogos:          "🚗 לוגואים",
    btnOrigin:         "🌍 מדינת מקור",
    btnEasy:           "קל",
    btnHard:           "קשה",
    btnMix:            "מיקס",
    btnSound:          "🔊 צליל",
    btnHaptics:        "📳 רטט",
    btnStart:          "התחל משחק",
    labelMoves:        "מהלכים",
    labelPairsBar:     "זוגות",
    labelTime:         "זמן",
    labelQuestion:     "שאלה",
    labelScore:        "ניקוד",
    btnRestart:        "התחל מחדש",
    btnPlayAgain:      "שחק שוב",
    btnChangeSettings: "שנה הגדרות",
    winNewGame:        "משחק חדש",
    btnWinStart:       "התחל משחק",
    btnBack:           "חזרה",
    updateMsg:         "🔄 גרסה חדשה זמינה",
    btnRefresh:        "רענן",
    subtitleWorldFlags:      "התאם כל מדינה לדגל שלה",
    subtitleWorldCapitals:   "התאם כל מדינה לבירה שלה",
    subtitleWorldMaps:       "התאם כל מדינה למיקום שלה במפה",
    subtitleAmericaFlags:    "התאם כל מדינה בארה״ב לדגל שלה",
    subtitleAmericaCapitals: "התאם כל מדינה בארה״ב לבירה שלה",
    subtitleAmericaMaps:     "התאם כל מדינה בארה״ב למיקום שלה במפה",
    subtitleFamily:          "התאם כל שם לתמונה שלו",
    subtitleCarsFlags:       "התאם כל מותג רכב ללוגו שלו",
    subtitleCarsCapitals:    "התאם כל מותג רכב למדינת המוצא שלו",
    subtitleAnimals:         "זהה את החיה בכל תמונה",
    winYouWon:         "ניצחת!",
    winPerfect:        "מושלם!",
    winQuizDone:       "סיום חידון!",
    winMemoryMsg:      (moves, time) => `סיימת ב־${moves} מהלכים, בזמן ${time}`,
    winQuizMsg:        (score, total, pct, time) => `ניקדת ${score} מתוך ${total} (${pct}%) בזמן ${time}`,
    pbNew:             "⭐ שיא אישי!",
    pbPrevious:        "קודם:",
    pbBest:            "השיא שלך:",
    pbMemoryRecord:    (moves, time) => `${moves} מהלכים · ${time}`,
    pbQuizRecord:      (pct, score, total, time) => `${pct}% (${score}/${total}) · ${time}`,
    winHome:           "🏠 בית",
    labelQuizDirection:  "סגנון שאלה",
    btnPhotoToName:      "📷 → 🏷️ שם",
    btnNameToPhoto:      "🏷️ → 📷 תמונה",
    typePlaceholder:     "כתוב את תשובתך…",
    typeSubmit:          "שלח ↵",
    typeNext:            "הבא →",
    typeAnswerWas:       "התשובה הנכונה:",
    lbTitle:             "טופ 3",
    lbQualify:           "🏅 נכנסת לטופ 3! הכנס את שמך:",
    lbSave:              "שמור",
    lbSkip:              "דלג",
    lbNamePlaceholder:   "השם שלך",
    btnLearn:            "🎓 למד גיאוגרפיה",
    learnTitle:          "🎓 למד גיאוגרפיה",
    learnSearchPlaceholder: "🔍 חפש מדינה או בירה…",
  },
};

function updateSubtitle() {
  const t = UI_TEXT[selectedLanguage];
  let key;
  if (selectedCategory === "family") {
    key = "subtitleFamily";
  } else if (selectedCategory === "cars") {
    key = selectedMode === "capitals" ? "subtitleCarsCapitals" : "subtitleCarsFlags";
  } else if (selectedCategory === "animals") {
    key = "subtitleAnimals";
  } else {
    key = "subtitle" +
      selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) +
      selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1);
  }
  const subtitle = document.getElementById("start-subtitle");
  if (subtitle && t[key]) subtitle.textContent = t[key];
}

function applyLanguageToUI(lang) {
  const t = UI_TEXT[lang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (typeof t[key] === "string") el.textContent = t[key];
  });
  document.querySelectorAll(".start-card, .win-modal-content").forEach(el => {
    el.dir = lang === "he" ? "rtl" : "";
  });
  updateSubtitle();
  document.querySelectorAll(".pairs-label").forEach(el => {
    el.textContent = (selectedGameType === "quiz" || selectedGameType === "type") ? t.labelQuestions : t.labelPairs;
  });
}

function setLanguage(lang) {
  selectedLanguage = lang;
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
  applyLanguageToUI(lang);
}

function countryName(c) {
  return selectedLanguage === "he" ? c.nameHe : c.country;
}

function capitalName(c) {
  return selectedLanguage === "he" ? c.capitalHe : c.capital;
}

function stateName(s) {
  return selectedLanguage === "he" ? s.nameHe : s.name;
}

function stateCapitalName(s) {
  return selectedLanguage === "he" ? s.capitalHe : s.capital;
}

function setCategory(cat) {
  selectedCategory = cat;
  document.querySelectorAll(".cat-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.cat === cat);
  });
  updateSubtitle();
  updateSettingsVisibility();
  updatePairsDisplay();
}

function setGameType(type) {
  selectedGameType = type;
  document.querySelectorAll(".game-type-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.type === type);
  });
  const t = UI_TEXT[selectedLanguage];
  document.querySelectorAll(".pairs-label").forEach(el => {
    el.textContent = (type === "quiz" || type === "type") ? t.labelQuestions : t.labelPairs;
  });
  updateSettingsVisibility();
}

function updateSettingsVisibility() {
  const isFamily  = selectedCategory === "family";
  const isCars    = selectedCategory === "cars";
  const isAnimals = selectedCategory === "animals";
  const isPhotoCategory = isFamily || isAnimals; // no mode row, no difficulty

  // Mode row: hide for family and animals (photo-only categories)
  document.querySelectorAll("[data-setting='mode']").forEach(el => {
    el.classList.toggle("setting-hidden", isPhotoCategory);
  });
  // Hide Maps button for cars (logos/origin only) and reset if active
  document.querySelectorAll(".mode-btn[data-mode='maps']").forEach(btn => {
    btn.style.display = isCars ? "none" : "";
  });
  if (isCars && selectedMode === "maps") setMode("flags");

  // Difficulty: hide for photo categories (all animals shown regardless)
  document.querySelectorAll("[data-setting='difficulty']").forEach(el => {
    el.classList.toggle("setting-hidden", isPhotoCategory);
  });

  // Quiz-direction: show for photo categories + cars in quiz mode
  const showDirection = (isPhotoCategory || isCars) && selectedGameType === "quiz";
  document.querySelectorAll("[data-setting='quiz-direction']").forEach(el => {
    el.classList.toggle("setting-hidden", !showDirection);
  });
}

function setQuizDirection(dir) {
  selectedQuizDirection = dir;
  document.querySelectorAll(".quiz-dir-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.dir === dir);
  });
}

function setMode(mode) {
  selectedMode = mode;
  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });
  updateSubtitle();
  if (mode === "maps") {
    if (selectedCategory === "america") loadUsMapData(); else loadWorldData();
  }
  updatePairsDisplay();
}

function getPoolForDifficulty(difficulty) {
  if (selectedCategory === "family")  return [...familyMembers];
  if (selectedCategory === "animals") return [...animalMembers];
  if (selectedCategory === "cars") {
    if (difficulty === "easy")  return carBrands.filter(c => c.difficulty === "easy");
    if (difficulty === "hard")  return carBrands.filter(c => c.difficulty === "hard");
    return shuffleArray([...carBrands]); // mix
  }
  if (selectedCategory === "america") {
    if (difficulty === "easy") return usStates.filter(s => s.difficulty === "easy");
    if (difficulty === "hard") return usStates.filter(s => s.difficulty === "hard");
    return shuffleArray([...usStates]); // mix
  }
  // world
  let pool;
  if (difficulty === "easy")      pool = allCountries.filter(c => c.difficulty === "easy");
  else if (difficulty === "hard") pool = allCountries.filter(c => c.difficulty === "hard");
  else                            pool = shuffleArray([...allCountries]); // mix
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

// Returns the largest contiguous polygon from a feature (Polygon or MultiPolygon).
// Prevents sprawling overseas territories (France, US, etc.) from forcing a world-level view.
// Falls back to the original feature if nothing better can be found.
function getLargestPolygon(feature) {
  if (!feature || !feature.geometry) return feature;
  if (feature.geometry.type === 'Polygon') {
    return { type: 'Feature', geometry: feature.geometry, properties: {} };
  }
  if (feature.geometry.type !== 'MultiPolygon') return feature;
  let maxArea = -Infinity, best = null;
  for (const polyCoords of feature.geometry.coordinates) {
    const poly = { type: 'Feature', geometry: { type: 'Polygon', coordinates: polyCoords }, properties: {} };
    try {
      const [[w, s], [e, n]] = d3.geoBounds(poly);
      // Use absolute area; skip antimeridian-wrapped polygons (e > w check)
      const area = (e > w) ? (e - w) * (n - s) : 0;
      if (area > maxArea) { maxArea = area; best = poly; }
    } catch (_) {}
  }
  // Fall back to the whole feature if selection failed
  return best || feature;
}

function renderCountryMapSVG(code) {
  if (mapSvgCache[code]) return mapSvgCache[code];
  if (!worldData) return null;

  const numericId = ISO_TO_NUMERIC[code];
  if (!numericId) return null;

  try {
    const W = 960, H = 500;

    const countries = topojson.feature(worldData, worldData.objects.countries);
    const targetFeature = countries.features.find(f => String(f.id) === String(numericId));
    if (!targetFeature) return null;

    // Use only the largest contiguous body so Alaska/Hawaii/overseas territories
    // don't force a world-level zoom.
    const mainFeature = getLargestPolygon(targetFeature);
    if (!mainFeature || !mainFeature.geometry) return null;

    // Build the regional viewport projection.
    // All of this is wrapped in its own try-catch: if bounds/centroid are NaN/Infinity
    // (null geometry, antimeridian issues, etc.) we fall back to a simple fitExtent so
    // the render never throws and always returns a usable SVG.
    const projection = d3.geoMercator();
    try {
      const [[west, south], [east, north]] = d3.geoBounds(mainFeature);
      const centroid = d3.geoCentroid(mainFeature);

      if (!isFinite(west) || !isFinite(east) || !isFinite(centroid[0]) || !isFinite(centroid[1])) {
        throw new Error('non-finite bounds');
      }

      let dLon = east - west;
      if (dLon < 0) dLon += 360;
      const dLat = north - south;

      const CONTEXT = 2.0;
      const viewDLon = Math.min(Math.max(dLon * CONTEXT, 8),  70);
      const viewDLat = Math.min(Math.max(dLat * CONTEXT, 5),  50);

      const lon0 = centroid[0] - viewDLon / 2;
      const lon1 = centroid[0] + viewDLon / 2;
      const lat0 = Math.max(centroid[1] - viewDLat / 2, -80);
      const lat1 = Math.min(centroid[1] + viewDLat / 2,  80);

      projection.fitExtent([[0, 0], [W, H]], {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [[[lon0, lat0], [lon1, lat0], [lon1, lat1], [lon0, lat1], [lon0, lat0]]] }
      });

      // Guard: if fitExtent produced a degenerate scale, fall back
      if (!isFinite(projection.scale()) || projection.scale() <= 0) throw new Error('bad scale');

    } catch (_) {
      // Safe fallback: fit the target feature itself with padding
      try {
        projection.fitExtent([[W * 0.15, H * 0.15], [W * 0.85, H * 0.85]], mainFeature);
        if (!isFinite(projection.scale()) || projection.scale() <= 0) throw new Error('bad scale2');
      } catch (_2) {
        // Last resort: standard world view
        projection.scale(153).translate([W / 2, H / 2]);
      }
    }

    const path = d3.geoPath(projection);
    const borders = topojson.mesh(worldData, worldData.objects.countries, (a, b) => a !== b);

    // Embed the target's pixel centroid and bounding-box so applyMapZoom can
    // set an initial zoom focused on the country rather than showing the world.
    // Wrapped in its own try-catch: a bad geometry must not abort the whole render.
    let svgOpenTag = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"`;
    try {
      const [pcx, pcy] = path.centroid(mainFeature);
      const [[bx0, by0], [bx1, by1]] = path.bounds(mainFeature);
      if (isFinite(pcx) && isFinite(pcy) && isFinite(bx0) && isFinite(bx1)) {
        svgOpenTag +=
          ` data-cx="${pcx.toFixed(1)}" data-cy="${pcy.toFixed(1)}"` +
          ` data-bw="${(bx1-bx0).toFixed(1)}" data-bh="${(by1-by0).toFixed(1)}"`;
      }
    } catch (_) {}
    svgOpenTag += '>';

    const parts = [
      svgOpenTag,
      `<rect width="${W}" height="${H}" fill="#bfdbfe"/>`,
      `<g class="map-layer">`,
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

    parts.push(`</g>`);
    parts.push("</svg>");
    const svg = parts.join("");
    mapSvgCache[code] = svg;
    return svg;
  } catch (e) {
    console.error("Map render error for", code, e);
    return null;
  }
}

// ── US State map rendering ─────────────────────────────────────────────────

let usMapData = null;
const stateMapSvgCache = {};

async function loadUsMapData() {
  if (usMapData) return;
  try {
    const res = await fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json");
    usMapData = await res.json();
  } catch (e) {
    console.error("Failed to load US map data:", e);
  }
}

function renderStateMapSVG(fips) {
  if (stateMapSvgCache[fips]) return stateMapSvgCache[fips];
  if (!usMapData) return null;

  try {
    const W = 960, H = 600;
    const projection = d3.geoAlbersUsa().scale(1280).translate([W / 2, H / 2]);
    const path = d3.geoPath(projection);

    const states  = topojson.feature(usMapData, usMapData.objects.states);
    const borders = topojson.mesh(usMapData, usMapData.objects.states, (a, b) => a !== b);

    const targetState = states.features.find(f => Number(f.id) === fips);
    let svgAttrs = `viewBox="0 0 ${W} ${H}"`;
    if (targetState) {
      try {
        const [pcx, pcy] = path.centroid(targetState);
        const [[bx0, by0], [bx1, by1]] = path.bounds(targetState);
        if (isFinite(pcx) && isFinite(pcy) && isFinite(bx0) && isFinite(bx1)) {
          svgAttrs += ` data-cx="${pcx.toFixed(1)}" data-cy="${pcy.toFixed(1)}"` +
            ` data-bw="${(bx1-bx0).toFixed(1)}" data-bh="${(by1-by0).toFixed(1)}"`;
        }
      } catch (_) {}
    }

    const parts = [
      `<svg xmlns="http://www.w3.org/2000/svg" ${svgAttrs}>`,
      `<rect width="${W}" height="${H}" fill="#bfdbfe"/>`,
      `<g class="map-layer">`,
    ];

    for (const feature of states.features) {
      const d = path(feature);
      if (!d) continue;
      const isTarget = Number(feature.id) === fips;
      parts.push(
        `<path d="${d}" fill="${isTarget ? "#22c55e" : "#f1f5f9"}" ` +
        `stroke="#94a3b8" stroke-width="${isTarget ? 1 : 0.3}"/>`
      );
    }

    const borderD = path(borders);
    if (borderD) parts.push(`<path d="${borderD}" fill="none" stroke="#94a3b8" stroke-width="0.3"/>`);

    parts.push(`</g>`);
    parts.push("</svg>");
    const svg = parts.join("");
    stateMapSvgCache[fips] = svg;
    return svg;
  } catch (e) {
    console.error("State map render error for fips", fips, e);
    return null;
  }
}

// ── Memory: card deck ──────────────────────────────────────────────────────

function buildCardDeck() {
  const settings = getGameSettings();
  const pool = shuffleArray([...settings.pool]).slice(0, settings.pairsCount);

  gameState.totalPairs = settings.pairsCount;

  const cards = [];

  if (selectedCategory === "family" || selectedCategory === "animals") {
    for (const member of pool) {
      const display = selectedCategory === "animals"
        ? (selectedLanguage === "he" ? member.nameHe : member.name)
        : member.name;
      cards.push({ type: "family-name",  display, pairId: member.code });
      cards.push({ type: "family-photo", display, pairId: member.code, image: member.image });
    }
    return { cards: shuffleArray(cards), columns: settings.columns };
  }

  for (let i = 0; i < pool.length; i++) {
    const item = pool[i];
    const nameText = selectedCategory === "america" ? stateName(item) : countryName(item);
    cards.push({ type: "country", display: nameText, pairId: item.code });

    if (selectedMode === "flags") {
      cards.push({ type: "flag", display: nameText, pairId: item.code });
    } else if (selectedMode === "capitals") {
      const capText = selectedCategory === "america" ? stateCapitalName(item) : capitalName(item);
      cards.push({ type: "capital", display: capText, pairId: item.code });
    } else {
      if (selectedCategory === "america") {
        cards.push({ type: "state-map", display: nameText, pairId: item.code, fips: item.fips });
      } else {
        cards.push({ type: "map", display: nameText, pairId: item.code });
      }
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
  if (cardData.type === "state-map") {
    const svg = renderStateMapSVG(cardData.fips);
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
      Feedback.flip();

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
        Feedback.correct();

        gameState.matchedPairs++;
        addPairBadge(gameState.firstCard, gameState.matchedPairs);
        addPairBadge(gameState.secondCard, gameState.matchedPairs);
        pairsProgressDisplay.textContent = `${gameState.matchedPairs}/${gameState.totalPairs}`;

        gameState.firstCard = null;
        gameState.secondCard = null;

        if (gameState.matchedPairs === gameState.totalPairs) {
          stopTimer();
          Feedback.win();
          gameState.lockBoard = true;
          setTimeout(showWinModal, WIN_MODAL_DELAY_MS);
        }
      } else {
        gameState.lockBoard = true;
        Feedback.wrong();
        [gameState.firstCard, gameState.secondCard].forEach(c => {
          c.classList.add("shake");
          c.addEventListener("animationend", () => c.classList.remove("shake"), { once: true });
        });
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

// ── Flag similarity groups ─────────────────────────────────────────────────
// Each inner array is a cluster of visually similar / confusable flags.
// A country can belong to multiple groups.
const FLAG_GROUPS = [
  // Nordic cross — same design, different colors
  ["no", "se", "dk", "fi", "is"],

  // Nearly identical: Chad & Romania (blue/yellow/red vertical)
  ["td", "ro"],

  // Nearly identical: Indonesia & Monaco (red-over-white horizontal bicolor)
  ["id", "mc"],

  // Nearly identical: Australia & New Zealand (Union Jack + Southern Cross)
  ["au", "nz", "fj"],

  // Nearly identical: Colombia / Ecuador / Venezuela (yellow/blue/red horizontal)
  ["co", "ec", "ve"],

  // European vertical tricolors (similar layout, different hues)
  ["fr", "ie", "ci", "it", "be", "ro", "td", "ml", "cm", "bj", "gn", "gw", "gm", "ne"],

  // Slavic / European horizontal tricolors (red/white/blue or close)
  ["ru", "nl", "lu", "sk", "si", "hr", "rs", "bg", "cz", "py", "by"],

  // Baltic horizontal tricolors (very similar to each other)
  ["ee", "lt", "lv"],

  // Former Yugoslav flags (similar pan-Slavic color blocks)
  ["rs", "hr", "si", "ba", "me", "mk", "sk", "bg"],

  // Crescent & star Islamic flags
  ["tr", "pk", "az", "dz", "tn", "my", "mv", "km", "mr"],

  // Pan-Arab horizontal tricolors (red/white/black + green details)
  ["jo", "kw", "ae", "iq", "eg", "sa", "ye", "sd", "sy", "ly", "ps"],

  // Pan-African colors (red / yellow / green)
  ["et", "gh", "ml", "cm", "sn", "ci", "ng", "ke", "gn", "tg", "bf", "bj", "sl", "gw", "lr"],

  // Communist star flags
  ["vn", "cn", "kp"],

  // Central America (blue/white horizontal stripes + coat of arms)
  ["gt", "hn", "ni", "sv", "cr"],

  // Caribbean island nations (similar tropical designs)
  ["bb", "tt", "jm", "lc", "vc", "gd", "ag", "kn", "dm", "bs", "cu", "ht", "do"],

  // Gulf states (similar striped / maroon-white patterns)
  ["qa", "bh", "kw", "ae", "om", "sa"],

  // Light blue & white (South Atlantic / Mediterranean stripes)
  ["ar", "uy", "gr", "il", "so", "fi"],

  // Caucasus & Central Asia
  ["am", "az", "ge", "kz", "kg", "uz", "tm", "tj"],

  // South Asian (similar color blocks / circles)
  ["in", "pk", "bd", "np", "af", "bt", "lk"],

  // South-East Asian (horizontal stripes in similar palettes)
  ["th", "my", "ph", "vn", "la", "mm", "kh", "id", "bn"],

  // Black / red / yellow – German style horizontal tricolors
  ["de", "be", "at", "hu", "et"],

  // Diagonal stripe designs
  ["za", "tz", "bz", "gy", "na", "pa"],

  // Oceania – dark blue with constellations / stars
  ["au", "nz", "fj", "ws", "sb", "tv", "pw", "fm", "mh"],

  // Small island flags with bright diagonal / radiating rays
  ["sc", "st", "ki", "to", "vu"],

  // Red & white only (bicolor or near-bicolor)
  ["pl", "id", "mc", "sg", "dk", "ge", "ch"],

  // Red / green / white – similar tricolors
  ["it", "hu", "bg", "ir", "mw", "bh"],

  // French-speaking Africa – similar horizontal / vertical tricolors
  ["cm", "ga", "cg", "cd", "cf", "td", "ml", "ne", "sn", "tg", "bj", "bf"],

  // East Africa similar (diagonal & stars)
  ["ke", "tz", "ug", "rw", "bi", "mz", "zm", "zw", "ao"],
];

// Pick 3 wrong-answer car brands: same country-of-origin first (confusable logos),
// then same-or-harder difficulty, then rest.
function pickCarDistractors(correct, pool) {
  const DIFF_RANK = { easy: 0, medium: 1, hard: 2 };
  const correctRank = DIFF_RANK[correct.difficulty] ?? 0;
  const others = pool.filter(c => c.code !== correct.code);

  const sameOrigin = shuffleArray(others.filter(c => c.capital === correct.capital));
  const sameDiff   = shuffleArray(others.filter(c =>
    c.capital !== correct.capital && (DIFF_RANK[c.difficulty] ?? 0) >= correctRank));
  const rest       = shuffleArray(others.filter(c =>
    c.capital !== correct.capital && (DIFF_RANK[c.difficulty] ?? 0) <  correctRank));

  return [...sameOrigin, ...sameDiff, ...rest].slice(0, 3);
}

// Returns all country codes that share a FLAG_GROUP with the given code.
function getFlagSimilar(code) {
  const result = new Set();
  for (const group of FLAG_GROUPS) {
    if (group.includes(code)) {
      group.forEach(c => { if (c !== code) result.add(c); });
    }
  }
  return [...result];
}

// Pick 3 plausible wrong-answer distractors for flags/capitals/maps-world mode.
// Priority: 1) similar-flag countries  2) same-or-harder difficulty  3) anything else
function pickWorldDistractors(correct, pool) {
  const DIFF_RANK = { easy: 0, medium: 1, hard: 2 };
  const correctRank = DIFF_RANK[correct.difficulty] ?? 0;
  const others = pool.filter(c => c.code !== correct.code);

  const similar  = new Set(getFlagSimilar(correct.code));

  const bucket1 = shuffleArray(others.filter(c =>  similar.has(c.code)));
  const bucket2 = shuffleArray(others.filter(c => !similar.has(c.code) && (DIFF_RANK[c.difficulty] ?? 0) >= correctRank));
  const bucket3 = shuffleArray(others.filter(c => !similar.has(c.code) && (DIFF_RANK[c.difficulty] ?? 0) <  correctRank));

  return [...bucket1, ...bucket2, ...bucket3].slice(0, 3);
}

// ── Quiz ───────────────────────────────────────────────────────────────────

// Squared Euclidean distance between two item centroids.
// World countries use COUNTRY_MAP_CONFIG[code].center [lon, lat].
// US states use STATE_CENTROIDS[fips] [lat, lon].
// Both work correctly for proximity ranking (order-independent).
function geoDistSq(a, b) {
  const ca = selectedCategory === "america"
    ? STATE_CENTROIDS[a.fips]
    : (COUNTRY_MAP_CONFIG[a.code] ? COUNTRY_MAP_CONFIG[a.code].center : null);
  const cb = selectedCategory === "america"
    ? STATE_CENTROIDS[b.fips]
    : (COUNTRY_MAP_CONFIG[b.code] ? COUNTRY_MAP_CONFIG[b.code].center : null);
  if (!ca || !cb) return Infinity;
  const d0 = ca[0] - cb[0], d1 = ca[1] - cb[1];
  return d0 * d0 + d1 * d1;
}

function buildQuizQuestions() {
  let pool = getPoolForDifficulty(selectedDifficulty);

  // Pre-render every candidate in maps mode to warm the cache and eliminate any
  // country whose render returns null (missing ISO code, bad geometry, etc.).
  // This means renderPromptInEl will always get a cached hit — never the emoji fallback.
  if (selectedMode === "maps" && selectedCategory !== "family") {
    pool = pool.filter(item => {
      const svg = selectedCategory === "america"
        ? renderStateMapSVG(item.fips)
        : renderCountryMapSVG(item.code);
      return svg !== null;
    });
  }

  const selected = shuffleArray([...pool]).slice(0, selectedPairs);

  return selected.map(item => {
    let wrong;
    if (selectedMode === "maps") {
      // For map questions: pick distractors from the geographically nearest
      // countries/states so players can't eliminate by continent at a glance.
      const candidates = pool
        .filter(c => c.code !== item.code)
        .map(c => ({ c, d: geoDistSq(item, c) }))
        .sort((a, b) => a.d - b.d);

      // Sample from the 10 nearest to add variety across replays
      const nearPool = candidates.slice(0, 10).map(e => e.c);
      wrong = shuffleArray(nearPool).slice(0, 3);

      // Fallback: fill up if nearPool was too small
      if (wrong.length < 3) {
        const used = new Set(wrong.map(w => w.code));
        const extras = shuffleArray(pool.filter(c => c.code !== item.code && !used.has(c.code)));
        wrong = [...wrong, ...extras].slice(0, 3);
      }
    } else if (selectedCategory === "cars") {
      // Same origin-country brands first (e.g. BMW → Audi, Mercedes, Porsche)
      wrong = pickCarDistractors(item, pool);
    } else if (selectedCategory === "world") {
      // Flags & capitals (world): prefer similar-flag / same-region countries,
      // then same-or-harder difficulty, so obvious mismatches never appear.
      wrong = pickWorldDistractors(item, pool);
    } else {
      wrong = shuffleArray(pool.filter(c => c.code !== item.code)).slice(0, 3);
    }

    const answers = shuffleArray([item, ...wrong]);
    return { correct: item, answers };
  });
}

// ── Interactive map zoom ───────────────────────────────────────────────────

// fitToView=true → start at full map (d3.zoomIdentity); used for US states
// fitToView=false (default) → start zoomed in on the target feature
function applyMapZoom(container, fitToView = false) {
  const svg = container.querySelector('svg');
  if (!svg) return;
  const g = svg.querySelector('.map-layer');
  if (!g) return;

  const vb  = svg.getAttribute('viewBox').split(' ').map(Number);
  const W = vb[2], H = vb[3];
  const cx  = parseFloat(svg.dataset.cx);
  const cy  = parseFloat(svg.dataset.cy);
  const bw  = parseFloat(svg.dataset.bw);
  const bh  = parseFloat(svg.dataset.bh);

  // Start zoomed in so the target country fills ~60 % of the canvas.
  // The ⌖ reset button returns here, not to the full-world view.
  let initTransform = d3.zoomIdentity;
  if (!fitToView && !isNaN(cx) && !isNaN(cy) && bw > 0 && bh > 0) {
    const rawK = Math.min(W * 0.60 / bw, H * 0.60 / bh);
    const initK = Math.max(1.0, Math.min(rawK, 6.0));
    // d3.zoomIdentity.scale(k).translate(tx, ty) → transform {k, x: k*tx, y: k*ty}
    initTransform = d3.zoomIdentity
      .scale(initK)
      .translate(W / (2 * initK) - cx, H / (2 * initK) - cy);
  }

  const zoomBehavior = d3.zoom()
    .scaleExtent([0.3, 20])
    .on('zoom', e => { g.setAttribute('transform', e.transform.toString()); });

  const svgSel = d3.select(svg)
    .call(zoomBehavior)
    .call(zoomBehavior.transform, initTransform);

  // Floating zoom controls
  const controls = document.createElement('div');
  controls.className = 'map-zoom-controls';
  controls.innerHTML =
    `<button class="map-zoom-btn" data-zoom="in"    title="Zoom in">+</button>` +
    `<button class="map-zoom-btn" data-zoom="reset" title="Reset view">⌖</button>` +
    `<button class="map-zoom-btn" data-zoom="out"   title="Zoom out">−</button>`;
  container.appendChild(controls);

  controls.addEventListener('click', e => {
    const btn = e.target.closest('[data-zoom]');
    if (!btn) return;
    const action = btn.dataset.zoom;
    if      (action === 'in')    svgSel.transition().duration(250).call(zoomBehavior.scaleBy, 1.6);
    else if (action === 'out')   svgSel.transition().duration(250).call(zoomBehavior.scaleBy, 1 / 1.6);
    else                         svgSel.transition().duration(300).call(zoomBehavior.transform, initTransform);
  });
}

// ── Shared prompt rendering ────────────────────────────────────────────────

function renderPromptInEl(el, item, isTypeMode) {
  if (selectedCategory === "family") {
    // type mode always shows photo; quiz direction only applies to quiz
    if (!isTypeMode && selectedQuizDirection === "name-to-photo") {
      el.innerHTML = `<div class="quiz-text-prompt" dir="rtl">${item.name}</div>`;
    } else {
      el.innerHTML = `<img class="quiz-family-photo" src="${item.image}" alt="?">`;
    }
  } else if (selectedCategory === "animals") {
    if (!isTypeMode && selectedQuizDirection === "name-to-photo") {
      const dir = selectedLanguage === "he" ? ' dir="rtl"' : "";
      const label = selectedLanguage === "he" ? item.nameHe : item.name;
      el.innerHTML = `<div class="quiz-text-prompt"${dir}>${label}</div>`;
    } else {
      el.innerHTML = `<img class="quiz-family-photo" src="${item.image}" alt="${item.emoji}" onerror="this.style.fontSize='80px';this.src='';this.alt='${item.emoji}'">`;
    }
  } else if (selectedCategory === "cars") {
    if (!isTypeMode && selectedQuizDirection === "name-to-photo") {
      // Show brand name as text; answer buttons will show logos
      const dir = selectedLanguage === "he" ? ' dir="rtl"' : "";
      el.innerHTML = `<div class="quiz-text-prompt"${dir}>${countryName(item)}</div>`;
    } else if (selectedMode === "capitals") {
      // Show brand name; answer is country of origin
      const dir = selectedLanguage === "he" ? ' dir="rtl"' : "";
      el.innerHTML = `<div class="quiz-text-prompt"${dir}>${countryName(item)}</div>`;
    } else {
      // Show logo; answer is brand name
      el.innerHTML = `<img class="quiz-car-logo" src="${item.logo}" alt="${countryName(item)}">`;
    }
  } else if (selectedMode === "flags") {
    el.innerHTML =
      `<img class="quiz-flag" src="https://flagcdn.com/w320/${item.code}.png" alt="Flag">`;
  } else if (selectedMode === "maps") {
    const isAmerica = selectedCategory === "america";
    const renderFn = () => isAmerica ? renderStateMapSVG(item.fips) : renderCountryMapSVG(item.code);
    const svg = renderFn();
    if (svg) {
      el.innerHTML = `<div class="quiz-map">${svg}</div>`;
      applyMapZoom(el.querySelector('.quiz-map'), isAmerica);
    } else {
      el.innerHTML = `<div class="quiz-map-loading">🗺️</div>`;

      // Single retry, guarded so it only fires once regardless of which path triggers it.
      let retried = false;
      const retry = () => {
        if (retried) return;
        retried = true;
        if (!el.querySelector('.quiz-map-loading')) return;
        const retrySvg = renderFn();
        if (retrySvg) {
          el.innerHTML = `<div class="quiz-map">${retrySvg}</div>`;
          applyMapZoom(el.querySelector('.quiz-map'), isAmerica);
        }
      };

      // Data should already be loaded (startQuiz/startType await it), so this
      // retry only fires for rare computation errors (NaN geometry etc.).
      setTimeout(retry, 800);
    }
  } else {
    // capitals: show country/state name; answer is the capital
    const name = selectedCategory === "america" ? stateName(item) : countryName(item);
    const dir = selectedLanguage === "he" ? ' dir="rtl"' : "";
    el.innerHTML = `<div class="quiz-text-prompt"${dir}>${name}</div>`;
  }
}

// ── Type It game ───────────────────────────────────────────────────────────

function buildTypeQuestions() {
  let pool = getPoolForDifficulty(selectedDifficulty);

  if (selectedMode === "maps" && selectedCategory !== "family") {
    pool = pool.filter(item => {
      const svg = selectedCategory === "america"
        ? renderStateMapSVG(item.fips)
        : renderCountryMapSVG(item.code);
      return svg !== null;
    });
  }

  const selected = shuffleArray([...pool]).slice(0, selectedPairs);
  return selected.map(item => ({ correct: item }));
}

function getValidAnswers(item) {
  if (selectedCategory === "family") return [item.name];
  if (selectedCategory === "animals") return [item.name, item.nameHe].filter(Boolean);
  if (selectedMode === "capitals") {
    return [item.capital, item.capitalHe].filter(Boolean);
  }
  if (selectedCategory === "america") return [item.name, item.nameHe].filter(Boolean);
  return [item.country, item.nameHe].filter(Boolean);
}

function getPrimaryAnswer(item) {
  if (selectedCategory === "family") return item.name;
  if (selectedCategory === "animals") return selectedLanguage === "he" ? item.nameHe : item.name;
  if (selectedMode === "capitals") {
    return selectedLanguage === "he" ? item.capitalHe : item.capital;
  }
  if (selectedCategory === "america") return selectedLanguage === "he" ? item.nameHe : item.name;
  return selectedLanguage === "he" ? item.nameHe : item.country;
}

function normalizeAnswer(str) {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

function checkTypeAnswer(input, item) {
  const norm = normalizeAnswer(input);
  return getValidAnswers(item).some(a => normalizeAnswer(a) === norm);
}

function renderTypeQuestion() {
  const q = typeState.questions[typeState.currentIndex];
  const t = UI_TEXT[selectedLanguage];

  document.getElementById("type-feedback").className = "quiz-feedback hidden";
  document.getElementById("type-reveal").classList.add("hidden");

  typeProgressDisplay.textContent = `${typeState.currentIndex + 1} / ${typeState.questions.length}`;
  typeScoreDisplay.textContent = `${typeState.score} / ${typeState.currentIndex}`;

  renderPromptInEl(document.getElementById("type-prompt"), q.correct, true);

  const input = document.getElementById("type-input");
  const submitBtn = document.getElementById("type-submit-btn");
  input.value = "";
  input.disabled = false;
  input.className = "type-input";
  input.dir = selectedLanguage === "he" ? "rtl" : "ltr";
  input.placeholder = t.typePlaceholder;
  submitBtn.textContent = t.typeSubmit;
  submitBtn.className = "type-submit-btn";

  typeState.answered = false;
  setTimeout(() => input.focus(), 60);
}

function advanceTypeQuestion() {
  typeState.currentIndex++;
  if (typeState.currentIndex >= typeState.questions.length) {
    stopTimer();
    Feedback.win();
    setTimeout(showWinModal, WIN_MODAL_DELAY_MS);
  } else {
    renderTypeQuestion();
  }
}

function handleTypeSubmit() {
  if (typeState.answered) { advanceTypeQuestion(); return; }

  const input = document.getElementById("type-input");
  const userInput = input.value.trim();
  if (!userInput) return;

  typeState.answered = true;
  const q = typeState.questions[typeState.currentIndex];
  const isCorrect = checkTypeAnswer(userInput, q.correct);
  if (isCorrect) typeState.score++;

  if (isCorrect) Feedback.correct(); else Feedback.wrong();

  const feedbackEl = document.getElementById("type-feedback");
  feedbackEl.textContent = isCorrect ? "✓" : "✗";
  feedbackEl.className = `quiz-feedback ${isCorrect ? "feedback-correct" : "feedback-wrong"}`;

  input.disabled = true;
  input.className = `type-input ${isCorrect ? "input-correct" : "input-wrong"}`;

  typeScoreDisplay.textContent = `${typeState.score} / ${typeState.currentIndex + 1}`;

  const submitBtn = document.getElementById("type-submit-btn");
  const t = UI_TEXT[selectedLanguage];

  if (isCorrect) {
    submitBtn.textContent = t.typeNext;
    submitBtn.className = "type-submit-btn btn-next";
    setTimeout(advanceTypeQuestion, 900);
  } else {
    const revealEl = document.getElementById("type-reveal");
    revealEl.innerHTML = `${t.typeAnswerWas}<strong>${getPrimaryAnswer(q.correct)}</strong>`;
    revealEl.classList.remove("hidden");
    submitBtn.textContent = t.typeNext;
    submitBtn.className = "type-submit-btn btn-next";
  }
}

async function startType() {
  if (selectedMode === "maps" && selectedCategory !== "family") {
    if (selectedCategory === "america") await loadUsMapData(); else await loadWorldData();
  }
  hideWinModal();
  typeState.questions = buildTypeQuestions();
  typeState.currentIndex = 0;
  typeState.score = 0;
  typeState.answered = false;
  typeScoreDisplay.textContent = "0 / 0";
  showTypeScreen();
  startTimer(typeTimerDisplay);
  renderTypeQuestion();
}

function renderQuizQuestion() {
  const q = quizState.questions[quizState.currentIndex];
  const total = quizState.questions.length;

  const feedbackEl = document.getElementById("quiz-feedback");
  if (feedbackEl) feedbackEl.className = "quiz-feedback hidden";

  quizProgressDisplay.textContent = `${quizState.currentIndex + 1} / ${total}`;
  quizScoreDisplay.textContent = `${quizState.score} / ${quizState.currentIndex}`;

  renderPromptInEl(document.getElementById("quiz-prompt"), q.correct, false);

  const answersEl = document.getElementById("quiz-answers");
  answersEl.innerHTML = "";
  quizState.answered = false;

  q.answers.forEach(item => {
    const btn = document.createElement("button");
    if (selectedCategory === "family" && selectedQuizDirection === "name-to-photo") {
      btn.className = "answer-btn answer-photo-btn";
      btn.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
    } else if (selectedCategory === "animals" && selectedQuizDirection === "name-to-photo") {
      btn.className = "answer-btn answer-photo-btn";
      btn.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
    } else if (selectedCategory === "cars" && selectedQuizDirection === "name-to-photo" && selectedMode !== "capitals") {
      btn.className = "answer-btn answer-photo-btn";
      btn.innerHTML = `<img src="${item.logo}" alt="${countryName(item)}" class="answer-car-logo">`;
    } else {
      btn.className = "answer-btn";
      let answerText;
      if (selectedCategory === "family") {
        answerText = item.name;
        btn.setAttribute("dir", "rtl");
      } else if (selectedCategory === "animals") {
        answerText = selectedLanguage === "he" ? item.nameHe : item.name;
        if (selectedLanguage === "he") btn.setAttribute("dir", "rtl");
      } else if (selectedMode === "capitals") {
        answerText = selectedCategory === "america" ? stateCapitalName(item) : capitalName(item);
        if (selectedLanguage === "he") btn.setAttribute("dir", "rtl");
      } else {
        answerText = selectedCategory === "america" ? stateName(item) : countryName(item);
        if (selectedLanguage === "he") btn.setAttribute("dir", "rtl");
      }
      btn.textContent = answerText;
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

  if (isCorrect) Feedback.correct(); else Feedback.wrong();

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
      Feedback.win();
      setTimeout(showWinModal, WIN_MODAL_DELAY_MS);
    } else {
      renderQuizQuestion();
    }
  }, QUIZ_ADVANCE_DELAY_MS);
}

async function startQuiz() {
  if (selectedMode === "maps" && selectedCategory !== "family") {
    if (selectedCategory === "america") await loadUsMapData(); else await loadWorldData();
  }
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
  if (selectedMode === "maps" && selectedCategory !== "family") {
    startButton.disabled = true;
    startButton.textContent = selectedLanguage === "he" ? "טוען מפה…" : "Loading map…";
    if (selectedCategory === "america") await loadUsMapData(); else await loadWorldData();
    startButton.disabled = false;
    startButton.textContent = UI_TEXT[selectedLanguage].btnStart;
  }
  if (selectedGameType === "quiz") {
    startQuiz();
  } else if (selectedGameType === "type") {
    startType();
  } else {
    showGameScreen();
    createBoard();
  }
}

// ── Learn screen ───────────────────────────────────────────────────────────

let learnObserver = null;

async function showLearnScreen() {
  document.getElementById('start-screen').classList.add('hidden');
  const learnScreen = document.getElementById('learn-screen');
  learnScreen.classList.remove('hidden');

  const t = UI_TEXT[selectedLanguage];
  const searchEl = document.getElementById('learn-search');
  searchEl.placeholder = t.learnSearchPlaceholder;
  searchEl.value = '';

  // Show a loading state while world data fetches
  const listEl = document.getElementById('learn-list');
  listEl.innerHTML = `<p style="text-align:center;color:#64748b;padding:40px 0">⏳ טוען מפות…</p>`;

  await loadWorldData();
  buildLearnList('');
}

function buildLearnList(filter) {
  const listEl = document.getElementById('learn-list');

  // Disconnect previous observer
  if (learnObserver) { learnObserver.disconnect(); learnObserver = null; }

  const q = filter.trim().toLowerCase();
  const sorted = [...allCountries].sort((a, b) => a.country.localeCompare(b.country));
  const visible = q
    ? sorted.filter(c =>
        c.country.toLowerCase().includes(q) ||
        c.nameHe.includes(filter.trim()) ||
        c.capital.toLowerCase().includes(q) ||
        (c.capitalHe || '').includes(filter.trim()))
    : sorted;

  listEl.innerHTML = '';
  const isHe = selectedLanguage === 'he';

  visible.forEach(country => {
    const name    = isHe ? country.nameHe    : country.country;
    const capital = isHe ? (country.capitalHe || country.capital) : country.capital;
    const dir     = isHe ? ' dir="rtl"' : '';

    const card = document.createElement('div');
    card.className = 'learn-card';
    card.innerHTML =
      `<img class="learn-flag" src="https://flagcdn.com/w160/${country.code}.png" alt="${name}" loading="lazy">` +
      `<div class="learn-info">` +
        `<span class="learn-country-name"${dir}>${name}</span>` +
        `<span class="learn-capital"${dir}>${capital}</span>` +
      `</div>` +
      `<div class="learn-map-cell" data-code="${country.code}">🗺️</div>`;

    listEl.appendChild(card);
  });

  // Lazy-render SVG maps as cards scroll into view
  learnObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const cell = entry.target;
      if (cell.querySelector('svg')) return;
      const svg = renderCountryMapSVG(cell.dataset.code);
      if (svg) {
        cell.innerHTML = svg;
        learnObserver.unobserve(cell);
      }
      // If svg is null (bad geometry), leave observed so it can retry on re-scroll
    });
  }, { rootMargin: '150px' });

  listEl.querySelectorAll('.learn-map-cell').forEach(cell => learnObserver.observe(cell));
}

// ── Event listeners ────────────────────────────────────────────────────────

document.querySelectorAll(".lang-btn").forEach(btn => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

document.querySelectorAll(".game-type-btn").forEach(btn => {
  btn.addEventListener("click", () => setGameType(btn.dataset.type));
});

document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.addEventListener("click", () => setCategory(btn.dataset.cat));
});

document.querySelectorAll(".mode-btn").forEach(btn => {
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

document.getElementById("learn-btn").addEventListener("click", showLearnScreen);
document.getElementById("learn-home-btn").addEventListener("click", () => {
  if (learnObserver) { learnObserver.disconnect(); learnObserver = null; }
  document.getElementById('learn-screen').classList.add('hidden');
  document.getElementById('start-screen').classList.remove('hidden');
});
document.getElementById("learn-search").addEventListener("input", e => {
  buildLearnList(e.target.value);
});

homeButton.addEventListener("click", showStartScreen);
quizHomeButton.addEventListener("click", showStartScreen);

restartButton.addEventListener("click", createBoard);
quizRestartButton.addEventListener("click", () => startQuiz());

playAgainButton.addEventListener("click", function () {
  hideWinModal();
  if (selectedGameType === "quiz") startQuiz();
  else if (selectedGameType === "type") startType();
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

document.getElementById("win-home-btn").addEventListener("click", showStartScreen);

winStartButton.addEventListener("click", async function () {
  hideWinModal();
  await startGame();
});

document.querySelectorAll(".quiz-dir-btn").forEach(btn => {
  btn.addEventListener("click", () => setQuizDirection(btn.dataset.dir));
});

typeHomeButton.addEventListener("click", showStartScreen);
typeRestartButton.addEventListener("click", () => startType());

document.getElementById("type-submit-btn").addEventListener("click", handleTypeSubmit);

document.getElementById("type-input").addEventListener("keydown", e => {
  if (e.key === "Enter") handleTypeSubmit();
});

// ── Leaderboard save / skip ────────────────────────────────────────────────

function handleLbSave() {
  const input = document.getElementById("lb-name-input");
  const name = input.value.trim();
  if (!name) return;
  const idx = addToLeaderboard(name);
  document.getElementById("lb-name-entry").classList.add("hidden");
  renderLeaderboard(idx);
}

document.getElementById("lb-save-btn").addEventListener("click", handleLbSave);

document.getElementById("lb-name-input").addEventListener("keydown", e => {
  if (e.key === "Enter") handleLbSave();
});

document.getElementById("lb-skip-btn").addEventListener("click", () => {
  document.getElementById("lb-name-entry").classList.add("hidden");
  renderLeaderboard(-1);
});

// ── Feedback settings ──────────────────────────────────────────────────────

function syncFeedbackButtons() {
  document.querySelectorAll(".feedback-btn[data-feedback='sound']").forEach(btn => {
    btn.classList.toggle("active", Feedback.soundOn);
  });
  document.querySelectorAll(".feedback-btn[data-feedback='haptics']").forEach(btn => {
    btn.classList.toggle("active", Feedback.hapticsOn);
  });
}

// Disable haptics toggle on devices where navigator.vibrate is unavailable (iOS Safari)
if (!Feedback.canVibrate) {
  document.querySelectorAll(".feedback-btn[data-feedback='haptics']").forEach(btn => {
    btn.disabled = true;
    btn.classList.remove("active");
  });
}

document.querySelectorAll(".feedback-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.feedback;
    if (type === "sound") {
      Feedback.setSound(!Feedback.soundOn);
    } else if (type === "haptics" && Feedback.canVibrate) {
      Feedback.setHaptics(!Feedback.hapticsOn);
    }
    syncFeedbackButtons();
  });
});

syncFeedbackButtons();

// Subtle tap sound for all non-card button presses
document.addEventListener("click", e => {
  if (e.target.closest("button") && !e.target.closest(".card")) Feedback.tap();
});

loadWorldData();
updatePairsDisplay();
updateSettingsVisibility();
applyLanguageToUI(selectedLanguage);
document.querySelectorAll(".app-version").forEach(el => { el.textContent = `v${VERSION}`; });
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
