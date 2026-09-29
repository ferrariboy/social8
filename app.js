/**
 * BC Grade 8 Social Studies Discovery Portal - Core Application Logic
 * File: app.js
 * Mobile-First Client-Side Single Page Application (SPA) Engine
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
    if (viewTitle) viewTitle.innerText = "Dashboard";
    if (backBtn) {
      backBtn.style.visibility = "hidden";
      backBtn.setAttribute("aria-hidden", "true");
    }
    renderDashboard();
  } else if (appState.activeView === "unit") {
    const currentModNum = appState.currentModuleIndex + 1;
    if (viewTitle) viewTitle.innerText = `Module ${currentModNum}`;
    if (backBtn) {
      backBtn.style.visibility = "visible";
      backBtn.removeAttribute("aria-hidden");
      backBtn.innerText = "← Home";
      backBtn.onclick = () => navigateTo("dashboard");
    }
    renderUnitView();
  } else if (appState.activeView === "quiz") {
    if (viewTitle) viewTitle.innerText = "Practice Quiz";
    if (backBtn) {
      backBtn.style.visibility = "visible";
      backBtn.removeAttribute("aria-hidden");
      backBtn.innerText = "✕ Exit";
      backBtn.onclick = () => navigateTo("unit", appState.currentModuleIndex, appState.currentUnitIndex);
    }
    renderQuizView();
  }
}

/**
 * Updates the sticky header progress badge percentage.
 */
function updateGlobalHeaderProgress() {
  if (typeof document === "undefined") return;
  const badge = document.getElementById("globalProgressBarBadge");
  if (!badge) return;

  const curriculum = window.CURRICULUM_DATA || [];
  let totalUnits = 0;
  curriculum.forEach(m => {
    if (m.units) totalUnits += m.units.length;
  });

  const completed = (appState.appSessionState.completedUnits || []).length;
  const percent = totalUnits > 0 ? Math.round((completed / totalUnits) * 100) : 0;
  badge.innerText = `${percent}% Done`;
}

// ==========================================
// 4. Dashboard View Rendering
// ==========================================

/**
 * Renders the primary Dashboard Hub with Resume button and 8 module cards.
 */
