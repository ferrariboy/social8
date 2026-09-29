/**
 * BC Grade 8 Social Studies Discovery Portal - Core Application Logic
 * File: app.js
 * Responsive Desktop & Mobile Single Page Application (SPA) Engine
 * Aligned with the British Columbia Social Studies 8 Curriculum (c. 600 CE - 1750 CE)
 */

// ==========================================
// 1. Global State Management
// ==========================================
let appState = {
  activeView: "dashboard", // 'dashboard' | 'unit' | 'quiz'
  currentModuleIndex: 0,
  currentUnitIndex: 0,
  activeQuizQuestionIndex: 0,
  quizCorrectAnswersCount: 0,
  quizSelectedAnswer: null,
  quizAnswerSubmitted: false,
  activeModuleFilter: "all", // 'all' | 'europe' | 'asia' | 'americas' | 'contact'
  appSessionState: {
    completedUnits: [],
    quizHighScores: {}
  }
};

if (typeof window !== "undefined") {
  window.appState = appState;
}

const STORAGE_KEY = "BC_Socials8_Session";

// ==========================================
// 2. Session Continuity & LocalStorage
// ==========================================

/**
 * Hydrates application state from localStorage on startup.
 */
function hydrateAppState() {
  try {
    if (typeof localStorage === "undefined") return;
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      const parsed = JSON.parse(rawData);
      if (parsed && typeof parsed === "object") {
        if (parsed.activeView) appState.activeView = parsed.activeView;
        if (typeof parsed.currentModuleIndex === "number") appState.currentModuleIndex = parsed.currentModuleIndex;
        if (typeof parsed.currentUnitIndex === "number") appState.currentUnitIndex = parsed.currentUnitIndex;
        if (typeof parsed.activeQuizQuestionIndex === "number") appState.activeQuizQuestionIndex = parsed.activeQuizQuestionIndex;
        if (typeof parsed.quizCorrectAnswersCount === "number") appState.quizCorrectAnswersCount = parsed.quizCorrectAnswersCount;

        if (parsed.appSessionState && typeof parsed.appSessionState === "object") {
          if (Array.isArray(parsed.appSessionState.completedUnits)) {
            appState.appSessionState.completedUnits = parsed.appSessionState.completedUnits;
          }
          if (parsed.appSessionState.quizHighScores && typeof parsed.appSessionState.quizHighScores === "object") {
            appState.appSessionState.quizHighScores = parsed.appSessionState.quizHighScores;
          }
        }
      }
    }
  } catch (err) {
    console.warn("Session hydration failed; using default state:", err);
  }
}

/**
 * Serializes current appState to localStorage.
 */
function saveAppState() {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (err) {
    console.warn("Failed to serialize state to localStorage:", err);
  }
}

/**
 * Marks a unit complete and saves state.
 */
function markUnitComplete(unitId, scorePercent) {
  if (!appState.appSessionState.completedUnits.includes(unitId)) {
    appState.appSessionState.completedUnits.push(unitId);
  }
  if (typeof scorePercent === "number") {
    const currentHigh = appState.appSessionState.quizHighScores[unitId] || 0;
    appState.appSessionState.quizHighScores[unitId] = Math.max(currentHigh, scorePercent);
  }
  saveAppState();
  updateGlobalHeaderProgress();
  if (typeof document !== "undefined") {
    renderDrawerModulesList();
  }
}

/**
 * Toggles completion status manually.
 */
function toggleUnitCompletion(unitId) {
  const list = appState.appSessionState.completedUnits;
  const idx = list.indexOf(unitId);
  if (idx > -1) {
    list.splice(idx, 1);
  } else {
    list.push(unitId);
  }
  saveAppState();
  updateGlobalHeaderProgress();
  renderCurrentView();
  renderDrawerModulesList();
}

// ==========================================
// 3. Routing & State Shift Handler
// ==========================================

/**
 * Navigates to a new view and triggers dynamic rendering.
 */
