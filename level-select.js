(function () {
  const WORDSEARCH_MODULE_LEVELS = [
    { id: 1, titleTelugu: "అయోధ్య ద్వారం", titleEnglish: "Ayodhya's Gate", gridSize: 8, difficulty: "Easy" },
    { id: 2, titleTelugu: "పంచవటి వనం", titleEnglish: "Panchavati Grove", gridSize: 8, difficulty: "Easy" },
    { id: 3, titleTelugu: "చిత్రకూట ఆశ్రమం", titleEnglish: "Chitrakoot Hermitage", gridSize: 8, difficulty: "Easy" },
    { id: 4, titleTelugu: "కిష్కింధ సభ", titleEnglish: "Kishkindha Court", gridSize: 8, difficulty: "Easy" },
    { id: 5, titleTelugu: "లంకా ప్రాకారం", titleEnglish: "Lanka's Ramparts", gridSize: 10, difficulty: "Medium" },
    { id: 6, titleTelugu: "అశోక వనం", titleEnglish: "Ashoka Vatika", gridSize: 10, difficulty: "Medium" },
    { id: 7, titleTelugu: "శబరి కుటీరం", titleEnglish: "Sabari's Cottage", gridSize: 10, difficulty: "Medium" },
    { id: 8, titleTelugu: "ఋశ్యమూక పర్వతం", titleEnglish: "Rishyamuka Hill", gridSize: 10, difficulty: "Medium" },
    { id: 9, titleTelugu: "దండకారణ్యం", titleEnglish: "Dandaka Forest", gridSize: 12, difficulty: "Hard" },
    { id: 10, titleTelugu: "మిథిలా నగరం", titleEnglish: "Mithila Kingdom", gridSize: 12, difficulty: "Hard" },
    { id: 11, titleTelugu: "క్షీర సాగరం", titleEnglish: "Cosmic Ocean", gridSize: 12, difficulty: "Hard" },
    { id: 12, titleTelugu: "శ్రీరామ సామ్రాజ్యం", titleEnglish: "Rama's Empire", gridSize: 12, difficulty: "Hard" }
  ];

  function renderGrid() {
    const gridEl = document.getElementById("levelGrid") || document.getElementById("grid");
    if (!gridEl) return;

    gridEl.innerHTML = "";

    WORDSEARCH_MODULE_LEVELS.forEach((level) => {
      const isUnlocked = typeof window.Progress?.isUnlocked === "function" 
        ? window.Progress.isUnlocked(level.id) 
        : (level.id === 1);

      const progress = typeof window.Progress?.getLevelProgress === "function"
        ? window.Progress.getLevelProgress(level.id)
        : { completed: false, bestTime: null };

      const card = document.createElement(isUnlocked ? "a" : "div");
      card.className = `level-card ${isUnlocked ? "" : "locked"}`;
      
      if (isUnlocked) {
        card.href = `game.html?level=${level.id}`;
      }

      let innerHTML = `
        <div class="level-number">LEVEL ${level.id}</div>
        <div class="level-title" style="font-weight: 600; font-size: 1.35rem; margin-bottom: 2px;">${level.titleTelugu}</div>
        <div class="level-subtitle" style="font-family: 'Cinzel', serif; font-size: 0.95rem; color: var(--gold); opacity: 0.85; margin-bottom: 12px;">(${level.titleEnglish})</div>
        <div class="level-meta" style="font-size: 0.85rem; opacity: 0.75;">
          <span>Grid: ${level.gridSize}×${level.gridSize} · ${level.difficulty}</span>
      `;

      if (progress.completed && progress.bestTime) {
        innerHTML += `<span> · Best: ${progress.bestTime}</span>`;
      }

      innerHTML += `</div>`;

      if (!isUnlocked) {
        innerHTML += `<div class="level-lock-icon" style="position: absolute; top: 20px; right: 20px;">🔒</div>`;
      }

      card.innerHTML = innerHTML;
      gridEl.appendChild(card);
    });
  }

  renderGrid();
  setInterval(renderGrid, 500);
})();
