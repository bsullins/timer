const elements = {
  phaseLabel: document.getElementById("phaseLabel"),
  timeDisplay: document.getElementById("timeDisplay"),
  roundLabel: document.getElementById("roundLabel"),
  progressBar: document.getElementById("progressBar"),
  startBtn: document.getElementById("startBtn"),
  pauseBtn: document.getElementById("pauseBtn"),
  resetBtn: document.getElementById("resetBtn"),
  menuBtn: document.getElementById("menuBtn"),
  setupPanel: document.getElementById("setupPanel"),
  panelCloseBtn: document.getElementById("panelCloseBtn"),
  panelBackdrop: document.getElementById("panelBackdrop"),
  roundsInput: document.getElementById("roundsInput"),
  workInput: document.getElementById("workInput"),
  restInput: document.getElementById("restInput"),
  volumeInput: document.getElementById("volumeInput"),
  soundToggle: document.getElementById("soundToggle"),
  vibrateToggle: document.getElementById("vibrateToggle"),
  totalTime: document.getElementById("totalTime"),
};

const DEFAULTS = {
  rounds: 5,
  work: 60,
  rest: 10,
  sound: true,
  vibrate: false,
  volume: 0.6,
};

const state = {
  running: false,
  paused: false,
  phase: "idle",
  round: 0,
  rounds: DEFAULTS.rounds,
  work: DEFAULTS.work,
  rest: DEFAULTS.rest,
  remaining: 0,
  duration: 0,
  endTime: 0,
  timerId: null,
  sound: DEFAULTS.sound,
  vibrate: DEFAULTS.vibrate,
  volume: DEFAULTS.volume,
};

const presetButtons = Array.from(document.querySelectorAll("[data-preset]"));

let audioContext = null;

const formatTime = (value) => {
  const minutes = Math.floor(value / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const sanitizeNumber = (value, min, max, fallback) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.min(Math.max(parsed, min), max);
};

const sanitizeFloat = (value, min, max, fallback) => {
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.min(Math.max(parsed, min), max);
};

const saveSettings = () => {
  const payload = {
    rounds: state.rounds,
    work: state.work,
    rest: state.rest,
    sound: state.sound,
    vibrate: state.vibrate,
    volume: state.volume,
  };
  localStorage.setItem("ttimer.settings", JSON.stringify(payload));
};

const loadSettings = () => {
  const stored = localStorage.getItem("ttimer.settings");
  if (!stored) {
    return;
  }
  try {
    const parsed = JSON.parse(stored);
    state.rounds = sanitizeNumber(parsed.rounds, 1, 50, DEFAULTS.rounds);
    state.work = sanitizeNumber(parsed.work, 1, 600, DEFAULTS.work);
    state.rest = sanitizeNumber(parsed.rest, 0, 600, DEFAULTS.rest);
    state.sound = Boolean(parsed.sound);
    state.vibrate = Boolean(parsed.vibrate);
    state.volume = sanitizeFloat(parsed.volume, 0, 1, DEFAULTS.volume);
  } catch (error) {
    console.warn("Failed to load settings", error);
  }
};

const updateInputs = () => {
  elements.roundsInput.value = state.rounds;
  elements.workInput.value = state.work;
  elements.restInput.value = state.rest;
  elements.volumeInput.value = state.volume;
  elements.soundToggle.checked = state.sound;
  elements.vibrateToggle.checked = state.vibrate;
  updatePresetHighlight();
};

const updatePresetHighlight = () => {
  presetButtons.forEach((button) => {
    const rounds = sanitizeNumber(button.dataset.rounds, 1, 50, state.rounds);
    const work = sanitizeNumber(button.dataset.work, 1, 600, state.work);
    const rest = sanitizeNumber(button.dataset.rest, 0, 600, state.rest);
    const isMatch =
      rounds === state.rounds && work === state.work && rest === state.rest;
    button.classList.toggle("is-active", isMatch);
  });
};

const updateTotalTime = () => {
  const total = state.rounds * (state.work + state.rest);
  elements.totalTime.textContent = `Total time: ${formatTime(total)}`;
};

const updateUI = () => {
  elements.phaseLabel.textContent = state.phase.toUpperCase();
  elements.timeDisplay.textContent = formatTime(state.remaining);
  elements.roundLabel.textContent = `Round ${state.round} of ${state.rounds}`;

  const progress =
    state.duration > 0
      ? ((state.duration - state.remaining) / state.duration) * 100
      : 0;
  elements.progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;

  elements.pauseBtn.disabled = !state.running || state.paused;
  elements.startBtn.textContent = state.running && state.paused ? "Resume" : "Start";
};

const setPanelOpen = (open) => {
  const next = Boolean(open);
  elements.setupPanel.classList.toggle("is-open", next);
  elements.panelBackdrop.classList.toggle("is-open", next);
  elements.menuBtn.setAttribute("aria-expanded", String(next));
};

const togglePanel = () => {
  const isOpen = elements.setupPanel.classList.contains("is-open");
  setPanelOpen(!isOpen);
};

const setPhase = (phase, duration) => {
  state.phase = phase;
  state.duration = duration;
  state.remaining = duration;
  state.endTime = performance.now() + duration * 1000;
  cue(phase);
  updateUI();
};

const cue = (phase) => {
  if (state.sound) {
    playBeep(phase);
  }
  if (state.vibrate) {
    vibrate(phase);
  }
};

const playTone = (frequency) => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(state.volume, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.18);
};

