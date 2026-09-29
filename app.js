/**
 * BC Grade 8 Social Studies Discovery Portal - Application State & UI Engine
 * Mobile-First Client-Side Single Page Application (SPA)
 */

(function () {
  'use strict';

  // State Store Key
  const STORAGE_KEY = "BC_Socials8_Session";

  // Default Application State
  const defaultAppState = {
    activeView: "dashboard", // 'dashboard' | 'unit' | 'quiz'
    currentModuleIndex: 0,
    currentUnitIndex: 0,
    activeQuizQuestionIndex: 0,
    quizCorrectAnswersCount: 0,
    quizSelectedAnswer: null,
    quizAnswerSubmitted: false,
    soundEnabled: true,
    searchQuery: "",
    appSessionState: {
      completedUnits: [],
      quizHighScores: {},
      lastAccessedTimestamp: "",
      lastAccessedUnitId: "M1-U1"
    }
  };

  let appState = { ...defaultAppState };

  // ==========================================
  // Web Audio Synthesizer (Zero external audio files)
  // ==========================================
  const SoundFX = {
    ctx: null,
    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
    },
    playTone(freq, duration = 0.15, type = 'sine') {
      if (!appState.soundEnabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio policy or unsupported
      }
    },
    correct() {
      this.playTone(587.33, 0.12, 'triangle'); // D5
      setTimeout(() => this.playTone(880, 0.25, 'triangle'), 100); // A5
    },
    incorrect() {
      this.playTone(220, 0.18, 'sawtooth'); // A3
      setTimeout(() => this.playTone(185, 0.25, 'sawtooth'), 120); // F#3
    },
    complete() {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
      notes.forEach((freq, i) => {
        setTimeout(() => this.playTone(freq, 0.22, 'sine'), i * 110);
      });
    }
  };

  // ==========================================
  // Lightweight Confetti Particles
  // ==========================================
  function fireConfetti() {
    const canvas = document.getElementById("confettiCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = "block";

    const particles = [];
    const colors = ["#6366f1", "#4f46e5", "#10b981", "#f59e0b", "#ec4899", "#3b82f6"];
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 3,
        r: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 14,
        gravity: 0.35,
        tilt: Math.random() * 10,
        tiltAngle: Math.random() * Math.PI,
        opacity: 1
      });
    }

    let animationFrame;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = 0;
      particles.forEach(p => {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.012;
        p.tiltAngle += 0.1;
        p.tilt = Math.sin(p.tiltAngle) * 8;

        if (p.opacity > 0 && p.y < canvas.height) {
          active++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x + p.tilt, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (active > 0) {
        animationFrame = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrame);
        canvas.style.display = "none";
      }
    }
    render();
  }

  // ==========================================
  // Storage & State Hydration
  // ==========================================
  function initAppEngine() {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        appState = {
          ...defaultAppState,
          ...parsed,
          appSessionState: {
            ...defaultAppState.appSessionState,
            ...(parsed.appSessionState || {})
          }
        };
      }
    } catch (e) {
      console.warn("Could not load saved state from localStorage:", e);
    }

    // Attach global listeners
    document.getElementById("globalBackBtn").addEventListener("click", () => {
      if (appState.activeView === "quiz") {
        navigateTo("unit", appState.currentModuleIndex, appState.currentUnitIndex);
      } else {
        navigateTo("dashboard");
      }
    });

    const resetBtn = document.getElementById("resetProgressBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", confirmResetProgress);
    }

    const soundToggleBtn = document.getElementById("soundToggleBtn");
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener("click", toggleSound);
      updateSoundButtonLabel();
    }

    // Handle hash change for bookmarking / browser back
    window.addEventListener("popstate", (e) => {
      if (e.state && e.state.view) {
        appState.activeView = e.state.view;
        appState.currentModuleIndex = e.state.modIdx ?? 0;
        appState.currentUnitIndex = e.state.unitIdx ?? 0;
        renderAppView();
      }
    });

    renderAppView();
  }

  function saveAppStateToLocalStorage() {
    try {
      appState.appSessionState.lastAccessedTimestamp = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.warn("Failed to write to localStorage:", e);
    }
  }

  function toggleSound() {
    appState.soundEnabled = !appState.soundEnabled;
    updateSoundButtonLabel();
    saveAppStateToLocalStorage();
    if (appState.soundEnabled) {
      SoundFX.playTone(660, 0.1);
    }
  }

  function updateSoundButtonLabel() {
    const btn = document.getElementById("soundToggleBtn");
    if (btn) {
      btn.innerHTML = appState.soundEnabled
        ? `<span class="text-sm">🔔 Sound ON</span>`
        : `<span class="text-sm text-slate-400">🔕 Sound OFF</span>`;
    }
  }

  function confirmResetProgress() {
    const confirmed = window.confirm(
      "Are you sure you want to reset all of Ryo's learning progress and quiz scores? This cannot be undone."
    );
    if (confirmed) {
      appState.appSessionState = {
        completedUnits: [],
        quizHighScores: {},
        lastAccessedTimestamp: new Date().toISOString(),
        lastAccessedUnitId: "M1-U1"
      };
      appState.activeView = "dashboard";
      appState.currentModuleIndex = 0;
      appState.currentUnitIndex = 0;
      saveAppStateToLocalStorage();
      renderAppView();
    }
  }

  // ==========================================
  // Router & Navigation
  // ==========================================
  function navigateTo(viewName, modIdx = 0, unitIdx = 0) {
    appState.activeView = viewName;
    appState.currentModuleIndex = Math.max(0, Math.min(modIdx, CURRICULUM_DATA.length - 1));
    const currentMod = CURRICULUM_DATA[appState.currentModuleIndex];
    appState.currentUnitIndex = Math.max(0, Math.min(unitIdx, currentMod.units.length - 1));

    if (viewName === "quiz") {
      appState.activeQuizQuestionIndex = 0;
      appState.quizCorrectAnswersCount = 0;
      appState.quizSelectedAnswer = null;
      appState.quizAnswerSubmitted = false;
    }

    if (viewName === "unit" || viewName === "quiz") {
      const unit = currentMod.units[appState.currentUnitIndex];
      if (unit) {
        appState.appSessionState.lastAccessedUnitId = unit.unitId;
      }
    }

    saveAppStateToLocalStorage();

    // Push history state
    try {
      history.pushState(
        { view: viewName, modIdx: appState.currentModuleIndex, unitIdx: appState.currentUnitIndex },
        "",
        `#${viewName}-${appState.currentModuleIndex + 1}-${appState.currentUnitIndex + 1}`
      );
    } catch (e) {}

    renderAppView();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ==========================================
  // Helpers
  // ==========================================
  function getTotalUnitsCount() {
    let count = 0;
    CURRICULUM_DATA.forEach(m => (count += m.units.length));
    return count;
  }

  function getCompletedUnitsCount() {
    return (appState.appSessionState.completedUnits || []).length;
  }

  function getUnitByIndices(modIdx, unitIdx) {
    const mod = CURRICULUM_DATA[modIdx];
    if (!mod) return null;
    return mod.units[unitIdx] || null;
  }

  function findUnitCoordinatesById(unitId) {
    for (let m = 0; m < CURRICULUM_DATA.length; m++) {
      for (let u = 0; u < CURRICULUM_DATA[m].units.length; u++) {
        if (CURRICULUM_DATA[m].units[u].unitId === unitId) {
          return { modIdx: m, unitIdx: u };
        }
      }
    }
    return { modIdx: 0, unitIdx: 0 };
  }

  function getNextIncompleteUnit() {
    for (let m = 0; m < CURRICULUM_DATA.length; m++) {
      for (let u = 0; u < CURRICULUM_DATA[m].units.length; u++) {
        const uid = CURRICULUM_DATA[m].units[u].unitId;
        if (!appState.appSessionState.completedUnits.includes(uid)) {
          return { modIdx: m, unitIdx: u, unit: CURRICULUM_DATA[m].units[u] };
        }
      }
    }
    // All completed! Return first unit
    return { modIdx: 0, unitIdx: 0, unit: CURRICULUM_DATA[0].units[0] };
  }

  // ==========================================
  // Master Render Engine
  // ==========================================
  function renderAppView() {
    const container = document.getElementById("viewDisplayEngine");
    const headerTitle = document.getElementById("headerViewTitle");
    const backBtn = document.getElementById("globalBackBtn");
    const progressBarBadge = document.getElementById("globalProgressBarBadge");

    const totalUnits = getTotalUnitsCount();
    const completedCount = getCompletedUnitsCount();
    const percent = Math.round((completedCount / totalUnits) * 100);

    progressBarBadge.innerHTML = `
      <span class="inline-flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        ${percent}% Done
      </span>
    `;

    if (appState.activeView === "dashboard") {
      headerTitle.innerText = "Socials 8 Hub";
      backBtn.style.visibility = "hidden";
      renderDashboardView(container, percent, completedCount, totalUnits);
    } else if (appState.activeView === "unit") {
      headerTitle.innerText = `Module ${appState.currentModuleIndex + 1}`;
      backBtn.style.visibility = "visible";
      backBtn.innerHTML = "← Hub";
      renderUnitView(container);
    } else if (appState.activeView === "quiz") {
      headerTitle.innerText = "Practice Quiz";
      backBtn.style.visibility = "visible";
      backBtn.innerHTML = "✕ Exit";
      renderQuizView(container);
    }
  }

  // ==========================================
  // 1. DASHBOARD VIEW
  // ==========================================
  function renderDashboardView(container, percent, completedCount, totalUnits) {
    // Determine resume unit
    const lastId = appState.appSessionState.lastAccessedUnitId;
    let resumeCoords = lastId ? findUnitCoordinatesById(lastId) : getNextIncompleteUnit();
    const resumeUnit = getUnitByIndices(resumeCoords.modIdx, resumeCoords.unitIdx);
    const resumeModule = CURRICULUM_DATA[resumeCoords.modIdx];

    const isAllDone = completedCount >= totalUnits;

    let html = `
      <!-- Hero Progress & Welcome Card -->
      <div class="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 mb-6 shadow-xl border border-indigo-800/40 relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="text-indigo-300 text-xs font-black uppercase tracking-wider bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-700/50">
            BC Social Studies 8
          </span>
          <span class="text-xs font-bold text-slate-300">
            ${completedCount} of ${totalUnits} Units
          </span>
        </div>
        
        <h2 class="text-2xl font-black mt-2 tracking-tight">Ryo's Discovery Portal</h2>
        <p class="text-slate-300 text-sm mt-1 mb-4 leading-normal">
          From the fall of Rome to the dawn of the global world (600–1750 CE).
        </p>

        <!-- Progress Bar Meter -->
        <div class="w-full bg-slate-800/80 rounded-full h-3.5 p-0.5 border border-slate-700/60 mb-2">
          <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-2.5 rounded-full transition-all duration-700 ease-out" style="width: ${percent}%"></div>
        </div>

        <div class="flex justify-between items-center text-xs text-slate-300 font-semibold mt-1">
          <span>Overall Mastery</span>
          <span class="text-emerald-400 font-bold">${percent}%</span>
        </div>
      </div>

      <!-- Quick Jump / Resume Learning Card -->
      <div class="bg-white rounded-3xl p-5 mb-6 shadow-md border border-slate-200/90 hover:border-indigo-300 transition-colors">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
            ${isAllDone ? "🎉 Mastery Achieved!" : "⚡ Quick Resume"}
          </span>
          <span class="text-xs text-slate-500 font-medium">
            ${resumeModule ? resumeModule.era : ""}
          </span>
        </div>

        <h3 class="text-xl font-extrabold text-slate-900 mt-1 mb-1 tracking-tight">
          ${resumeUnit ? resumeUnit.title : "The Fragmentation of Western Europe"}
        </h3>
        <p class="text-sm text-slate-600 line-clamp-1 mb-4">
          ${resumeUnit ? resumeUnit.subtitle : ""}
        </p>

        <button 
          id="resumeStudyBtn"
          class="w-full min-h-[48px] bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-base rounded-2xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2">
          <span>${isAllDone ? "Review Curriculum" : "Continue Learning"}</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
          </svg>
        </button>
      </div>

      <!-- Curriculum Search & Filter -->
      <div class="mb-6">
        <div class="relative">
          <input 
            type="text" 
            id="unitSearchInput" 
            placeholder="Search topics (e.g., Samurai, Aztec, Black Death)..." 
            value="${escapeHtml(appState.searchQuery || '')}"
            class="w-full min-h-[48px] pl-11 pr-4 text-base bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 shadow-sm transition-all"
          />
          <svg class="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
          </svg>
          ${appState.searchQuery ? `
            <button id="clearSearchBtn" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2">
              ✕
            </button>
          ` : ''}
        </div>
      </div>

      <!-- 8 Curriculum Modules List -->
      <div class="space-y-5">
        <div class="flex items-center justify-between px-1">
          <h3 class="text-xl font-extrabold text-slate-900 tracking-tight">Curriculum Modules (8)</h3>
          <span class="text-xs font-bold text-slate-500">24 Units Total</span>
        </div>
    `;

    // Filter modules based on search query
    const q = (appState.searchQuery || "").trim().toLowerCase();

    CURRICULUM_DATA.forEach((module, modIdx) => {
      // Check if module matches or any of its units match
      const matchingUnits = module.units.filter(u => {
        if (!q) return true;
        return (
          u.title.toLowerCase().includes(q) ||
          u.subtitle.toLowerCase().includes(q) ||
          u.content.background.toLowerCase().includes(q) ||
          u.content.focus.toLowerCase().includes(q)
        );
      });

      if (q && matchingUnits.length === 0 && !module.moduleTitle.toLowerCase().includes(q)) {
        return; // Skip non-matching module
      }

      // Count completed in this module
      const moduleCompleted = module.units.filter(u =>
        appState.appSessionState.completedUnits.includes(u.unitId)
      ).length;

      const isModuleDone = moduleCompleted === module.units.length;

      html += `
        <div class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm transition-all hover:shadow-md">
          <!-- Module Header -->
          <div class="flex items-start justify-between gap-3 mb-2">
            <div>
              <span class="text-xs font-extrabold text-indigo-700 uppercase tracking-wider">
                ${module.era}
              </span>
              <h4 class="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                ${module.moduleTitle}
              </h4>
            </div>
            <div class="shrink-0 text-right">
              <span class="text-xs font-bold ${isModuleDone ? 'text-emerald-700 bg-emerald-100' : 'text-slate-600 bg-slate-100'} px-2.5 py-1 rounded-full">
                ${moduleCompleted}/${module.units.length} Done
              </span>
            </div>
          </div>

          <p class="text-xs text-slate-500 mb-4 leading-relaxed">
            ${module.description}
          </p>

          <!-- Units Stack -->
          <div class="space-y-2.5 border-t border-slate-100 pt-3">
      `;

      module.units.forEach((unit, unitIdx) => {
        // If searching, hide non-matching units
        if (q && !matchingUnits.includes(unit)) return;

        const isDone = appState.appSessionState.completedUnits.includes(unit.unitId);
        const score = appState.appSessionState.quizHighScores[unit.unitId];

        html += `
          <button 
            data-mod-idx="${modIdx}" 
            data-unit-idx="${unitIdx}" 
            class="unit-card-btn w-full text-left p-3.5 rounded-2xl border transition-all active:scale-[0.99] flex items-center justify-between gap-3 min-h-[48px] ${
              isDone 
                ? 'bg-emerald-50/50 border-emerald-200/70 hover:border-emerald-300' 
                : 'bg-slate-50/70 border-slate-200/70 hover:border-indigo-300 hover:bg-indigo-50/20'
            }">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs ${
                isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }">
                ${isDone ? '✓' : (unit.unitNumber || (modIdx * 3 + unitIdx + 1))}
              </div>
              <div class="min-w-0">
                <div class="text-sm font-black text-slate-900 truncate">
                  ${unit.title}
                </div>
                ${unit.subtitle ? `
                  <div class="text-xs text-slate-500 truncate">
                    ${unit.subtitle}
                  </div>
                ` : ''}
              </div>
            </div>

            <div class="shrink-0 flex items-center gap-2">
              ${score !== undefined ? `
                <span class="text-xs font-black px-2 py-0.5 rounded-md ${
                  score === 100 ? 'bg-emerald-200 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                }">
                  ${score}%
                </span>
              ` : ''}
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
              </svg>
            </div>
          </button>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    html += `
      </div>

      <!-- App Info & Reset Footer -->
      <div class="mt-10 pt-6 border-t border-slate-200 text-center">
        <p class="text-xs text-slate-400 font-medium mb-3">
          BC Grade 8 Social Studies Discovery Portal • Aligned to BC Curriculum
        </p>
        <button 
          id="dashboardResetBtn" 
          class="text-xs text-slate-400 hover:text-rose-600 underline font-semibold py-2 px-3">
          Reset Progress
        </button>
      </div>
    `;

    container.innerHTML = html;

    // Attach listeners
    const resumeBtn = document.getElementById("resumeStudyBtn");
    if (resumeBtn && resumeUnit) {
      resumeBtn.addEventListener("click", () => {
        navigateTo("unit", resumeCoords.modIdx, resumeCoords.unitIdx);
      });
    }

    const searchInput = document.getElementById("unitSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        appState.searchQuery = e.target.value;
        renderDashboardView(container, percent, completedCount, totalUnits);
      });
    }

    const clearBtn = document.getElementById("clearSearchBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        appState.searchQuery = "";
        renderDashboardView(container, percent, completedCount, totalUnits);
      });
    }

    const dashReset = document.getElementById("dashboardResetBtn");
    if (dashReset) {
      dashReset.addEventListener("click", confirmResetProgress);
    }

    container.querySelectorAll(".unit-card-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const m = parseInt(btn.getAttribute("data-mod-idx"), 10);
        const u = parseInt(btn.getAttribute("data-unit-idx"), 10);
        navigateTo("unit", m, u);
      });
    });
  }

  // ==========================================
  // 2. UNIT CORE VIEW
  // ==========================================
  function renderUnitView(container) {
    const module = CURRICULUM_DATA[appState.currentModuleIndex];
    const unit = module.units[appState.currentUnitIndex];
    const isCompleted = appState.appSessionState.completedUnits.includes(unit.unitId);
    const quizScore = appState.appSessionState.quizHighScores[unit.unitId];

    // Determine Prev & Next Units
    let prevCoords = null;
    let nextCoords = null;

    if (appState.currentUnitIndex > 0) {
      prevCoords = { modIdx: appState.currentModuleIndex, unitIdx: appState.currentUnitIndex - 1 };
    } else if (appState.currentModuleIndex > 0) {
      const prevMod = CURRICULUM_DATA[appState.currentModuleIndex - 1];
      prevCoords = { modIdx: appState.currentModuleIndex - 1, unitIdx: prevMod.units.length - 1 };
    }

    if (appState.currentUnitIndex < module.units.length - 1) {
      nextCoords = { modIdx: appState.currentModuleIndex, unitIdx: appState.currentUnitIndex + 1 };
    } else if (appState.currentModuleIndex < CURRICULUM_DATA.length - 1) {
      nextCoords = { modIdx: appState.currentModuleIndex + 1, unitIdx: 0 };
    }

    let html = `
      <!-- Unit Header Badge & Meta -->
      <div class="mb-4">
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="text-xs font-black tracking-wider uppercase bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
            ${module.moduleTitle.split(':')[0]} • Unit ${unit.unitNumber || (appState.currentModuleIndex * 3 + appState.currentUnitIndex + 1)} of 24
          </span>
          ${isCompleted ? `
            <span class="inline-flex items-center gap-1 text-xs font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              ✓ Completed ${quizScore !== undefined ? `(${quizScore}%)` : ''}
            </span>
          ` : `
            <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              20-30 min study
            </span>
          `}
        </div>

        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-1">
          ${unit.title}
        </h2>
        ${unit.subtitle ? `
          <p class="text-base text-indigo-900 font-semibold mb-4">
            ${unit.subtitle}
          </p>
        ` : '<div class="mb-4"></div>'}
      </div>

      <!-- Responsive YouTube Video Embed Frame -->
      <div class="mb-6 rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-950">
        <div class="relative w-full aspect-video">
          <iframe 
            class="absolute top-0 left-0 w-full h-full"
            src="${unit.videoEmbedUrl}" 
            title="${escapeHtml(unit.videoTitle || unit.title)}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen>
          </iframe>
        </div>
        <div class="p-3 bg-slate-900 text-slate-300 text-xs flex items-center justify-between">
          <span class="truncate font-medium">📺 ${unit.videoTitle || 'Educational Video Lesson'}</span>
          <a href="${unit.videoEmbedUrl.replace('embed/', 'watch?v=').replace('www.youtube-nocookie.com', 'www.youtube.com')}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 underline font-bold shrink-0 ml-2">
            Open in YouTube ↗
          </a>
        </div>
      </div>

      <!-- Quick Action: Jump to Practice Quiz -->
      <div class="mb-6">
        <button 
          id="topStartQuizBtn" 
          class="w-full min-h-[52px] bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 active:scale-[0.98] text-white font-black text-lg rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
          <span>🎯 Start Practice Quiz (${unit.quiz.length} Questions)</span>
        </button>
      </div>

      <!-- 4 Structured Core Content Blocks -->
      <div class="space-y-6 mb-8">
        
        <!-- SECTION 1: Historical Background -->
        <article class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div class="flex items-center gap-2.5 mb-3">
            <div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-base">
              🏛️
            </div>
            <h3 class="text-xl font-bold text-indigo-950 tracking-tight">
              1. Historical Background
            </h3>
          </div>
          <div class="text-lg text-slate-800 leading-relaxed font-normal space-y-4">
            ${unit.content.background.split(/\n\n+/).map(p => `<p>${p.trim()}</p>`).join('')}
          </div>
        </article>

        <!-- SECTION 2: Primary Source Deep Dive -->
        <article class="bg-amber-50/70 rounded-3xl p-6 shadow-sm border border-amber-200/80">
          <div class="flex items-center gap-2.5 mb-3">
            <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base">
              📜
            </div>
            <h3 class="text-xl font-bold text-amber-950 tracking-tight">
              2. Primary Source Deep Dive
            </h3>
          </div>
          <blockquote class="italic text-slate-800 text-lg leading-relaxed border-l-4 border-amber-400 pl-4 my-3 bg-white/70 p-4 rounded-r-2xl shadow-inner font-serif">
            "${unit.content.primarySource}"
          </blockquote>
          <p class="text-xs text-amber-900 font-semibold tracking-wide uppercase mt-2">
            💡 Historical Critical Thinking: Authentic contemporary account from the historical era.
          </p>
        </article>

        <!-- SECTION 3: Technical & Cultural Focus -->
        <article class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div class="flex items-center gap-2.5 mb-3">
            <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base">
              ⚙️
            </div>
            <h3 class="text-xl font-bold text-indigo-950 tracking-tight">
              3. Technical & Cultural Focus
            </h3>
          </div>
          <div class="text-lg text-slate-800 leading-relaxed font-normal bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100">
            <p>${unit.content.focus}</p>
          </div>
        </article>

        <!-- SECTION 4: Imagery & Geographic Index -->
        <article class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div class="flex items-center gap-2.5 mb-3">
            <div class="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-base">
              🗺️
            </div>
            <h3 class="text-xl font-bold text-indigo-950 tracking-tight">
              4. Imagery & Geographic Index
            </h3>
          </div>
          <div class="text-slate-800 text-base leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono text-sm">
            ${unit.content.graphicDescription}
          </div>
        </article>
      </div>

      <!-- Bottom Quiz CTA & Navigation Bar -->
      <div class="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-slate-200 space-y-3">
        <button 
          id="bottomStartQuizBtn" 
          class="w-full min-h-[52px] bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-black text-lg rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
          <span>🎯 Start Practice Quiz (${unit.quiz.length} Questions)</span>
        </button>

        <div class="flex items-center justify-between gap-3 pt-1">
          ${prevCoords ? `
            <button 
              id="prevUnitBtn"
              class="flex-1 min-h-[48px] px-3 py-2 border-2 border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 font-bold text-sm active:scale-98 transition-all flex items-center justify-center gap-1 truncate">
              ← Prev Unit
            </button>
          ` : `
            <div class="flex-1"></div>
          `}

          <button 
            id="backToHubBtn"
            class="min-h-[48px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl active:scale-98 transition-all">
            Hub
          </button>

          ${nextCoords ? `
            <button 
              id="nextUnitBtn"
              class="flex-1 min-h-[48px] px-3 py-2 border-2 border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 font-bold text-sm active:scale-98 transition-all flex items-center justify-center gap-1 truncate">
              Next Unit →
            </button>
          ` : `
            <div class="flex-1"></div>
          `}
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach unit listeners
    const startQuizHandler = () => {
      navigateTo("quiz", appState.currentModuleIndex, appState.currentUnitIndex);
    };

    const topQuizBtn = document.getElementById("topStartQuizBtn");
    if (topQuizBtn) topQuizBtn.addEventListener("click", startQuizHandler);

    const bottomQuizBtn = document.getElementById("bottomStartQuizBtn");
    if (bottomQuizBtn) bottomQuizBtn.addEventListener("click", startQuizHandler);

    const prevBtn = document.getElementById("prevUnitBtn");
    if (prevBtn && prevCoords) {
      prevBtn.addEventListener("click", () => {
        navigateTo("unit", prevCoords.modIdx, prevCoords.unitIdx);
      });
    }

    const nextBtn = document.getElementById("nextUnitBtn");
    if (nextBtn && nextCoords) {
      nextBtn.addEventListener("click", () => {
        navigateTo("unit", nextCoords.modIdx, nextCoords.unitIdx);
      });
    }

    const hubBtn = document.getElementById("backToHubBtn");
    if (hubBtn) {
      hubBtn.addEventListener("click", () => {
        navigateTo("dashboard");
      });
    }
  }

  // ==========================================
  // 3. QUIZ MODAL / VIEW
  // ==========================================
  function renderQuizView(container) {
    const module = CURRICULUM_DATA[appState.currentModuleIndex];
    const unit = module.units[appState.currentUnitIndex];
    const questions = unit.quiz;
    const currentQIndex = appState.activeQuizQuestionIndex;

    // If quiz is completed, show summary screen
    if (currentQIndex >= questions.length) {
      renderQuizResults(container, unit, questions);
      return;
    }

    const currentQuestion = questions[currentQIndex];
    const totalQ = questions.length;
    const isAnswered = appState.quizAnswerSubmitted;
    const selectedIdx = appState.quizSelectedAnswer;

    let html = `
      <div class="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
        <!-- Progress Counter -->
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
            Question ${currentQIndex + 1} of ${totalQ}
          </span>
          <span class="text-xs font-bold text-slate-500">
            ${unit.unitId} • Practice Mode
          </span>
        </div>

        <!-- Question Step Progress Bar -->
        <div class="w-full bg-slate-100 rounded-full h-2 mb-6">
          <div class="bg-indigo-600 h-2 rounded-full transition-all duration-300" style="width: ${((currentQIndex + (isAnswered ? 1 : 0.5)) / totalQ) * 100}%"></div>
        </div>

        <!-- Question Prompt -->
        <h3 class="text-xl font-bold text-slate-900 leading-snug mb-6">
          ${currentQuestion.questionText}
        </h3>

        <!-- 4 Multiple Choice Options (Touch targets >= 48px) -->
        <div class="space-y-3.5 mb-6" id="quizOptionsList">
    `;

    currentQuestion.options.forEach((optText, optIdx) => {
      let optionStyles = "bg-white border-2 border-slate-200 text-slate-800 hover:border-indigo-300";
      let icon = `<span class="w-7 h-7 rounded-xl border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-600 shrink-0">${String.fromCharCode(65 + optIdx)}</span>`;

      if (isAnswered) {
        if (optIdx === currentQuestion.correctIndex) {
          optionStyles = "bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold shadow-sm";
          icon = `<span class="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0">✓</span>`;
        } else if (optIdx === selectedIdx) {
          optionStyles = "bg-rose-50 border-2 border-rose-500 text-rose-950 font-bold shadow-sm";
          icon = `<span class="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-xs shrink-0">✕</span>`;
        } else {
          optionStyles = "bg-slate-50 border border-slate-200 text-slate-400 opacity-60";
        }
      }

      html += `
        <button 
          data-opt-idx="${optIdx}" 
          ${isAnswered ? "disabled" : ""}
          class="quiz-option-btn w-full p-4 rounded-2xl text-left font-medium active:scale-98 transition-all min-h-[48px] flex items-center gap-3 ${optionStyles}">
          ${icon}
          <span class="text-base leading-snug flex-1">${optText}</span>
        </button>
      `;
    });

    html += `
        </div>
    `;

    // If answered, reveal explanation card and Next button
    if (isAnswered) {
      const isCorrect = selectedIdx === currentQuestion.correctIndex;
      html += `
        <div class="p-5 rounded-2xl mb-6 transition-all border ${
          isCorrect ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-amber-50/80 border-amber-200 text-amber-900'
        }">
          <div class="flex items-center gap-2 font-black text-sm mb-1">
            <span>${isCorrect ? '🌟 Brilliant! Correct Answer!' : '📖 Review Explanation:'}</span>
          </div>
          <p class="text-sm leading-relaxed">${currentQuestion.explanation}</p>
        </div>

        <button 
          id="quizNextQuestionBtn" 
          class="w-full min-h-[50px] bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
          <span>${currentQIndex + 1 < totalQ ? 'Next Question →' : 'See Results 🏆'}</span>
        </button>
      `;
    }

    html += `
      </div>
    `;

    container.innerHTML = html;

    // Option click listeners
    if (!isAnswered) {
      container.querySelectorAll(".quiz-option-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const pickedIdx = parseInt(btn.getAttribute("data-opt-idx"), 10);
          appState.quizSelectedAnswer = pickedIdx;
          appState.quizAnswerSubmitted = true;

          const isRight = pickedIdx === currentQuestion.correctIndex;
          if (isRight) {
            appState.quizCorrectAnswersCount++;
            SoundFX.correct();
          } else {
            SoundFX.incorrect();
          }

          saveAppStateToLocalStorage();
          renderQuizView(container);
        });
      });
    } else {
      const nextBtn = document.getElementById("quizNextQuestionBtn");
      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          appState.activeQuizQuestionIndex++;
          appState.quizSelectedAnswer = null;
          appState.quizAnswerSubmitted = false;
          saveAppStateToLocalStorage();
          renderQuizView(container);
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }
    }
  }

  // ==========================================
  // QUIZ RESULTS VIEW
  // ==========================================
  function renderQuizResults(container, unit, questions) {
    const totalQ = questions.length;
    const correctCount = appState.quizCorrectAnswersCount;
    const scorePercent = Math.round((correctCount / totalQ) * 100);

    // Save completion state
    if (!appState.appSessionState.completedUnits.includes(unit.unitId)) {
      appState.appSessionState.completedUnits.push(unit.unitId);
    }

    // Save high score
    const prevScore = appState.appSessionState.quizHighScores[unit.unitId] || 0;
    appState.appSessionState.quizHighScores[unit.unitId] = Math.max(scorePercent, prevScore);
    saveAppStateToLocalStorage();

    // Sound and confetti if 100% or high score
    if (scorePercent === 100) {
      SoundFX.complete();
      fireConfetti();
    } else if (scorePercent >= 50) {
      SoundFX.correct();
    }

    // Determine Next Unit
    const currentMod = CURRICULUM_DATA[appState.currentModuleIndex];
    let nextCoords = null;
    if (appState.currentUnitIndex < currentMod.units.length - 1) {
      nextCoords = { modIdx: appState.currentModuleIndex, unitIdx: appState.currentUnitIndex + 1 };
    } else if (appState.currentModuleIndex < CURRICULUM_DATA.length - 1) {
      nextCoords = { modIdx: appState.currentModuleIndex + 1, unitIdx: 0 };
    }

    let badge = "🌟 Master Historian!";
    let message = "Outstanding! You demonstrated comprehensive mastery of this historical unit.";
    if (scorePercent < 100 && scorePercent >= 50) {
      badge = "📜 Scholar Pass!";
      message = "Well done! You have a solid grasp of the core historical concepts.";
    } else if (scorePercent < 50) {
      badge = "🛡️ Keep Practicing!";
      message = "You can retake this quiz anytime to boost your score to 100%!";
    }

    let html = `
      <div class="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 text-center">
        <div class="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-inner ${
          scorePercent >= 80 ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'
        }">
          ${scorePercent === 100 ? '👑' : scorePercent >= 50 ? '🏅' : '📚'}
        </div>

        <span class="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
          Quiz Completed
        </span>

        <h3 class="text-2xl font-extrabold text-slate-900 mt-2 mb-1">
          ${badge}
        </h3>
        <p class="text-sm text-slate-600 max-w-sm mx-auto mb-6">
          ${message}
        </p>

        <!-- Score Card -->
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 max-w-xs mx-auto">
          <div class="text-4xl font-black ${scorePercent >= 80 ? 'text-emerald-600' : 'text-indigo-600'}">
            ${scorePercent}%
          </div>
          <div class="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
            ${correctCount} of ${totalQ} Correct Answers
          </div>
        </div>

        <!-- Action Buttons (Touch targets >= 48px) -->
        <div class="space-y-3">
          ${nextCoords ? `
            <button 
              id="quizNextUnitBtn" 
              class="w-full min-h-[50px] bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
              <span>Next Unit: ${CURRICULUM_DATA[nextCoords.modIdx].units[nextCoords.unitIdx].title.split(':')[0]} →</span>
            </button>
          ` : `
            <div class="p-3 bg-emerald-50 text-emerald-800 rounded-2xl font-bold text-sm">
              🏆 You have completed all units in the curriculum!
            </div>
          `}

          <div class="flex items-center gap-3">
            <button 
              id="retakeQuizBtn" 
              class="flex-1 min-h-[48px] border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl active:scale-98 transition-all">
              🔄 Retake Quiz
            </button>

            <button 
              id="quizReturnUnitBtn" 
              class="flex-1 min-h-[48px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl active:scale-98 transition-all">
              Unit Text
            </button>
          </div>

          <button 
            id="quizReturnHubBtn" 
            class="w-full min-h-[48px] text-slate-600 hover:text-slate-900 font-bold text-sm py-2">
            Return to Dashboard Hub
          </button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    const nextUnitBtn = document.getElementById("quizNextUnitBtn");
    if (nextUnitBtn && nextCoords) {
      nextUnitBtn.addEventListener("click", () => {
        navigateTo("unit", nextCoords.modIdx, nextCoords.unitIdx);
      });
    }

    const retakeBtn = document.getElementById("retakeQuizBtn");
    if (retakeBtn) {
      retakeBtn.addEventListener("click", () => {
        navigateTo("quiz", appState.currentModuleIndex, appState.currentUnitIndex);
      });
    }

    const returnUnitBtn = document.getElementById("quizReturnUnitBtn");
    if (returnUnitBtn) {
      returnUnitBtn.addEventListener("click", () => {
        navigateTo("unit", appState.currentModuleIndex, appState.currentUnitIndex);
      });
    }

    const returnHubBtn = document.getElementById("quizReturnHubBtn");
    if (returnHubBtn) {
      returnHubBtn.addEventListener("click", () => {
        navigateTo("dashboard");
      });
    }
  }

  // ==========================================
  // XSS Escaper
  // ==========================================
  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Expose global init
  window.initAppEngine = initAppEngine;
  window.navigateTo = navigateTo;

  // Auto initialize on DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAppEngine);
  } else {
    initAppEngine();
  }
})();