function navigateTo(viewName, modIdx, unitIdx) {
  appState.activeView = viewName;

  if (typeof modIdx === "number") {
    appState.currentModuleIndex = Math.max(0, Math.min(modIdx, (window.CURRICULUM_DATA || []).length - 1));
  }
  if (typeof unitIdx === "number") {
    const currentMod = (window.CURRICULUM_DATA || [])[appState.currentModuleIndex];
    const maxUnits = currentMod && currentMod.units ? currentMod.units.length - 1 : 0;
    appState.currentUnitIndex = Math.max(0, Math.min(unitIdx, maxUnits));
  }

  // Reset quiz progress when entering quiz
  if (viewName === "quiz") {
    appState.activeQuizQuestionIndex = 0;
    appState.quizCorrectAnswersCount = 0;
    appState.quizSelectedAnswer = null;
    appState.quizAnswerSubmitted = false;
  }

  saveAppState();
  closeCurriculumDrawer();
  renderCurrentView();

  if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/**
 * Master dispatcher rendering the view designated by appState.activeView.
 */
function renderCurrentView() {
  if (typeof document === "undefined") return;
  const container = document.getElementById("viewDisplayEngine");
  const backBtn = document.getElementById("globalBackBtn");
  const viewTitle = document.getElementById("headerViewTitle");

  if (!container) return;

  updateGlobalHeaderProgress();

  if (appState.activeView === "dashboard") {
    if (viewTitle) viewTitle.innerText = "Dashboard Hub";
    if (backBtn) {
      backBtn.style.display = "none";
    }
    renderDashboard();
  } else if (appState.activeView === "unit") {
    const curriculum = window.CURRICULUM_DATA || [];
    const module = curriculum[appState.currentModuleIndex];
    const unit = module && module.units ? module.units[appState.currentUnitIndex] : null;
    if (viewTitle) viewTitle.innerText = unit ? unit.title : "Lesson View";
    if (backBtn) {
      backBtn.style.display = "inline-flex";
      backBtn.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
        </svg>
        <span>Dashboard</span>
      `;
      backBtn.onclick = () => navigateTo("dashboard");
    }
    renderUnitView();
  } else if (appState.activeView === "quiz") {
    if (viewTitle) viewTitle.innerText = "Practice Quiz";
    if (backBtn) {
      backBtn.style.display = "inline-flex";
      backBtn.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        <span>Exit Quiz</span>
      `;
      backBtn.onclick = () => navigateTo("unit", appState.currentModuleIndex, appState.currentUnitIndex);
    }
    renderQuizView();
  }
}

/**
 * Updates the header progress badge percentage.
 */
function updateGlobalHeaderProgress() {
  if (typeof document === "undefined") return;
  const progressText = document.getElementById("globalProgressText");
  const drawerSummary = document.getElementById("drawerProgressSummary");

  const curriculum = window.CURRICULUM_DATA || [];
  let totalUnits = 0;
  curriculum.forEach(m => {
    if (m.units) totalUnits += m.units.length;
  });

  const completed = (appState.appSessionState.completedUnits || []).length;
  const percent = totalUnits > 0 ? Math.round((completed / totalUnits) * 100) : 0;

  if (progressText) {
    progressText.innerText = `${percent}% Done (${completed}/${totalUnits})`;
  }
  if (drawerSummary) {
    drawerSummary.innerText = `${completed} of ${totalUnits} Units Completed (${percent}%)`;
  }
}

// ==========================================
// 4. Slide-over Curriculum Navigation Drawer
// ==========================================

function openCurriculumDrawer() {
  if (typeof document === "undefined") return;
  document.body.classList.add("drawer-open");
  const drawer = document.getElementById("curriculumDrawer");
  if (drawer) drawer.setAttribute("aria-hidden", "false");
  renderDrawerModulesList();
}

function closeCurriculumDrawer() {
  if (typeof document === "undefined") return;
  document.body.classList.remove("drawer-open");
  const drawer = document.getElementById("curriculumDrawer");
  if (drawer) drawer.setAttribute("aria-hidden", "true");
}

function renderDrawerModulesList(filterText = "") {
  const container = document.getElementById("drawerModulesList");
  if (!container) return;

  const curriculum = window.CURRICULUM_DATA || [];
  const completedList = appState.appSessionState.completedUnits || [];
  const query = filterText.toLowerCase().trim();

  let html = "";

  curriculum.forEach((mod, modIdx) => {
    const modUnits = mod.units || [];
    const filteredUnits = modUnits.filter(u => {
      if (!query) return true;
      return (
        u.title.toLowerCase().includes(query) ||
        u.unitId.toLowerCase().includes(query) ||
        mod.moduleTitle.toLowerCase().includes(query) ||
        u.content.background.toLowerCase().includes(query)
      );
    });

    if (filteredUnits.length === 0) return;

    const completedInMod = modUnits.filter(u => completedList.includes(u.unitId)).length;
    const isModComplete = completedInMod === modUnits.length && modUnits.length > 0;

    html += `
      <div class="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-3.5">
        <div class="flex items-center justify-between gap-2 mb-2">
          <div class="text-xs font-black uppercase tracking-wider text-indigo-400">
            Module ${modIdx + 1}
          </div>
          <span class="text-[11px] font-bold px-2 py-0.5 rounded-full ${
            isModComplete ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-slate-700 text-slate-300'
          }">
            ${completedInMod}/${modUnits.length} Done
          </span>
        </div>
        <div class="text-sm font-bold text-white mb-2 leading-snug">
          ${mod.moduleTitle.replace(/^Module \d+:\s*/, '')}
        </div>
        <div class="space-y-1.5 pt-1 border-t border-slate-700/60">
    `;

    filteredUnits.forEach(unit => {
      const realUnitIdx = modUnits.findIndex(u => u.unitId === unit.unitId);
      const isComplete = completedList.includes(unit.unitId);
      const isCurrent = appState.activeView === "unit" && appState.currentModuleIndex === modIdx && appState.currentUnitIndex === realUnitIdx;
      const score = appState.appSessionState.quizHighScores[unit.unitId];

      html += `
        <button 
          data-mod-idx="${modIdx}" 
          data-unit-idx="${realUnitIdx}"
          class="drawer-unit-jump-btn w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between gap-2 transition-all active-scale ${
            isCurrent 
              ? 'bg-indigo-600 text-white font-bold shadow-md' 
              : isComplete 
                ? 'bg-slate-800/50 hover:bg-slate-700/80 text-emerald-300' 
                : 'hover:bg-slate-700/60 text-slate-300'
          }">
          <div class="flex items-center gap-2 truncate">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
              isComplete ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-400'
            }">
              ${isComplete ? '✓' : (realUnitIdx + 1)}
            </span>
            <span class="truncate">${unit.title}</span>
          </div>
          ${typeof score === "number" ? `
            <span class="shrink-0 text-[10px] font-black px-1.5 py-0.5 rounded ${
              score >= 80 ? 'bg-emerald-900 text-emerald-200' : 'bg-slate-700 text-indigo-300'
            }">${score}%</span>
          ` : ''}
        </button>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  if (!html) {
    html = `
      <div class="text-center py-8 text-slate-400 text-sm">
        No units match your search query.
      </div>
    `;
  }

  container.innerHTML = html;

  container.querySelectorAll(".drawer-unit-jump-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const mIdx = parseInt(btn.getAttribute("data-mod-idx"), 10);
      const uIdx = parseInt(btn.getAttribute("data-unit-idx"), 10);
      navigateTo("unit", mIdx, uIdx);
    });
  });
}

// ==========================================
// 5. Dashboard View Rendering (Desktop & Mobile)
// ==========================================

function getModuleCategory(modIdx) {
  if (modIdx === 0 || modIdx === 5) return "europe";
  if (modIdx === 1 || modIdx === 2 || modIdx === 3) return "asia";
  if (modIdx === 4) return "americas";
  return "contact";
}

/**
 * Renders the responsive desktop & mobile Dashboard Hub.
 */
function renderDashboard() {
  const container = document.getElementById("viewDisplayEngine");
  if (!container) return;

  const curriculum = window.CURRICULUM_DATA || [];
  const completedList = appState.appSessionState.completedUnits || [];

  // Resume target calculation
  const resumeModIdx = Math.max(0, Math.min(appState.currentModuleIndex, curriculum.length - 1));
  const resumeMod = curriculum[resumeModIdx];
  const resumeUnitIdx = Math.max(0, Math.min(appState.currentUnitIndex, (resumeMod && resumeMod.units ? resumeMod.units.length - 1 : 0)));
  const resumeUnit = resumeMod && resumeMod.units ? resumeMod.units[resumeUnitIdx] : null;

  let totalUnits = 0;
  let masteredCount = 0;
  curriculum.forEach(m => {
    (m.units || []).forEach(u => {
      totalUnits++;
      const s = appState.appSessionState.quizHighScores[u.unitId];
      if (typeof s === "number" && s >= 80) masteredCount++;
    });
  });

  const percent = totalUnits > 0 ? Math.round((completedList.length / totalUnits) * 100) : 0;

  let html = `
    <!-- Top Hero Section: Multi-Column on Desktop (8 cols + 4 cols) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      
      <!-- Left Hero Card: Overview & Metrics (8 cols) -->
      <div class="lg:col-span-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col justify-between">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="text-xs font-black uppercase tracking-wider text-indigo-300 bg-indigo-950/90 px-3 py-1 rounded-full border border-indigo-700/60">
              BC Curriculum • Grade 8 Social Studies
            </span>
            <span class="text-xs font-semibold text-slate-300">
              c. 600 CE - 1750 CE
            </span>
          </div>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-2">
            World Civilizations & Transformations
          </h2>
          <p class="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
            Investigate contact, conflict, cultural exchange, and technological revolution across Europe, Asia, Africa, and the Americas leading to the modern era.
          </p>
        </div>

        <!-- Curriculum Progress Bar -->
        <div class="pt-4 border-t border-slate-800">
          <div class="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
            <span>Overall Course Completion</span>
            <span class="text-emerald-400 font-black">${percent}% (${completedList.length} of ${totalUnits} Units)</span>
          </div>
          <div class="w-full bg-slate-800 rounded-full h-3 p-0.5 border border-slate-700 mb-4">
            <div class="bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 h-2 rounded-full transition-all duration-500 ease-out" style="width: ${percent}%;"></div>
          </div>

          <!-- 3 Stats Tiles -->
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 text-center">
              <div class="text-xl sm:text-2xl font-black text-white">${completedList.length}</div>
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Units Done</div>
            </div>
            <div class="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 text-center">
              <div class="text-xl sm:text-2xl font-black text-emerald-400">${masteredCount}</div>
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mastered (80%+)</div>
            </div>
            <div class="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 text-center">
              <div class="text-xl sm:text-2xl font-black text-indigo-300">8</div>
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Modules</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Hero Card: Resume Learning CTA (4 cols) -->
      <div class="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 shadow-md border border-slate-200 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              ⚡ Active Study Session
            </span>
            <span class="text-xs font-semibold text-slate-400">
              ${resumeUnit ? resumeUnit.unitId : "M1-U1"}
            </span>
          </div>

          <h3 class="text-xl font-black text-slate-900 tracking-tight mt-1 mb-2 leading-snug">
            ${resumeUnit ? resumeUnit.title : "Unit 1: The Fragmentation of Western Europe"}
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-6">
            ${resumeMod ? resumeMod.moduleTitle : "Module 1"}
          </p>
        </div>

        <div class="space-y-3 pt-4 border-t border-slate-100">
          <button 
            id="resumeLearningCtaBtn"
            class="w-full min-h-[52px] px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active-scale">
            <span>Continue Lesson</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
            </svg>
          </button>

          <button 
            id="openDrawerFromHeroBtn"
            class="w-full min-h-[44px] px-4 py-2 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 active-scale">
            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
            </svg>
            <span>Browse Full Curriculum Index</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Category Filter Bar on Desktop & Mobile -->
    <div class="flex items-center justify-between gap-4 mb-6 flex-wrap">
      <div class="flex items-center gap-2">
        <h3 class="text-xl font-black text-slate-900 tracking-tight">
          Curriculum Modules
        </h3>
        <span class="text-xs font-bold text-slate-500 bg-slate-200/80 px-2.5 py-0.5 rounded-full">8 Modules</span>
      </div>

      <!-- Quick Filter Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs font-bold" id="moduleFilterPills">
        <button data-filter="all" class="filter-pill px-3.5 py-1.5 rounded-full transition-all ${appState.activeModuleFilter === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}">All (8)</button>
        <button data-filter="europe" class="filter-pill px-3.5 py-1.5 rounded-full transition-all ${appState.activeModuleFilter === 'europe' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}">Europe</button>
        <button data-filter="asia" class="filter-pill px-3.5 py-1.5 rounded-full transition-all ${appState.activeModuleFilter === 'asia' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}">Asia & Islam</button>
        <button data-filter="americas" class="filter-pill px-3.5 py-1.5 rounded-full transition-all ${appState.activeModuleFilter === 'americas' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}">Americas & Africa</button>
        <button data-filter="contact" class="filter-pill px-3.5 py-1.5 rounded-full transition-all ${appState.activeModuleFilter === 'contact' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}">Contact & Canada</button>
      </div>
    </div>

    <!-- Responsive Multi-Column Module Grid: 2 columns on desktop, wide view -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="modulesCardsContainer">
  `;

  curriculum.forEach((module, modIdx) => {
    const category = getModuleCategory(modIdx);
    const isVisible = appState.activeModuleFilter === "all" || appState.activeModuleFilter === category;
    const modUnits = module.units || [];
    const completedCountInMod = modUnits.filter(u => completedList.includes(u.unitId)).length;
    const isModuleFinished = modUnits.length > 0 && completedCountInMod === modUnits.length;

    html += `
      <section 
        data-category="${category}"
        class="module-card bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between ${isVisible ? '' : 'hidden'}">
        <div>
          <!-- Module Card Header -->
          <div class="flex items-start justify-between gap-3 mb-4">
            <div>
              <span class="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                Module ${modIdx + 1}
              </span>
              <h4 class="text-lg font-black text-slate-900 tracking-tight mt-1 leading-snug">
                ${module.moduleTitle.replace(/^Module \d+:\s*/, '')}
              </h4>
            </div>
            <span class="shrink-0 text-xs font-black px-2.5 py-1 rounded-full ${
              isModuleFinished 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-slate-100 text-slate-600'
            }">
              ${completedCountInMod}/${modUnits.length} Done
            </span>
          </div>

          <!-- Stack of Individual Units -->
          <div class="space-y-2 border-t border-slate-100 pt-3">
    `;

    modUnits.forEach((unit, unitIdx) => {
      const isComplete = completedList.includes(unit.unitId);
      const score = appState.appSessionState.quizHighScores[unit.unitId];

      html += `
        <button 
          data-module-index="${modIdx}" 
          data-unit-index="${unitIdx}"
          class="unit-navigation-btn w-full min-h-[52px] text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 active-scale ${
            isComplete 
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 hover:bg-emerald-100/70' 
              : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300 hover:bg-indigo-50/30'
          }">
          <div class="flex items-center gap-3 truncate">
            <span class="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
              isComplete 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }">
              ${isComplete ? '✓' : (unitIdx + 1)}
            </span>
            <div class="truncate">
              <div class="font-bold text-sm tracking-tight truncate">
                ${unit.title}
              </div>
              <div class="text-[11px] text-slate-500 font-medium">
                ${unit.unitId} • 20-30 min study
              </div>
            </div>
          </div>

          <div class="shrink-0 flex items-center gap-2">
            ${typeof score === "number" ? `
              <span class="text-xs font-black px-2 py-0.5 rounded-md ${
                score >= 80 ? 'bg-emerald-200 text-emerald-900' : 'bg-indigo-100 text-indigo-900'
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
      </section>
    `;
  });

  html += `
    </div>
  `;

  container.innerHTML = html;

  // Event: Resume button
  const resumeBtn = document.getElementById("resumeLearningCtaBtn");
  if (resumeBtn) {
    resumeBtn.addEventListener("click", () => {
      navigateTo("unit", resumeModIdx, resumeUnitIdx);
    });
  }

  // Event: Open Drawer from Hero
  const openDrawerBtn = document.getElementById("openDrawerFromHeroBtn");
  if (openDrawerBtn) {
    openDrawerBtn.addEventListener("click", openCurriculumDrawer);
  }

  // Event: Filter Pills
  container.querySelectorAll(".filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const filter = pill.getAttribute("data-filter");
      appState.activeModuleFilter = filter;
      renderDashboard();
    });
  });

  // Event: Unit navigation buttons
  container.querySelectorAll(".unit-navigation-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const mIdx = parseInt(btn.getAttribute("data-module-index"), 10);
      const uIdx = parseInt(btn.getAttribute("data-unit-index"), 10);
      navigateTo("unit", mIdx, uIdx);
    });
  });
}