const playBeep = (phase) => {
  const frequency = phase === "work" ? 620 : phase === "rest" ? 440 : 300;
  playTone(frequency);
};

const vibrate = (phase) => {
  if (!navigator.vibrate) {
    return;
  }
  const pattern =
    phase === "work" ? [80] : phase === "rest" ? [120] : [220];
  navigator.vibrate(pattern);
};

const stopTimer = () => {
  if (state.timerId) {
    clearInterval(state.timerId);
  }
  state.timerId = null;
  state.running = false;
  state.paused = false;
};

const startTimerLoop = () => {
  if (state.timerId) {
    clearInterval(state.timerId);
  }

  state.timerId = setInterval(() => {
    if (!state.running || state.paused) {
      return;
    }

    const remaining = Math.max(
      0,
      Math.ceil((state.endTime - performance.now()) / 1000)
    );

    if (remaining !== state.remaining) {
      state.remaining = remaining;
      updateUI();

      if (
        state.sound &&
        (state.phase === "work" || state.phase === "rest") &&
        remaining > 0 &&
        remaining <= 3
      ) {
        playTone(220);
      }
    }

    if (remaining === 0) {
      handlePhaseComplete();
    }
  }, 200);
};

const handlePhaseComplete = () => {
  if (state.phase === "work") {
    if (state.rest > 0) {
      setPhase("rest", state.rest);
    } else {
      advanceRound();
    }
    return;
  }

  if (state.phase === "rest") {
    advanceRound();
  }
};

const advanceRound = () => {
  if (state.round < state.rounds) {
    state.round += 1;
    setPhase("work", state.work);
    return;
  }

  stopTimer();
  state.phase = "complete";
  state.duration = 0;
  state.remaining = 0;
  cue("complete");
  updateUI();
};

const startWorkout = () => {
  if (state.running && state.paused) {
    state.paused = false;
    state.endTime = performance.now() + state.remaining * 1000;
    updateUI();
    return;
  }

  if (state.running) {
    return;
  }

  state.running = true;
  state.paused = false;
  state.round = 1;
  setPhase("work", state.work);
  startTimerLoop();
};

const pauseWorkout = () => {
  if (!state.running || state.paused) {
    return;
  }
  state.paused = true;
  updateUI();
};

const resetWorkout = () => {
  stopTimer();
  state.phase = "idle";
  state.round = 0;
  state.duration = 0;
  state.remaining = 0;
  updateUI();
};

const handleSettingsChange = () => {
  state.rounds = sanitizeNumber(elements.roundsInput.value, 1, 50, state.rounds);
  state.work = sanitizeNumber(elements.workInput.value, 1, 600, state.work);
  state.rest = sanitizeNumber(elements.restInput.value, 0, 600, state.rest);
  state.volume = sanitizeFloat(elements.volumeInput.value, 0, 1, state.volume);
  state.sound = elements.soundToggle.checked;
  state.vibrate = elements.vibrateToggle.checked;
  updateInputs();
  updateTotalTime();
  saveSettings();

  if (!state.running) {
    resetWorkout();
  }
};

const applyPreset = (event) => {
  const button = event.currentTarget;
  const rounds = sanitizeNumber(button.dataset.rounds, 1, 50, state.rounds);
  const work = sanitizeNumber(button.dataset.work, 1, 600, state.work);
  const rest = sanitizeNumber(button.dataset.rest, 0, 600, state.rest);

  stopTimer();
  state.rounds = rounds;
  state.work = work;
  state.rest = rest;

  updateInputs();
  updateTotalTime();
  saveSettings();
  resetWorkout();
};

const init = () => {
  loadSettings();
  updateInputs();
  updateTotalTime();
  updateUI();

  setPanelOpen(false);

  elements.startBtn.addEventListener("click", startWorkout);
  elements.pauseBtn.addEventListener("click", pauseWorkout);
  elements.resetBtn.addEventListener("click", resetWorkout);

  elements.menuBtn.addEventListener("click", togglePanel);
  elements.panelCloseBtn.addEventListener("click", () => setPanelOpen(false));
  elements.panelBackdrop.addEventListener("click", () => setPanelOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setPanelOpen(false);
    }
  });

  elements.roundsInput.addEventListener("change", handleSettingsChange);
  elements.workInput.addEventListener("change", handleSettingsChange);
  elements.restInput.addEventListener("change", handleSettingsChange);
  elements.volumeInput.addEventListener("input", handleSettingsChange);
  elements.soundToggle.addEventListener("change", handleSettingsChange);
  elements.vibrateToggle.addEventListener("change", handleSettingsChange);

  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", applyPreset);
  });
};

init();
