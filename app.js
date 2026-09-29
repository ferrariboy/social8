/**
 * BC Grade 8 Social Studies Discovery Portal - Core Application Logic
 * File: app.js
 * 100% Full Width Responsive Desktop & Mobile Single Page Application (SPA) Engine
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

function saveAppState() {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (err) {
    console.warn("Failed to serialize state to localStorage:", err);
  }
}

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
  if (typeof document !== "undefined") {
    renderDrawerModulesList();
  }
}

// ==========================================
// 3. Routing & State Shift Handler
// ==========================================

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
        (u.plainEnglish && u.plainEnglish.theBigIdea.toLowerCase().includes(query)) ||
        (u.content && u.content.background && u.content.background.toLowerCase().includes(query))
      );
    });

    if (filteredUnits.length === 0) return;

    const completedInMod = modUnits.filter(u => completedList.includes(u.unitId)).length;
    const isModComplete = completedInMod === modUnits.length && modUnits.length > 0;

    html += `
      <div class="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-4">
        <div class="flex items-center justify-between gap-2 mb-2">
          <div class="text-xs font-black uppercase tracking-wider text-indigo-400">
            Module ${modIdx + 1}
          </div>
          <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
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
          class="drawer-unit-jump-btn w-full text-left p-3 rounded-xl text-xs flex items-center justify-between gap-2 transition-all active-scale ${
            isCurrent 
              ? 'bg-indigo-600 text-white font-bold shadow-md' 
              : isComplete 
                ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300' 
                : 'hover:bg-slate-700/60 text-slate-300'
          }">
          <div class="flex items-center gap-2.5 truncate">
            <span class="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 ${
              isComplete ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-400'
            }">
              ${isComplete ? '✓' : (realUnitIdx + 1)}
            </span>
            <span class="truncate font-medium">${unit.title}</span>
          </div>
          ${typeof score === "number" ? `
            <span class="shrink-0 text-[10px] font-black px-2 py-0.5 rounded ${
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
      <div class="text-center py-10 text-slate-400 text-sm">
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
// 5. Dashboard View (100% Width Responsive Grid)
// ==========================================

function getModuleCategory(modIdx) {
  if (modIdx === 0 || modIdx === 5) return "europe";
  if (modIdx === 1 || modIdx === 2 || modIdx === 3) return "asia";
  if (modIdx === 4) return "americas";
  return "contact";
}

function renderDashboard() {
  const container = document.getElementById("viewDisplayEngine");
  if (!container) return;

  const curriculum = window.CURRICULUM_DATA || [];
  const completedList = appState.appSessionState.completedUnits || [];

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
    <!-- Top Hero Banner: 100% Full Width across screen -->
    <div class="w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 mb-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <!-- Left: Overview & Scope (7 cols on desktop) -->
        <div class="lg:col-span-7">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="text-xs font-black uppercase tracking-wider text-indigo-300 bg-indigo-950/90 px-3 py-1 rounded-full border border-indigo-700/60">
              BC Ministry of Education • Social Studies 8
            </span>
            <span class="text-xs font-semibold text-slate-300">
              c. 600 CE - 1750 CE
            </span>
          </div>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3">
            World Civilizations & Global Encounters
          </h2>
          <p class="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl mb-6">
            Explore 1,150 years of human history: the fall of empires, the Silk Road, Islamic scholarship, feudal societies, the Renaissance, and First Peoples encounters leading to New France.
          </p>

          <!-- Overall Course Progress Bar -->
          <div class="pt-4 border-t border-slate-800/80">
            <div class="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
              <span>Curriculum Mastery Progress</span>
              <span class="text-emerald-400 font-black text-sm">${percent}% Completed (${completedList.length} / ${totalUnits} Units)</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-3 p-0.5 border border-slate-700">
              <div class="bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 h-2 rounded-full transition-all duration-500 ease-out" style="width: ${percent}%;"></div>
            </div>
          </div>
        </div>

        <!-- Right: 3 Stats Cards & Resume CTA (5 cols on desktop) -->
        <div class="lg:col-span-5 bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between space-y-6">
          
          <!-- 3 Stats Tiles -->
          <div class="grid grid-cols-3 gap-3 text-center">
            <div class="bg-slate-900/80 border border-slate-700/60 rounded-xl p-3">
              <div class="text-2xl font-black text-white">${completedList.length}</div>
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Units Done</div>
            </div>
            <div class="bg-slate-900/80 border border-slate-700/60 rounded-xl p-3">
              <div class="text-2xl font-black text-emerald-400">${masteredCount}</div>
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mastered</div>
            </div>
            <div class="bg-slate-900/80 border border-slate-700/60 rounded-xl p-3">
              <div class="text-2xl font-black text-indigo-300">8</div>
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Modules</div>
            </div>
          </div>

          <!-- Resume Active Lesson Card -->
          <div class="bg-white text-slate-900 rounded-xl p-4 shadow-sm border border-slate-200">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[11px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                ⚡ Active Lesson
              </span>
              <span class="text-xs font-bold text-slate-500">
                ${resumeUnit ? resumeUnit.unitId : "M1-U1"}
              </span>
            </div>
            <h4 class="font-black text-base tracking-tight truncate mb-1">
              ${resumeUnit ? resumeUnit.title : "Unit 1: The Fragmentation of Western Europe"}
            </h4>
            <p class="text-xs text-slate-600 truncate mb-4">
              ${resumeMod ? resumeMod.moduleTitle : "Module 1"}
            </p>

            <button 
              id="resumeLearningCtaBtn"
              class="w-full min-h-[48px] px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-sm rounded-xl shadow transition-all flex items-center justify-center gap-2 active-scale">
              <span>Continue Lesson</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Filter Bar (100% width) -->
    <div class="w-full flex items-center justify-between gap-4 mb-6 flex-wrap">
      <div class="flex items-center gap-2.5">
        <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Curriculum Modules
        </h3>
        <span class="text-xs font-bold text-slate-600 bg-slate-200/90 px-3 py-1 rounded-full">
          All 8 Modules & 24 Units
        </span>
      </div>

      <!-- Quick Filter Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 max-w-full text-xs font-bold" id="moduleFilterPills">
        <button data-filter="all" class="filter-pill px-4 py-2 rounded-xl transition-all ${appState.activeModuleFilter === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}">All Modules (8)</button>
        <button data-filter="europe" class="filter-pill px-4 py-2 rounded-xl transition-all ${appState.activeModuleFilter === 'europe' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}">Europe & Middle Ages</button>
        <button data-filter="asia" class="filter-pill px-4 py-2 rounded-xl transition-all ${appState.activeModuleFilter === 'asia' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}">Asia & Islamic World</button>
        <button data-filter="americas" class="filter-pill px-4 py-2 rounded-xl transition-all ${appState.activeModuleFilter === 'americas' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}">Africa & Americas</button>
        <button data-filter="contact" class="filter-pill px-4 py-2 rounded-xl transition-all ${appState.activeModuleFilter === 'contact' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}">Contact & New France</button>
      </div>
    </div>

    <!-- 100% Width Responsive Multi-Column Grid: 4 columns on large screens! -->
    <div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="modulesCardsContainer">
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
              <h4 class="text-base font-black text-slate-900 tracking-tight mt-1 leading-snug">
                ${module.moduleTitle.replace(/^Module \d+:\s*/, '')}
              </h4>
            </div>
            <span class="shrink-0 text-xs font-black px-2.5 py-1 rounded-full ${
              isModuleFinished 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-slate-100 text-slate-600'
            }">
              ${completedCountInMod}/${modUnits.length}
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
          class="unit-navigation-btn w-full min-h-[50px] text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-2.5 active-scale ${
            isComplete 
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 hover:bg-emerald-100/70' 
              : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300 hover:bg-indigo-50/30'
          }">
          <div class="flex items-center gap-2.5 truncate">
            <span class="w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
              isComplete 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }">
              ${isComplete ? '✓' : (unitIdx + 1)}
            </span>
            <div class="truncate">
              <div class="font-bold text-xs sm:text-sm tracking-tight truncate">
                ${unit.title}
              </div>
              <div class="text-[11px] text-slate-500 font-medium">
                ${unit.unitId} • 20-30 min
              </div>
            </div>
          </div>

          <div class="shrink-0 flex items-center gap-1.5">
            ${typeof score === "number" ? `
              <span class="text-[11px] font-black px-2 py-0.5 rounded-md ${
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

  const resumeBtn = document.getElementById("resumeLearningCtaBtn");
  if (resumeBtn) {
    resumeBtn.addEventListener("click", () => {
      navigateTo("unit", resumeModIdx, resumeUnitIdx);
    });
  }

  container.querySelectorAll(".filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      appState.activeModuleFilter = pill.getAttribute("data-filter");
      renderDashboard();
    });
  });

  container.querySelectorAll(".unit-navigation-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const mIdx = parseInt(btn.getAttribute("data-module-index"), 10);
      const uIdx = parseInt(btn.getAttribute("data-unit-index"), 10);
      navigateTo("unit", mIdx, uIdx);
    });
  });
}

// ==========================================
// 6. Unit Core View (100% Width 2-Column Responsive)
// ==========================================

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
  const bgParagraphs = (unit.content && unit.content.background ? unit.content.background : "").split(/\n\n+/).filter(p => p.trim().length > 0);

  // Fallback defaults for enhanced data fields
  const plainEng = unit.plainEnglish || {
    theBigIdea: "Explore the systemic shifts and technological breakthroughs of this era.",
    modernAnalogy: "Connecting historical breakthroughs to modern day mechanics.",
    keyTakeaways: ["Key historical transitions shaped laws, culture, and trade."]
  };

  const psContext = {
    purpose: unit.primarySourceContext?.purpose || "A primary source is direct evidence created by people who actually lived through these historical events.",
    authorAndEra: unit.primarySourceContext?.authorAndEra || "Historical Document",
    originalQuote: unit.primarySourceContext?.originalQuote || (unit.content ? unit.content.primarySource : "") || "",
    plainEnglishMeaning: unit.primarySourceContext?.plainEnglishMeaning || "This document proves how historical actors communicated and governed during this period.",
    whyItMatters: unit.primarySourceContext?.whyItMatters || "Historians study original texts to verify historical reality rather than relying on later assumptions."
  };

  const focusContext = {
    title: unit.specializedFocusContext?.title || "Technological & Cultural Breakthrough",
    purpose: unit.specializedFocusContext?.purpose || "Why examine this? History is shaped not just by dates and wars, but by specific tools, inventions, and legal frameworks that changed everyday human life.",
    details: unit.specializedFocusContext?.details || (unit.content ? unit.content.focus : "") || "",
    plainEnglishImpact: unit.specializedFocusContext?.plainEnglishImpact || "Without this breakthrough, communication, government administration, and trade would have remained localized."
  };

  const artifact = {
    imageUrl: unit.visualArtifact?.imageUrl || `images/${unit.unitId}.jpg`,
    title: unit.visualArtifact?.title || "Historical Cartographic or Archaeological Primary Artifact",
    provenance: unit.visualArtifact?.provenance || "Museum Archive Collection",
    description: unit.visualArtifact?.description || (unit.content ? unit.content.graphicDescription : "") || "Historical primary visual and archaeological record.",
    visualClues: (unit.visualArtifact?.visualClues && unit.visualArtifact.visualClues.length > 0)
      ? unit.visualArtifact.visualClues 
      : ["Observe the craft materials and techniques used by artisans of this era."]
  };

  let html = `
    <!-- Top Breadcrumb Trail Navigation -->
    <nav aria-label="Breadcrumb" class="w-full mb-6 text-xs sm:text-sm font-bold text-slate-500 flex items-center gap-2 flex-wrap">
      <button id="breadcrumbHomeBtn" class="hover:text-indigo-600 transition-colors flex items-center gap-1">
        <span>Dashboard</span>
      </button>
      <span>/</span>
      <span class="text-slate-600">${module.moduleTitle.replace(/^Module \d+:\s*/, '')}</span>
      <span>/</span>
      <span class="text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded font-black">${unit.unitId}</span>
    </nav>

    <!-- 100% Width Two-Column Layout (Spacious 8 cols reading pane + 4 cols sticky sidebar) -->
    <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
      
      <!-- ============================================== -->
      <!-- MAIN READING PANE (8 cols on desktop) -->
      <!-- ============================================== -->
      <div class="lg:col-span-8 space-y-8">
        
        <!-- Unit Title Block -->
        <div class="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
                ${unit.unitId} • Module ${appState.currentModuleIndex + 1}
              </span>
              <span class="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                ⏱️ 20-30 min study
              </span>
            </div>

            ${isCompleted ? `
              <span class="inline-flex items-center gap-1.5 text-xs font-black bg-emerald-100 text-emerald-900 px-3.5 py-1.5 rounded-full border border-emerald-300">
                <span>✓ Completed</span>
                ${typeof score === "number" ? `<span>(${score}% Mastery)</span>` : ""}
              </span>
            ` : `
              <span class="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                📖 In Progress
              </span>
            `}
          </div>

          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-3">
            ${unit.title}
          </h2>
          <p class="text-base font-semibold text-slate-500">
            ${module.moduleTitle}
          </p>
        </div>

        <!-- ============================================== -->
        <!-- SECTION 1: PLAIN ENGLISH: THE BIG IDEA -->
        <!-- ============================================== -->
        <section id="sectionPlainEnglish" class="bg-gradient-to-br from-indigo-50 via-white to-sky-50 rounded-3xl p-6 sm:p-10 shadow-sm border-2 border-indigo-200">
          <div class="flex items-center gap-3 mb-4">
            <span class="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow">💡</span>
            <div>
              <span class="text-xs font-black uppercase tracking-wider text-indigo-700">Student Guide</span>
              <h3 class="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                Plain English: The Big Idea (For Grade 8s)
              </h3>
            </div>
          </div>

          <div class="space-y-4 text-slate-800">
            <!-- 30-Second Summary -->
            <div class="bg-white/90 p-5 rounded-2xl border border-indigo-100 shadow-sm">
              <div class="font-black text-xs uppercase tracking-wider text-indigo-800 mb-1">
                The 30-Second Summary
              </div>
              <p class="text-base sm:text-lg leading-relaxed font-medium">
                ${plainEng.theBigIdea}
              </p>
            </div>

            <!-- Modern Analogy -->
            <div class="bg-white/90 p-5 rounded-2xl border border-sky-100 shadow-sm">
              <div class="font-black text-xs uppercase tracking-wider text-sky-800 mb-1">
                Why It Matters To You Today (Modern Connection)
              </div>
              <p class="text-base sm:text-lg leading-relaxed text-slate-700">
                ${plainEng.modernAnalogy}
              </p>
            </div>

            <!-- 3 Key Takeaways -->
            <div class="bg-white/90 p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div class="font-black text-xs uppercase tracking-wider text-slate-700 mb-2">
                3 Key Concepts to Remember
              </div>
              <ul class="space-y-2 text-sm sm:text-base">
                ${plainEng.keyTakeaways.map(t => `
                  <li class="flex items-start gap-2.5">
                    <span class="text-indigo-600 font-black mt-0.5">•</span>
                    <span>${t}</span>
                  </li>
                `).join("")}
              </ul>
            </div>
          </div>
        </section>

        <!-- ============================================== -->
        <!-- SECTION 2: HISTORICAL CONTEXT (FULL DEPTH) -->
        <!-- ============================================== -->
        <article id="sectionContext" class="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
          <div class="flex items-center justify-between gap-3 mb-6 border-b border-slate-100 pb-4">
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-xl">🏛️</span>
              <div>
                <span class="text-xs font-black uppercase tracking-wider text-indigo-600">Core Curriculum</span>
                <h3 class="text-2xl font-black text-slate-900 tracking-tight">
                  1. Historical Context (Full Depth Breakdown)
                </h3>
              </div>
            </div>
            <span class="text-xs font-bold text-slate-400 hidden sm:block">Systemic Historical Analysis</span>
          </div>

          <!-- Embedded Historical Figure in Context -->
          <figure class="mb-8 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md">
            <img 
              src="${artifact.imageUrl}" 
              alt="${artifact.title}" 
              loading="lazy"
              class="w-full max-h-[460px] object-cover bg-slate-950 transition-transform duration-300 hover:scale-[1.01]"
              onerror="this.onerror=null; this.src='data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'800\\' height=\\'450\\' viewBox=\\'0 0 800 450\\'%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' fill=\\'%230f172a\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%2394a3b8\\' font-family=\\'sans-serif\\' font-size=\\'20\\'%3E🏛️ Primary Historical Visual Record%3C/text%3E%3C/svg%3E';"
            />
            <figcaption class="p-3.5 bg-slate-900/95 border-t border-slate-800 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
              <span class="font-bold text-white">Figure: ${artifact.title}</span>
              <span class="text-slate-400 font-mono">${artifact.provenance}</span>
            </figcaption>
          </figure>

          <div class="text-lg text-slate-800 leading-relaxed font-normal space-y-5">
            ${bgParagraphs.map(p => `<p>${p.trim()}</p>`).join("")}
          </div>
        </article>

        <!-- ============================================== -->
        <!-- SECTION 3: PRIMARY SOURCE DEEP DIVE -->
        <!-- ============================================== -->
        <article id="sectionPrimarySource" class="bg-amber-50/90 border-l-4 border-amber-600 rounded-r-3xl p-6 sm:p-10 shadow-sm border-y border-r border-amber-200/90">
          <div class="flex items-center justify-between gap-3 mb-4">
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-2xl bg-amber-200/80 text-amber-900 flex items-center justify-center text-xl">📜</span>
              <div>
                <span class="text-xs font-black uppercase tracking-wider text-amber-800">Historical Evidence</span>
                <h3 class="text-2xl font-black text-amber-950 tracking-tight">
                  2. Primary Source Deep Dive
                </h3>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <!-- Context Callout -->
            <div class="bg-white/80 p-4 rounded-xl border border-amber-200/80 text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
              <span class="font-black uppercase tracking-wider text-amber-800 block mb-1">What is this document?</span>
              ${psContext.purpose} <strong>Context:</strong> ${psContext.authorAndEra}.
            </div>

            <!-- Original Archival Quote -->
            <blockquote class="italic text-slate-900 text-lg sm:text-xl leading-relaxed font-serif bg-white p-6 rounded-2xl shadow-inner border border-amber-300 my-3">
              "${psContext.originalQuote}"
            </blockquote>

            <!-- Plain English Translation -->
            <div class="bg-white/90 p-5 rounded-2xl border border-amber-200 shadow-sm">
              <span class="font-black text-xs uppercase tracking-wider text-amber-900 block mb-1">
                🗣️ Plain English Translation (What this actually means)
              </span>
              <p class="text-base text-slate-800 leading-relaxed">
                ${psContext.plainEnglishMeaning}
              </p>
            </div>

            <!-- Why Historians Care -->
            <div class="bg-amber-100/70 p-4 rounded-xl border border-amber-300/80 text-xs sm:text-sm text-amber-950">
              <strong>Why this matters to historians:</strong> ${psContext.whyItMatters}
            </div>
          </div>
        </article>

        <!-- ============================================== -->
        <!-- SECTION 4: SPECIALIZED FOCUS -->
        <!-- ============================================== -->
        <article id="sectionSpecializedFocus" class="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
          <div class="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
            <span class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl">⚙️</span>
            <div>
              <span class="text-xs font-black uppercase tracking-wider text-emerald-700">Inventions, Laws & Customs</span>
              <h3 class="text-2xl font-black text-slate-900 tracking-tight">
                3. Specialized Focus: ${focusContext.title}
              </h3>
            </div>
          </div>

          <div class="space-y-4">
            <!-- Context Header -->
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium">
              <span class="font-black text-slate-900 block mb-1">Why are we looking at this?</span>
              ${focusContext.purpose}
            </div>

            <!-- Detailed Mechanism -->
            <div class="text-lg text-slate-800 leading-relaxed font-normal bg-emerald-50/30 p-6 rounded-2xl border border-emerald-100">
              <p>${focusContext.details}</p>
            </div>

            <!-- Plain English Real-World Impact -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span class="font-black text-xs uppercase tracking-wider text-emerald-800 block mb-1">
                ⚡ Real-World Impact (In Plain English)
              </span>
              <p class="text-base text-slate-800 leading-relaxed">
                ${focusContext.plainEnglishImpact}
              </p>
            </div>
          </div>
        </article>

        <!-- ============================================== -->
        <!-- SECTION 5: VISUAL HISTORY GALLERY & REAL IMAGES -->
        <!-- ============================================== -->
        <article id="sectionArtifactMap" class="bg-slate-900 text-slate-100 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800">
          <div class="flex items-center justify-between gap-3 mb-6 border-b border-slate-800 pb-4 flex-wrap">
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-2xl bg-slate-800 text-indigo-400 flex items-center justify-center text-xl">🗺️</span>
              <div>
                <span class="text-xs font-mono uppercase tracking-wider text-indigo-400">Primary Visual Record</span>
                <h3 class="text-2xl font-black text-white tracking-tight">
                  4. Visual History Gallery: Artifacts & Cartography
                </h3>
              </div>
            </div>
            <span class="text-xs font-mono text-slate-400">${artifact.provenance}</span>
          </div>

          <!-- Embedded Real Image -->
          <div class="mb-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col items-center">
            <img 
              src="${artifact.imageUrl}" 
              alt="${artifact.title}" 
              loading="lazy"
              class="w-full max-h-[520px] object-contain bg-slate-950 p-2 rounded-2xl transition-transform hover:scale-[1.01]"
              onerror="this.onerror=null; this.src='data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'800\\' height=\\'450\\' viewBox=\\'0 0 800 450\\'%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' fill=\\'%23020617\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%2364748b\\' font-family=\\'sans-serif\\' font-size=\\'18\\'%3E🗺️ Historical Artifact Record%3C/text%3E%3C/svg%3E';"
            />
            <div class="w-full p-4 bg-slate-950/90 border-t border-slate-800 text-center text-xs text-slate-300 font-mono">
              <strong>Figure:</strong> ${artifact.title}
            </div>
          </div>

          <!-- Artifact Description & Analysis -->
          <div class="space-y-4">
            <div class="text-sm sm:text-base text-slate-200 leading-relaxed font-mono bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <span class="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-2 font-sans">
                Archaeological & Cartographic Record:
              </span>
              ${artifact.description}
            </div>

            <!-- Visual Clues Guide -->
            <div class="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
              <span class="text-xs font-black uppercase tracking-wider text-emerald-400 block mb-2 font-sans">
                🔍 Visual Investigation Guide (What to Look For):
              </span>
              <ul class="space-y-2 text-xs sm:text-sm text-slate-300 font-sans">
                ${artifact.visualClues.map(c => `
                  <li class="flex items-start gap-2">
                    <span class="text-indigo-400 font-black">•</span>
                    <span>${c}</span>
                  </li>
                `).join("")}
              </ul>
            </div>
          </div>
        </article>

        <!-- Bottom Pagination Controls -->
        <div class="w-full flex items-center justify-between gap-4 pt-4 pb-12">
          <button 
            id="unitNavPrevBtn" 
            class="min-h-[50px] px-5 py-3 border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-black text-sm rounded-2xl active-scale transition-all flex items-center gap-2 shadow-sm">
            <span>← Previous Unit</span>
          </button>

          <button 
            id="unitNavHubBtn" 
            class="min-h-[50px] px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-black text-sm rounded-2xl active-scale transition-all shadow-sm">
            Dashboard Hub
          </button>

          <button 
            id="unitNavNextBtn" 
            class="min-h-[50px] px-5 py-3 border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-black text-sm rounded-2xl active-scale transition-all flex items-center gap-2 shadow-sm">
            <span>Next Unit →</span>
          </button>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- STICKY SIDEBAR COMPANION (4 cols on desktop) -->
      <!-- ============================================== -->
      <div class="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
        
        <!-- Video Companion Player Card -->
        <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
              Video Companion
            </span>
            <a 
              href="${unit.videoEmbedUrl.replace('/embed/', '/watch?v=')}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1">
              <span>Watch on YouTube ↗</span>
            </a>
          </div>

          <!-- Video Embed Frame -->
          <div class="aspect-video rounded-2xl overflow-hidden shadow border border-slate-200 bg-slate-950 mb-3 relative">
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

          <!-- Video Fallback Banner -->
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
            <p class="text-[11px] text-slate-600 mb-2">
              If your browser or school network restricts embedded video playback:
            </p>
            <a 
              href="${unit.videoEmbedUrl.replace('/embed/', '/watch?v=')}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
              <span>Open Directly on YouTube</span>
            </a>
          </div>
        </div>

        <!-- Practice Quiz Action Card -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Knowledge Check
            </span>
            ${typeof score === "number" ? `
              <span class="text-xs font-black px-2.5 py-0.5 rounded-full ${
                score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-900'
              }">
                Best Score: ${score}%
              </span>
            ` : ''}
          </div>

          <h4 class="text-lg font-black text-slate-900 mb-1 leading-snug">
            Unit Practice Quiz
          </h4>
          <p class="text-xs text-slate-600 mb-5">
            Test your understanding of the historical concepts, primary sources, and breakthroughs.
          </p>

          <button 
            id="launchUnitPracticeQuizBtn"
            class="w-full min-h-[52px] bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black py-3.5 px-5 rounded-2xl shadow-md active-scale transition-all flex items-center justify-center gap-2 text-sm sm:text-base mb-3">
            <span>Launch Practice Quiz →</span>
          </button>

          <button 
            id="toggleCompleteStatusBtn"
            class="w-full min-h-[46px] px-4 py-2 border-2 ${
              isCompleted 
                ? 'border-emerald-500 bg-emerald-50 text-emerald-900 hover:bg-emerald-100' 
                : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
            } font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 active-scale">
            <span>${isCompleted ? '✓ Marked as Completed' : '○ Mark as Completed'}</span>
          </button>
        </div>

        <!-- Table of Contents: Quick Anchor Scroll Links -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hidden lg:block">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
            In This Lesson
          </h4>
          <ul class="space-y-2 text-sm font-bold text-slate-600">
            <li>
              <a href="#sectionPlainEnglish" class="hover:text-indigo-600 transition-colors flex items-center gap-2 py-1">
                <span>💡</span>
                <span>Plain English Breakdown</span>
              </a>
            </li>
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
                <span>Visual History Gallery</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  const breadcrumbHome = document.getElementById("breadcrumbHomeBtn");
  if (breadcrumbHome) {
    breadcrumbHome.addEventListener("click", () => navigateTo("dashboard"));
  }

  const quizBtn = document.getElementById("launchUnitPracticeQuizBtn");
  if (quizBtn) {
    quizBtn.addEventListener("click", () => {
      navigateTo("quiz", appState.currentModuleIndex, appState.currentUnitIndex);
    });
  }

  const toggleBtn = document.getElementById("toggleCompleteStatusBtn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      toggleUnitCompletion(unit.unitId);
    });
  }

  const hubBtn = document.getElementById("unitNavHubBtn");
  if (hubBtn) {
    hubBtn.addEventListener("click", () => navigateTo("dashboard"));
  }

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
// 7. Practice Quiz View (Distraction-Free)
// ==========================================

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
    <div class="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-12 shadow-xl border border-slate-200">
      
      <!-- Progress Bar & Indicator -->
      <div class="flex items-center justify-between mb-4">
        <span class="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Question ${qIdx + 1} of ${totalQ}
        </span>
        <span class="text-xs font-bold text-slate-500">
          ${unit.unitId} • Practice Quiz
        </span>
      </div>

      <div class="w-full bg-slate-100 rounded-full h-3 mb-8">
        <div class="bg-indigo-600 h-3 rounded-full transition-all duration-300" style="width: ${((qIdx + (isAnswered ? 1 : 0.5)) / totalQ) * 100}%;"></div>
      </div>

      <!-- Question Statement inside bold typography -->
      <h3 class="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight mb-8">
        ${currentQ.questionText}
      </h3>

      <!-- 4 Multiple Choice Touch Blocks -->
      <div class="space-y-3.5 mb-8" id="quizChoicesList">
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
        class="quiz-choice-btn w-full p-4 sm:p-5 border-2 rounded-2xl text-left font-medium min-h-[52px] flex items-center gap-3.5 transition-all active-scale ${styles}">
        ${icon}
        <span class="text-base sm:text-lg leading-snug flex-1">${optText}</span>
      </button>
    `;
  });

  html += `
      </div>
  `;

  if (isAnswered) {
    const isCorrect = selectedIdx === currentQ.correctIndex;
    html += `
      <!-- Analytical Explanation -->
      <div class="p-6 rounded-2xl mb-8 transition-all border ${
        isCorrect 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
          : 'bg-amber-50 border-amber-200 text-amber-950'
      }">
        <div class="flex items-center gap-2 font-black text-sm mb-2">
          <span>${isCorrect ? '🌟 Correct! Analytical Explanation:' : '📖 Analytical Explanation:'}</span>
        </div>
        <p class="text-base leading-relaxed">${currentQ.explanation}</p>
      </div>

      <!-- Advance CTA button -->
      <button 
        id="quizAdvanceActionBtn" 
        class="w-full min-h-[54px] px-6 py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active-scale">
        <span>${isLastQuestion ? 'Complete Quiz 🏆' : 'Next Question →'}</span>
      </button>
    `;
  }

  html += `
    </div>
  `;

  container.innerHTML = html;

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
    feedbackMessage = "Good attempt! Review the plain English and primary source sections to reinforce key concepts.";
  } else if (scorePercent < 100) {
    feedbackBadge = "🎯 Proficient";
    feedbackMessage = "Solid understanding of the historical events and structural mechanisms!";
  }

  container.innerHTML = `
    <div class="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 text-center">
      <div class="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl mx-auto mb-4">
        ✓
      </div>

      <span class="inline-block text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full mb-2">
        ${feedbackBadge}
      </span>

      <h2 class="text-3xl font-black text-slate-900 tracking-tight mb-2">
        Quiz Completed!
      </h2>
      <p class="text-slate-600 text-sm mb-6">
        ${unit.title}
      </p>

      <div class="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
        <div class="text-5xl font-black text-indigo-600 mb-1">
          ${scorePercent}%
        </div>
        <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">
          ${correct} of ${total} Questions Correct
        </div>
        <p class="text-sm text-slate-600 mt-3 pt-3 border-t border-slate-200 leading-relaxed">
          ${feedbackMessage}
        </p>
      </div>

      <div class="space-y-3.5">
        ${hasNextUnit ? `
          <button 
            id="quizProceedNextUnitBtn"
            class="w-full min-h-[52px] px-6 py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active-scale">
            <span>Proceed to Next Unit →</span>
          </button>
        ` : hasNextModule ? `
          <button 
            id="quizProceedNextModuleBtn"
            class="w-full min-h-[52px] px-6 py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active-scale">
            <span>Proceed to Next Module →</span>
          </button>
        ` : ''}

        <button 
          id="quizRetakeBtn" 
          class="w-full min-h-[48px] px-5 py-3 border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl transition-all active-scale">
          Retake Practice Quiz
        </button>

        <button 
          id="quizReturnHubBtn" 
          class="w-full min-h-[48px] px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl transition-all active-scale">
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

  const logoBtn = document.getElementById("headerHomeLogo");
  if (logoBtn) {
    logoBtn.addEventListener("click", () => navigateTo("dashboard"));
  }

  const menuToggleBtn = document.getElementById("navMenuToggleBtn");
  if (menuToggleBtn) {
    menuToggleBtn.addEventListener("click", openCurriculumDrawer);
  }

  const drawerCloseBtn = document.getElementById("drawerCloseBtn");
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener("click", closeCurriculumDrawer);
  }

  const drawerBackdrop = document.getElementById("drawerBackdrop");
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener("click", closeCurriculumDrawer);
  }

  const drawerFilter = document.getElementById("drawerFilterInput");
  if (drawerFilter) {
    drawerFilter.addEventListener("input", (e) => {
      renderDrawerModulesList(e.target.value);
    });
  }

  const drawerDashJump = document.getElementById("drawerDashboardJumpBtn");
  if (drawerDashJump) {
    drawerDashJump.addEventListener("click", () => {
      navigateTo("dashboard");
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCurriculumDrawer();
    }
  });

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

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
}

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