// ==========================================
// 6. Unit Core View Rendering (Desktop & Mobile)
// ==========================================

/**
 * Renders the responsive 2-column Unit View with sticky video & quiz sidebar.
 */
function renderUnitView() {
  const container = document.getElementById("viewDisplayEngine");
  if (!container) return;

  const curriculum = window.CURRICULUM_DATA || [];
  const module = curriculum[appState.currentModuleIndex];
  if (!module || !module.units) {
    navigateTo("dashboard");
    return;
  }

  const unit = module.units[appState.currentUnitIndex];
  if (!unit) {
    navigateTo("dashboard");
    return;
  }

  const isCompleted = appState.appSessionState.completedUnits.includes(unit.unitId);
  const score = appState.appSessionState.quizHighScores[unit.unitId];
  const bgParagraphs = (unit.content.background || "").split(/\n\n+/).filter(p => p.trim().length > 0);

  let html = `
    <!-- Breadcrumb Trail Navigation -->
    <nav aria-label="Breadcrumb" class="mb-4 text-xs font-bold text-slate-500 flex items-center gap-2 flex-wrap">
      <button id="breadcrumbHomeBtn" class="hover:text-indigo-600 transition-colors">
        Dashboard
      </button>
      <span>/</span>
      <span class="text-slate-600">Module ${appState.currentModuleIndex + 1}</span>
      <span>/</span>
      <span class="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">${unit.unitId}</span>
    </nav>

    <!-- Responsive Layout: 12 Columns on Desktop (8 cols main reading + 4 cols sticky sidebar) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- MAIN READING COLUMN (8 cols on desktop) -->
      <div class="lg:col-span-8 space-y-6">
        
        <!-- Unit Title Header Card -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div class="flex items-center gap-2">
              <span class="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
                ${unit.unitId} • Module ${appState.currentModuleIndex + 1}
              </span>
              <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                20-30 min study
              </span>
            </div>

            ${isCompleted ? `
              <span class="inline-flex items-center gap-1.5 text-xs font-black bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
                <span>✓ Completed</span>
                ${typeof score === "number" ? `<span>(${score}%)</span>` : ""}
              </span>
            ` : `
              <span class="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                In Progress
              </span>
            `}
          </div>

          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-2">
            ${unit.title}
          </h2>
          <p class="text-sm font-semibold text-slate-500">
            ${module.moduleTitle}
          </p>
        </div>

        <!-- Video Embed (Visible in main flow on mobile/tablet, hidden on desktop if shown in sidebar) -->
        <div class="block lg:hidden aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-950">
          <iframe 
            class="w-full h-full"
            src="${unit.videoEmbedUrl}" 
            title="${unit.title}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" 
            allowfullscreen>
          </iframe>
        </div>

        <!-- Sub-header 1: Historical Context -->
        <article id="sectionContext" class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div class="flex items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
            <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-base">🏛️</span>
              <span>1. Historical Context</span>
            </h3>
            <span class="text-xs font-bold text-slate-400">Systemic Analysis</span>
          </div>

          <div class="text-lg text-slate-800 leading-relaxed font-normal space-y-4 max-w-[70ch]">
            ${bgParagraphs.map(p => `<p>${p.trim()}</p>`).join("")}
          </div>
        </article>

        <!-- Sub-header 2: Primary Source Deep Dive -->
        <article id="sectionPrimarySource" class="bg-amber-50/80 border-l-4 border-amber-600 rounded-r-3xl p-6 sm:p-8 shadow-sm border-y border-r border-amber-200/90">
          <div class="flex items-center justify-between gap-3 mb-4">
            <h3 class="text-xl sm:text-2xl font-black text-amber-950 tracking-tight flex items-center gap-2.5">
              <span class="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-base">📜</span>
              <span>2. Primary Source Deep Dive</span>
            </h3>
            <span class="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-200/70 px-2.5 py-1 rounded-md">
              Historical Evidence
            </span>
          </div>

          <blockquote class="italic text-slate-800 text-lg leading-relaxed font-serif bg-white/80 p-5 rounded-2xl shadow-inner border border-amber-200/60 my-2">
            "${unit.content.primarySource}"
          </blockquote>
        </article>

        <!-- Sub-header 3: Specialized Focus -->
        <article id="sectionSpecializedFocus" class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div class="flex items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-4">
            <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-base">⚙️</span>
              <span>3. Specialized Focus</span>
            </h3>
            <span class="text-xs font-bold text-slate-400">Technological & Cultural Mechanic</span>
          </div>

          <div class="text-lg text-slate-800 leading-relaxed font-normal bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <p>${unit.content.focus}</p>
          </div>
        </article>

        <!-- Sub-header 4: Artifact & Map Reference Index -->
        <article id="sectionArtifactMap" class="bg-slate-900 text-slate-100 rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800">
          <div class="flex items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-4">
            <h3 class="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span class="w-8 h-8 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center text-base">🗺️</span>
              <span>4. Artifact & Map Reference Index</span>
            </h3>
            <span class="text-xs font-mono text-indigo-400 uppercase tracking-wider">Visual Anchor</span>
          </div>

          <div class="text-sm sm:text-base text-slate-200 leading-relaxed font-mono bg-slate-950 p-5 rounded-2xl border border-slate-800">
            ${unit.content.graphicDescription}
          </div>
        </article>

        <!-- Bottom Pagination Controls -->
        <div class="flex items-center justify-between gap-3 pt-4 pb-8">
          <button 
            id="unitNavPrevBtn" 
            class="min-h-[48px] px-4 py-2.5 border-2 border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 font-bold text-sm active-scale transition-all flex items-center gap-1.5">
            <span>← Previous Unit</span>
          </button>

          <button 
            id="unitNavHubBtn" 
            class="min-h-[48px] px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm rounded-2xl active-scale transition-all">
            Dashboard Hub
          </button>

          <button 
            id="unitNavNextBtn" 
            class="min-h-[48px] px-4 py-2.5 border-2 border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 font-bold text-sm active-scale transition-all flex items-center gap-1.5">
            <span>Next Unit →</span>
          </button>
        </div>
      </div>

      <!-- DESKTOP STICKY SIDEBAR (4 cols on desktop) -->
      <div class="lg:col-span-4 space-y-6 lg:sticky lg:top-20 self-start">
        
        <!-- Video Companion Player (Desktop view) -->
        <div class="hidden lg:block bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
              Video Companion
            </span>
            <a 
              href="${unit.videoEmbedUrl.replace('/embed/', '/watch?v=')}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="text-xs text-slate-400 hover:text-indigo-600 font-semibold flex items-center gap-1">
              <span>Open in YT</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
              </svg>
            </a>
          </div>

          <div class="aspect-video rounded-2xl overflow-hidden shadow border border-slate-200 bg-slate-950 mb-3">
            <iframe 
              class="w-full h-full"
              src="${unit.videoEmbedUrl}" 
              title="${unit.title}" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerpolicy="strict-origin-when-cross-origin" 
              allowfullscreen>
            </iframe>
          </div>
          <p class="text-[11px] text-slate-500 leading-tight">
            Curriculum video companion selected for ${unit.title}.
          </p>
        </div>

        <!-- Practice Quiz Action Card -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Evaluation
            </span>
            ${typeof score === "number" ? `
              <span class="text-xs font-black px-2.5 py-0.5 rounded-full ${
                score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-900'
              }">
                High Score: ${score}%
              </span>
            ` : ''}
          </div>

          <h4 class="text-lg font-black text-slate-900 mb-1 leading-snug">
            Unit Practice Quiz
          </h4>
          <p class="text-xs text-slate-600 mb-5">
            Test your understanding of historical shifts, primary sources, and specialized concepts.
          </p>

          <button 
            id="launchUnitPracticeQuizBtn"
            class="w-full min-h-[50px] bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black py-3.5 px-5 rounded-2xl shadow-md active-scale transition-all flex items-center justify-center gap-2 text-sm sm:text-base mb-3">
            <span>Launch Practice Quiz →</span>
          </button>

          <button 
            id="toggleCompleteStatusBtn"
            class="w-full min-h-[44px] px-4 py-2 border-2 ${
              isCompleted 
                ? 'border-emerald-500 bg-emerald-50 text-emerald-900 hover:bg-emerald-100' 
                : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
            } font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 active-scale">
            <span>${isCompleted ? '✓ Marked as Completed' : '○ Mark as Completed'}</span>
          </button>
        </div>

        <!-- In This Unit: Table of Contents Anchor Links -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hidden lg:block">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
            On This Page
          </h4>
          <ul class="space-y-2 text-sm font-bold text-slate-600">
            <li>
              <a href="#sectionContext" class="hover:text-indigo-600 transition-colors flex items-center gap-2 py-1">
                <span>🏛️</span>
                <span>Historical Context</span>
              </a>
            </li>
            <li>
              <a href="#sectionPrimarySource" class="hover:text-indigo-600 transition-colors flex items-center gap-2 py-1">
                <span>📜</span>
                <span>Primary Source Deep Dive</span>
              </a>
            </li>
            <li>
              <a href="#sectionSpecializedFocus" class="hover:text-indigo-600 transition-colors flex items-center gap-2 py-1">
                <span>⚙️</span>
                <span>Specialized Focus</span>
              </a>
            </li>
            <li>
              <a href="#sectionArtifactMap" class="hover:text-indigo-600 transition-colors flex items-center gap-2 py-1">
                <span>🗺️</span>
                <span>Artifact & Map Index</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Event: Breadcrumb Home
  const breadcrumbHome = document.getElementById("breadcrumbHomeBtn");
  if (breadcrumbHome) {
    breadcrumbHome.addEventListener("click", () => navigateTo("dashboard"));
  }

  // Event: Quiz CTA button
  const quizBtn = document.getElementById("launchUnitPracticeQuizBtn");
  if (quizBtn) {
    quizBtn.addEventListener("click", () => {
      navigateTo("quiz", appState.currentModuleIndex, appState.currentUnitIndex);
    });
  }

  // Event: Toggle Complete Status button
  const toggleBtn = document.getElementById("toggleCompleteStatusBtn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      toggleUnitCompletion(unit.unitId);
    });
  }

  // Event: Hub button
  const hubBtn = document.getElementById("unitNavHubBtn");
  if (hubBtn) {
    hubBtn.addEventListener("click", () => navigateTo("dashboard"));
  }

  // Event: Prev Unit
  const prevBtn = document.getElementById("unitNavPrevBtn");
  if (prevBtn) {
    if (appState.currentUnitIndex > 0) {
      prevBtn.onclick = () => navigateTo("unit", appState.currentModuleIndex, appState.currentUnitIndex - 1);
    } else if (appState.currentModuleIndex > 0) {
      const prevMod = curriculum[appState.currentModuleIndex - 1];
      prevBtn.onclick = () => navigateTo("unit", appState.currentModuleIndex - 1, (prevMod.units || []).length - 1);
    } else {
      prevBtn.disabled = true;
      prevBtn.classList.add("opacity-40", "cursor-not-allowed");
    }
  }

  // Event: Next Unit
  const nextBtn = document.getElementById("unitNavNextBtn");
  if (nextBtn) {
    if (appState.currentUnitIndex < (module.units || []).length - 1) {
      nextBtn.onclick = () => navigateTo("unit", appState.currentModuleIndex, appState.currentUnitIndex + 1);
    } else if (appState.currentModuleIndex < curriculum.length - 1) {
      nextBtn.onclick = () => navigateTo("unit", appState.currentModuleIndex + 1, 0);
    } else {
      nextBtn.disabled = true;
      nextBtn.classList.add("opacity-40", "cursor-not-allowed");
    }
  }
}

// ==========================================
// 7. Practice Quiz View Rendering
// ==========================================

/**
 * Renders the distraction-free interactive Practice Quiz view.
 */
function renderQuizView() {
  const container = document.getElementById("viewDisplayEngine");
  if (!container) return;

  const curriculum = window.CURRICULUM_DATA || [];
  const module = curriculum[appState.currentModuleIndex];
  const unit = module && module.units ? module.units[appState.currentUnitIndex] : null;

  if (!unit || !unit.quiz || unit.quiz.length === 0) {
    navigateTo("unit", appState.currentModuleIndex, appState.currentUnitIndex);
    return;
  }

  const questions = unit.quiz;
  const qIdx = appState.activeQuizQuestionIndex;

  if (qIdx >= questions.length) {
    renderQuizResults(container, unit, questions);
    return;
  }

  const currentQ = questions[qIdx];
  const isAnswered = appState.quizAnswerSubmitted;
  const selectedIdx = appState.quizSelectedAnswer;
  const totalQ = questions.length;
  const isLastQuestion = qIdx + 1 >= totalQ;

  let html = `
    <!-- Distraction-Free Evaluation Container -->
    <div class="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200">
      
      <!-- Progress Bar & Indicator -->
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Question ${qIdx + 1} of ${totalQ}
        </span>
        <span class="text-xs font-bold text-slate-500">
          ${unit.unitId} • Practice Quiz
        </span>
      </div>

      <div class="w-full bg-slate-100 rounded-full h-2.5 mb-6">
        <div class="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style="width: ${((qIdx + (isAnswered ? 1 : 0.5)) / totalQ) * 100}%;"></div>
      </div>

      <!-- Question Statement inside bold, large typography -->
      <h3 class="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight mb-6">
        ${currentQ.questionText}
      </h3>

      <!-- Four large, full-width touch blocks -->
      <div class="space-y-3 mb-6" id="quizChoicesList">
  `;

  currentQ.options.forEach((optText, optIdx) => {
    let styles = "bg-white border-slate-200 text-slate-800 hover:border-indigo-300 hover:bg-slate-50";
    let icon = `<span class="w-8 h-8 rounded-xl border border-slate-300 flex items-center justify-center font-black text-xs text-slate-600 shrink-0">${String.fromCharCode(65 + optIdx)}</span>`;

    if (isAnswered) {
      if (optIdx === currentQ.correctIndex) {
        styles = "bg-emerald-100 border-emerald-500 text-emerald-950 font-bold shadow-sm";
        icon = `<span class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0">✓</span>`;
      } else if (optIdx === selectedIdx) {
        styles = "bg-rose-100 border-rose-500 text-rose-950 font-bold shadow-sm";
        icon = `<span class="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-xs shrink-0">✕</span>`;
      } else {
        styles = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
      }
    }

    html += `
      <button 
        data-option-index="${optIdx}"
        ${isAnswered ? "disabled" : ""}
        class="quiz-choice-btn w-full p-4 border-2 rounded-2xl text-left font-medium min-h-[52px] flex items-center gap-3 transition-all active-scale ${styles}">
        ${icon}
        <span class="text-base leading-snug flex-1">${optText}</span>
      </button>
    `;
  });

  html += `
      </div>
  `;

  // Analytical Explanation Box
  if (isAnswered) {
    const isCorrect = selectedIdx === currentQ.correctIndex;
    html += `
      <div class="p-6 rounded-2xl mb-6 transition-all border ${
        isCorrect 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
          : 'bg-amber-50 border-amber-200 text-amber-950'
      }">
        <div class="flex items-center gap-2 font-black text-sm mb-2">
          <span>${isCorrect ? '🌟 Correct! Analytical Explanation:' : '📖 Analytical Explanation:'}</span>
        </div>
        <p class="text-sm sm:text-base leading-relaxed">${currentQ.explanation}</p>
      </div>

      <!-- Large Next or Complete button -->
      <button 
        id="quizAdvanceActionBtn" 
        class="w-full min-h-[52px] px-5 py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active-scale">
        <span>${isLastQuestion ? 'Complete Quiz 🏆' : 'Next Question →'}</span>
      </button>
    `;
  }

  html += `
    </div>
  `;

  container.innerHTML = html;

  // Choice Selection Listener
  if (!isAnswered) {
    container.querySelectorAll(".quiz-choice-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        container.querySelectorAll(".quiz-choice-btn").forEach(b => {
          b.disabled = true;
          b.classList.add("pointer-events-none");
        });

        const picked = parseInt(btn.getAttribute("data-option-index"), 10);
        appState.quizSelectedAnswer = picked;
        appState.quizAnswerSubmitted = true;

        if (picked === currentQ.correctIndex) {
          appState.quizCorrectAnswersCount++;
        }

        saveAppState();
        renderQuizView();
      });
    });
  } else {
    const advanceBtn = document.getElementById("quizAdvanceActionBtn");
    if (advanceBtn) {
      advanceBtn.addEventListener("click", () => {
        appState.activeQuizQuestionIndex++;
        appState.quizSelectedAnswer = null;
        appState.quizAnswerSubmitted = false;
        saveAppState();
        renderQuizView();
      });
    }
  }
}