function renderDashboard() {
  const container = document.getElementById("viewDisplayEngine");
  if (!container) return;

  const curriculum = window.CURRICULUM_DATA || [];
  const completedList = appState.appSessionState.completedUnits || [];

  // Determine resume target
  const resumeModIdx = Math.max(0, Math.min(appState.currentModuleIndex, curriculum.length - 1));
  const resumeMod = curriculum[resumeModIdx];
  const resumeUnitIdx = Math.max(0, Math.min(appState.currentUnitIndex, (resumeMod && resumeMod.units ? resumeMod.units.length - 1 : 0)));
  const resumeUnit = resumeMod && resumeMod.units ? resumeMod.units[resumeUnitIdx] : null;

  let totalUnits = 0;
  curriculum.forEach(m => (totalUnits += (m.units || []).length));
  const percent = totalUnits > 0 ? Math.round((completedList.length / totalUnits) * 100) : 0;

  let html = `
    <!-- Top Progress Summary Banner -->
    <div class="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 mb-6 shadow-xl border border-indigo-800/40">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-black uppercase tracking-wider text-indigo-300 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-700/60">
          BC Grade 8 Social Studies
        </span>
        <span class="text-xs font-bold text-slate-300">
          ${completedList.length} of ${totalUnits} Units Done
        </span>
      </div>
      <h2 class="text-2xl font-black tracking-tight mt-1 mb-3">
        Social Studies Discovery Portal
      </h2>
      <div class="w-full bg-slate-800 rounded-full h-3 p-0.5 border border-slate-700 mb-2">
        <div class="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-500 ease-out" style="width: ${percent}%;"></div>
      </div>
      <div class="flex justify-between text-xs font-semibold text-slate-300">
        <span>Curriculum Progress</span>
        <span class="text-emerald-400 font-bold">${percent}%</span>
      </div>
    </div>

    <!-- Prominent "Resume Learning" Call-to-Action Card -->
    <div class="bg-white rounded-3xl p-5 mb-8 shadow-md border border-slate-200">
      <span class="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
        ⚡ Active Study Session
      </span>
      <h3 class="text-xl font-black text-slate-900 mt-2 mb-1 tracking-tight">
        ${resumeUnit ? resumeUnit.title : "Start Unit 1"}
      </h3>
      <p class="text-sm text-slate-600 mb-4 line-clamp-1">
        ${resumeMod ? resumeMod.moduleTitle : "Module 1"}
      </p>

      <button 
        id="resumeLearningCtaBtn"
        class="w-full min-h-[52px] px-5 py-3.5 my-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 active:scale-98 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
        <span>Resume Learning</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
        </svg>
      </button>
    </div>

    <!-- 8 Vertically Stacked Module Cards -->
    <div class="space-y-6">
      <div class="flex items-center justify-between px-1">
        <h3 class="text-xl font-black text-slate-900 tracking-tight">
          Curriculum Modules
        </h3>
        <span class="text-xs font-bold text-slate-500">8 Modules</span>
      </div>
  `;

  curriculum.forEach((module, modIdx) => {
    const modUnits = module.units || [];
    const completedCountInMod = modUnits.filter(u => completedList.includes(u.unitId)).length;
    const isModuleFinished = modUnits.length > 0 && completedCountInMod === modUnits.length;

    html += `
      <section class="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
        <!-- Module Card Header -->
        <div class="flex items-start justify-between gap-3 mb-3">
          <div>
            <span class="text-xs font-extrabold text-indigo-700 uppercase tracking-wider">
              Module ${modIdx + 1}
            </span>
            <h4 class="text-lg font-black text-slate-900 tracking-tight mt-0.5 leading-snug">
              ${module.moduleTitle}
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
          class="unit-navigation-btn w-full min-h-[48px] p-4 my-1.5 rounded-2xl border text-left font-medium active:scale-98 transition-all flex items-center justify-between gap-3 ${
            isComplete 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold' 
              : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300'
          }">
          <div class="flex items-center gap-3 min-w-0">
            <!-- Checkmark or Unit Identifier -->
            <div class="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-black text-xs ${
              isComplete ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
            }">
              ${isComplete ? '✓' : (unitIdx + 1)}
            </div>
            <div class="min-w-0">
              <div class="text-base font-black truncate leading-snug">
                ${unit.title}
              </div>
              <div class="text-xs opacity-70 truncate">
                ${unit.unitId}
              </div>
            </div>
          </div>

          <div class="shrink-0 flex items-center gap-2">
            ${typeof score === "number" ? `
              <span class="text-xs font-black px-2 py-0.5 rounded-md ${
                score === 100 ? 'bg-emerald-200 text-emerald-900' : 'bg-indigo-100 text-indigo-900'
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
      </section>
    `;
  });

  html += `
    </div>
    
    <!-- Footer Reset State Link -->
    <div class="mt-10 mb-6 text-center">
      <button 
        id="resetSessionProgressBtn" 
        class="text-xs text-slate-400 hover:text-rose-600 underline font-semibold py-2 px-3">
        Reset Learning Progress
      </button>
    </div>
  `;

  container.innerHTML = html;

  // Attach Resume button event
  const resumeBtn = document.getElementById("resumeLearningCtaBtn");
  if (resumeBtn) {
    resumeBtn.addEventListener("click", () => {
      navigateTo("unit", resumeModIdx, resumeUnitIdx);
    });
  }

  // Attach Unit Click events
  container.querySelectorAll(".unit-navigation-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const mIdx = parseInt(btn.getAttribute("data-module-index"), 10);
      const uIdx = parseInt(btn.getAttribute("data-unit-index"), 10);
      navigateTo("unit", mIdx, uIdx);
    });
  });

  // Attach Reset Session event
  const resetBtn = document.getElementById("resetSessionProgressBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset all stored completion checks and quiz scores?")) {
        appState.appSessionState = {
          completedUnits: [],
          quizHighScores: {}
        };
        appState.currentModuleIndex = 0;
        appState.currentUnitIndex = 0;
        saveAppState();
        renderCurrentView();
      }
    });
  }
}

// ==========================================
// 5. Unit Core View Rendering
// ==========================================

/**
 * Renders the Unit Core View with the 4 structured blocks and quiz CTA.
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

  // Background paragraphs (split on double newline)
  const bgParagraphs = (unit.content.background || "").split(/\n\n+/).filter(p => p.trim().length > 0);

  let html = `
    <!-- Unit Meta Header -->
    <div class="mb-4">
      <div class="flex items-center justify-between gap-2 mb-2">
        <span class="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
          ${unit.unitId} • Module ${appState.currentModuleIndex + 1}
        </span>
        ${isCompleted ? `
          <span class="inline-flex items-center gap-1 text-xs font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            ✓ Complete ${typeof score === "number" ? `(${score}%)` : ""}
          </span>
        ` : `
          <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            20-30 min study
          </span>
        `}
      </div>

      <h2 class="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-4">
        ${unit.title}
      </h2>
    </div>

    <!-- YouTube Embed Video Frame -->
    <div class="mb-6 rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-950">
      <div class="relative w-full aspect-video">
        <iframe 
          class="absolute top-0 left-0 w-full h-full"
          src="${unit.videoEmbedUrl}" 
          title="${unit.title}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen>
        </iframe>
      </div>
      <div class="p-3 bg-slate-900 text-slate-300 text-xs flex items-center justify-between">
        <span class="truncate font-semibold">📺 Video Lesson</span>
        <a href="${unit.videoEmbedUrl.replace('embed/', 'watch?v=').replace('www.youtube-nocookie.com', 'www.youtube.com')}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 underline font-bold shrink-0 ml-2">
          Open in YouTube ↗
        </a>
      </div>
    </div>

    <!-- Prominent "Start Practice Quiz" CTA -->
    <div class="mb-8">
      <button 
        id="unitStartQuizTopBtn" 
        class="w-full min-h-[52px] px-5 py-3.5 my-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 active:scale-98 text-white font-black text-lg rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
        <span>🎯 Start Practice Quiz (${(unit.quiz || []).length} Question)</span>
      </button>
    </div>

    <!-- 4 High-Density Structured Content Sections -->
    <div class="space-y-6 mb-8">
      
      <!-- 1. Historical Background -->
      <article class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center gap-2.5 mb-3">
          <div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-base">
            🏛️
          </div>
          <h3 class="text-xl font-black text-slate-900 tracking-tight">
            1. Historical Background
          </h3>
        </div>
        <div class="text-lg text-slate-800 leading-relaxed font-normal space-y-4">
          ${bgParagraphs.map(p => `<p>${p.trim()}</p>`).join("")}
        </div>
      </article>

      <!-- 2. Primary Source Deep Dive -->
      <article class="bg-amber-50/70 rounded-3xl p-6 shadow-sm border border-amber-200/80">
        <div class="flex items-center gap-2.5 mb-3">
          <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base">
            📜
          </div>
          <h3 class="text-xl font-black text-slate-900 tracking-tight">
            2. Primary Source Deep Dive
          </h3>
        </div>
        <blockquote class="italic text-slate-800 text-lg leading-relaxed border-l-4 border-amber-400 pl-4 my-3 bg-white/70 p-4 rounded-r-2xl shadow-inner font-serif">
          "${unit.content.primarySource}"
        </blockquote>
      </article>

      <!-- 3. Technical & Cultural Focus -->
      <article class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center gap-2.5 mb-3">
          <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base">
            ⚙️
          </div>
          <h3 class="text-xl font-black text-slate-900 tracking-tight">
            3. Technical & Cultural Focus
          </h3>
        </div>
        <div class="text-lg text-slate-800 leading-relaxed font-normal bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100">
          <p>${unit.content.focus}</p>
        </div>
      </article>

      <!-- 4. Imagery & Geographic Index -->
      <article class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div class="flex items-center gap-2.5 mb-3">
          <div class="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-base">
            🗺️
          </div>
          <h3 class="text-xl font-black text-slate-900 tracking-tight">
            4. Imagery & Geographic Index
          </h3>
        </div>
        <div class="text-slate-800 text-base leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono text-sm">
          ${unit.content.graphicDescription}
        </div>
      </article>
    </div>

    <!-- Bottom Action & Navigation Bar -->
    <div class="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-slate-200 space-y-3">
      <button 
        id="unitStartQuizBottomBtn" 
        class="w-full min-h-[52px] px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-lg rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
        <span>🎯 Start Practice Quiz</span>
      </button>

      <div class="flex items-center justify-between gap-3 pt-1">
        <button 
          id="unitNavPrevBtn" 
          class="flex-1 min-h-[48px] px-3 py-2 border-2 border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 font-bold text-sm active:scale-98 transition-all truncate">
          ← Previous
        </button>

        <button 
          id="unitNavHubBtn" 
          class="min-h-[48px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl active:scale-98 transition-all">
          Hub
        </button>

        <button 
          id="unitNavNextBtn" 
          class="flex-1 min-h-[48px] px-3 py-2 border-2 border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 font-bold text-sm active:scale-98 transition-all truncate">
          Next →
        </button>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Event bindings
  const startQuiz = () => navigateTo("quiz", appState.currentModuleIndex, appState.currentUnitIndex);

  const topQuizBtn = document.getElementById("unitStartQuizTopBtn");
  if (topQuizBtn) topQuizBtn.addEventListener("click", startQuiz);

  const bottomQuizBtn = document.getElementById("unitStartQuizBottomBtn");
  if (bottomQuizBtn) bottomQuizBtn.addEventListener("click", startQuiz);

  const hubBtn = document.getElementById("unitNavHubBtn");
  if (hubBtn) hubBtn.addEventListener("click", () => navigateTo("dashboard"));

  // Prev Unit
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

  // Next Unit
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
// 6. Practice Quiz View Rendering
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

  // Check if completed all questions
  if (qIdx >= questions.length) {
    renderQuizResults(container, unit, questions);
    return;
  }

  const currentQ = questions[qIdx];
  const isAnswered = appState.quizAnswerSubmitted;
  const selectedIdx = appState.quizSelectedAnswer;

  let html = `
    <div class="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
      <!-- Progress Bar & Indicator -->
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
          Question ${qIdx + 1} of ${questions.length}
        </span>
        <span class="text-xs font-bold text-slate-500">
          ${unit.unitId}
        </span>
      </div>

      <div class="w-full bg-slate-100 rounded-full h-2 mb-6">
        <div class="bg-indigo-600 h-2 rounded-full transition-all duration-300" style="width: ${((qIdx + (isAnswered ? 1 : 0.5)) / questions.length) * 100}%;"></div>
      </div>

      <!-- Question Prompt -->
      <h3 class="text-xl font-black text-slate-900 leading-snug mb-6">
        ${currentQ.questionText}
      </h3>

      <!-- 4 Option Buttons (Touch targets >= 48px with clear margins) -->
      <div class="space-y-3 mb-6" id="quizOptionsContainer">
  `;

  currentQ.options.forEach((optText, optIdx) => {
    let styles = "bg-white border-2 border-slate-200 text-slate-800 hover:border-indigo-300";
    let icon = `<span class="w-7 h-7 rounded-xl border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-600 shrink-0">${String.fromCharCode(65 + optIdx)}</span>`;

    if (isAnswered) {
      if (optIdx === currentQ.correctIndex) {
        styles = "bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold shadow-sm";
        icon = `<span class="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0">✓</span>`;
      } else if (optIdx === selectedIdx) {
        styles = "bg-rose-50 border-2 border-rose-500 text-rose-950 font-bold shadow-sm";
        icon = `<span class="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-xs shrink-0">✕</span>`;
      } else {
        styles = "bg-slate-50 border border-slate-200 text-slate-400 opacity-60";
      }
    }

    html += `
      <button 
        data-option-index="${optIdx}" 
        ${isAnswered ? "disabled" : ""}
        class="quiz-option-choice-btn w-full p-4 my-1.5 rounded-2xl text-left font-medium active:scale-98 transition-all min-h-[48px] flex items-center gap-3 ${styles}">
        ${icon}
        <span class="text-base leading-snug flex-1">${optText}</span>
      </button>
    `;
  });

  html += `
      </div>
  `;

  // Explanation and Next button revealed upon selection
  if (isAnswered) {
    const isCorrect = selectedIdx === currentQ.correctIndex;
    html += `
      <div class="p-5 rounded-2xl mb-6 transition-all border ${
        isCorrect ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900' : 'bg-amber-50/90 border-amber-200 text-amber-900'
      }">
        <div class="flex items-center gap-2 font-black text-sm mb-1.5">
          <span>${isCorrect ? '🌟 Correct!' : '📖 Historical Explanation:'}</span>
        </div>
        <p class="text-sm leading-relaxed">${currentQ.explanation}</p>
      </div>

      <button 
        id="quizAdvanceQuestionBtn" 
        class="w-full min-h-[52px] px-5 py-3.5 my-1 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
        <span>${qIdx + 1 < questions.length ? 'Next Question →' : 'View Quiz Summary 🏆'}</span>
      </button>
    `;
  }

  html += `
    </div>
  `;

  container.innerHTML = html;

  if (!isAnswered) {
    container.querySelectorAll(".quiz-option-choice-btn").forEach(btn => {
      btn.addEventListener("click", () => {
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
    const advanceBtn = document.getElementById("quizAdvanceQuestionBtn");
    if (advanceBtn) {
      advanceBtn.addEventListener("click", () => {
        appState.activeQuizQuestionIndex++;
        appState.quizSelectedAnswer = null;
        appState.quizAnswerSubmitted = false;
        saveAppState();
        renderQuizView();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }
}

/**
 * Renders the Quiz completion screen and commits the unit completion to state.
 */
function renderQuizResults(container, unit, questions) {
  const total = questions.length;
  const correct = appState.quizCorrectAnswersCount;
  const scorePercent = total > 0 ? Math.round((correct / total) * 100) : 0;

  // Mark complete and update high score
  markUnitComplete(unit.unitId, scorePercent);

  let badge = "🌟 Master Historian!";
  let msg = "You demonstrated comprehensive mastery of this historical unit.";
  if (scorePercent < 100 && scorePercent >= 50) {
    badge = "📜 Scholar Pass!";
    msg = "Well done! You have a solid grasp of the core concepts.";
  } else if (scorePercent < 50) {
    badge = "🛡️ Keep Practicing!";
    msg = "Retake this quiz anytime to reinforce your learning and aim for 100%!";
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

      <h3 class="text-2xl font-black text-slate-900 mt-2 mb-1">
        ${badge}
      </h3>
      <p class="text-sm text-slate-600 max-w-sm mx-auto mb-6">
        ${msg}
      </p>

      <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 max-w-xs mx-auto">
        <div class="text-4xl font-black ${scorePercent >= 80 ? 'text-emerald-600' : 'text-indigo-600'}">
          ${scorePercent}%
        </div>
        <div class="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
          ${correct} of ${total} Correct
        </div>
      </div>

      <div class="space-y-3">
        <button 
          id="quizResultsNextUnitBtn" 
          class="w-full min-h-[50px] px-5 py-3.5 my-1 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-base rounded-2xl shadow-md transition-all">
          Next Unit →
        </button>

        <div class="flex items-center gap-3">
          <button 
            id="quizResultsRetakeBtn" 
            class="flex-1 min-h-[48px] px-3 py-2 border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl active:scale-98 transition-all">
            🔄 Retake Quiz
          </button>

          <button 
            id="quizResultsReturnUnitBtn" 
            class="flex-1 min-h-[48px] px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl active:scale-98 transition-all">
            Unit Text
          </button>
        </div>

        <button 
          id="quizResultsReturnHubBtn" 
          class="w-full min-h-[48px] text-slate-600 hover:text-slate-900 font-bold text-sm py-2">
          Return to Dashboard Hub
        </button>
      </div>
    </div>
  `;

  container.innerHTML = html;

  const curriculum = window.CURRICULUM_DATA || [];
  const nextUnitBtn = document.getElementById("quizResultsNextUnitBtn");
  if (nextUnitBtn) {
    const curMod = curriculum[appState.currentModuleIndex];
    if (appState.currentUnitIndex < (curMod.units || []).length - 1) {
      nextUnitBtn.onclick = () => navigateTo("unit", appState.currentModuleIndex, appState.currentUnitIndex + 1);
    } else if (appState.currentModuleIndex < curriculum.length - 1) {
      nextUnitBtn.onclick = () => navigateTo("unit", appState.currentModuleIndex + 1, 0);
    } else {
      nextUnitBtn.innerText = "🏆 Completed All Units! Back to Hub";
      nextUnitBtn.onclick = () => navigateTo("dashboard");
    }
  }

  const retakeBtn = document.getElementById("quizResultsRetakeBtn");
  if (retakeBtn) {
    retakeBtn.onclick = () => navigateTo("quiz", appState.currentModuleIndex, appState.currentUnitIndex);
  }

  const returnUnitBtn = document.getElementById("quizResultsReturnUnitBtn");
  if (returnUnitBtn) {
    returnUnitBtn.onclick = () => navigateTo("unit", appState.currentModuleIndex, appState.currentUnitIndex);
  }

  const returnHubBtn = document.getElementById("quizResultsReturnHubBtn");
  if (returnHubBtn) {
    returnHubBtn.onclick = () => navigateTo("dashboard");
  }
}

// ==========================================
// 7. Bootstrapping & Lifecycle Initialization
// ==========================================

function initApp() {
  hydrateAppState();

  // Attach global header back button
  const backBtn = document.getElementById("globalBackBtn");
  if (backBtn && typeof backBtn.addEventListener === "function") {
    backBtn.addEventListener("click", () => {
      if (appState.activeView === "quiz") {
        navigateTo("unit", appState.currentModuleIndex, appState.currentUnitIndex);
      } else {
        navigateTo("dashboard");
      }
    });
  }

  renderCurrentView();
}

// Auto-boot on DOM ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
}

// Expose routing helpers globally
if (typeof window !== "undefined") {
  window.navigateTo = navigateTo;
  window.renderDashboard = renderDashboard;
  window.renderCurrentView = renderCurrentView;
  window.saveAppState = saveAppState;
  window.markUnitComplete = markUnitComplete;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    appState,
    hydrateAppState,
    saveAppState,
    markUnitComplete,
    navigateTo,
    renderDashboard,
    renderCurrentView
  };
}