/**
 * Renders the Quiz completion results card.
 */
function renderQuizResults(container, unit, questions) {
  const total = questions.length;
  const correct = appState.quizCorrectAnswersCount;
  const scorePercent = total > 0 ? Math.round((correct / total) * 100) : 0;

  markUnitComplete(unit.unitId, scorePercent);

  const curriculum = window.CURRICULUM_DATA || [];
  const hasNextUnit = appState.currentUnitIndex < (curriculum[appState.currentModuleIndex].units || []).length - 1;
  const hasNextModule = appState.currentModuleIndex < curriculum.length - 1;

  let feedbackBadge = "🏆 Mastered";
  let feedbackMessage = "Outstanding mastery of the curriculum material and historical analysis!";
  if (scorePercent < 70) {
    feedbackBadge = "📚 Review Suggested";
    feedbackMessage = "Good attempt! Review the primary source and technical focus sections to reinforce key concepts.";
  } else if (scorePercent < 100) {
    feedbackBadge = "🎯 Proficient";
    feedbackMessage = "Solid understanding of the historical events and structural mechanisms!";
  }

  container.innerHTML = `
    <div class="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 text-center">
      <div class="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl mx-auto mb-4">
        ✓
      </div>

      <span class="inline-block text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-2">
        ${feedbackBadge}
      </span>

      <h2 class="text-3xl font-black text-slate-900 tracking-tight mb-2">
        Quiz Completed!
      </h2>
      <p class="text-slate-600 text-sm mb-6">
        ${unit.title}
      </p>

      <div class="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-100">
        <div class="text-4xl font-black text-indigo-600 mb-1">
          ${scorePercent}%
        </div>
        <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">
          ${correct} of ${total} Questions Correct
        </div>
        <p class="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200 leading-relaxed">
          ${feedbackMessage}
        </p>
      </div>

      <div class="space-y-3">
        ${hasNextUnit ? `
          <button 
            id="quizProceedNextUnitBtn"
            class="w-full min-h-[52px] px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active-scale">
            <span>Proceed to Next Unit →</span>
          </button>
        ` : hasNextModule ? `
          <button 
            id="quizProceedNextModuleBtn"
            class="w-full min-h-[52px] px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active-scale">
            <span>Proceed to Next Module →</span>
          </button>
        ` : ''}

        <button 
          id="quizRetakeBtn" 
          class="w-full min-h-[48px] px-4 py-2.5 border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl transition-all active-scale">
          Retake Practice Quiz
        </button>

        <button 
          id="quizReturnHubBtn" 
          class="w-full min-h-[48px] px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl transition-all active-scale">
          Return to Dashboard Hub
        </button>
      </div>
    </div>
  `;

  const nextUnitBtn = document.getElementById("quizProceedNextUnitBtn");
  if (nextUnitBtn) {
    nextUnitBtn.addEventListener("click", () => {
      navigateTo("unit", appState.currentModuleIndex, appState.currentUnitIndex + 1);
    });
  }

  const nextModBtn = document.getElementById("quizProceedNextModuleBtn");
  if (nextModBtn) {
    nextModBtn.addEventListener("click", () => {
      navigateTo("unit", appState.currentModuleIndex + 1, 0);
    });
  }

  const retakeBtn = document.getElementById("quizRetakeBtn");
  if (retakeBtn) {
    retakeBtn.addEventListener("click", () => {
      navigateTo("quiz", appState.currentModuleIndex, appState.currentUnitIndex);
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
// 8. Event Listeners & Bootstrapping
// ==========================================

function initApp() {
  hydrateAppState();

  // Header Brand Logo click
  const logoBtn = document.getElementById("headerHomeLogo");
  if (logoBtn) {
    logoBtn.addEventListener("click", () => navigateTo("dashboard"));
  }

  // Header Menu Drawer toggle button
  const menuToggleBtn = document.getElementById("navMenuToggleBtn");
  if (menuToggleBtn) {
    menuToggleBtn.addEventListener("click", openCurriculumDrawer);
  }

  // Drawer Close Button & Backdrop
  const drawerCloseBtn = document.getElementById("drawerCloseBtn");
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener("click", closeCurriculumDrawer);
  }

  const drawerBackdrop = document.getElementById("drawerBackdrop");
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener("click", closeCurriculumDrawer);
  }

  // Drawer Search / Filter
  const drawerFilter = document.getElementById("drawerFilterInput");
  if (drawerFilter) {
    drawerFilter.addEventListener("input", (e) => {
      renderDrawerModulesList(e.target.value);
    });
  }

  // Drawer Dashboard Jump
  const drawerDashJump = document.getElementById("drawerDashboardJumpBtn");
  if (drawerDashJump) {
    drawerDashJump.addEventListener("click", () => {
      navigateTo("dashboard");
    });
  }

  // Escape key closes drawer
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCurriculumDrawer();
    }
  });

  // Footer Reset Progress button
  const footerResetBtn = document.getElementById("footerResetBtn");
  if (footerResetBtn) {
    footerResetBtn.addEventListener("click", () => {
      if (confirm("Reset all stored completion checks and quiz scores?")) {
        appState.appSessionState = {
          completedUnits: [],
          quizHighScores: {}
        };
        appState.currentModuleIndex = 0;
        appState.currentUnitIndex = 0;
        saveAppState();
        renderCurrentView();
        renderDrawerModulesList();
      }
    });
  }

  renderCurrentView();
  renderDrawerModulesList();
}

// Boot up once DOM is loaded
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
}

// Export for Node/CommonJS testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    appState,
    hydrateAppState,
    saveAppState,
    markUnitComplete,
    toggleUnitCompletion,
    navigateTo
  };
}
