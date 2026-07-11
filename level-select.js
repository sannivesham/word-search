(function () {
  // 1. Level Data built directly into the script to prevent timing errors
  const MODULE_LEVELS = [
    {
      id: 1,
      titleTelugu: "రామాయణ పాత్రలు",
      titleEnglish: "Ramayana Heroes",
      gridSize: "8×8",
      difficulty: "Easy"
    },
    {
      id: 2,
      titleTelugu: "వానర సేన",
      titleEnglish: "The Vanara Army",
      gridSize: "8×8",
      difficulty: "Easy"
    },
    {
      id: 3,
      titleTelugu: "ఇతిహాస నగరాలు",
      titleEnglish: "Epic Cities",
      gridSize: "10×10",
      difficulty: "Medium"
    },
    {
      id: 4,
      titleTelugu: "మహాభారత వీరులు",
      titleEnglish: "Mahabharata Warriors",
      gridSize: "10×10",
      difficulty: "Medium"
    },
    {
      id: 5,
      titleTelugu: "రామాయణ ఋషులు",
      titleEnglish: "Sages of Ramayana",
      gridSize: "8×8",
      difficulty: "Easy"
    },
    {
      id: 6,
      titleTelugu: "మహాభారత గురువులు",
      titleEnglish: "Gurus of Mahabharata",
      gridSize: "8×8",
      difficulty: "Easy"
    }
  ];

  function renderGrid() {
    const gridEl = document.getElementById("levelGrid");
    if (!gridEl) return;

    gridEl.innerHTML = "";

    MODULE_LEVELS.forEach((level) => {
      // Safe checking against the active Progress cloud bridge
      const isUnlocked = typeof window.Progress?.isUnlocked === "function" 
        ? window.Progress.isUnlocked(level.id) 
        : (level.id === 1);

      const progress = typeof window.Progress?.getLevelProgress === "function"
        ? window.Progress.getLevelProgress(level.id)
        : { completed: false, bestTime: null };

      const card = document.createElement(isUnlocked ? "a" : "div");
      card.className = `level-card ${isUnlocked ? "" : "locked"}`;
      
      if (isUnlocked) {
        // FIXED: Points to wordsearch.html instead of game.html
        card.href = `wordsearch.html?level=${level.id}`;
      }

      let innerHTML = `
        <div class="level-number">CHAPTER ${level.id}</div>
        <div class="level-title" style="font-weight: 600; font-size: 1.35rem; margin-bottom: 2px;">${level.titleTelugu}</div>
        <div class="level-subtitle" style="font-family: 'Cinzel', serif; font-size: 0.95rem; color: var(--gold); opacity: 0.85; margin-bottom: 12px;">(${level.titleEnglish})</div>
        <div class="level-meta" style="font-size: 0.85rem; opacity: 0.75;">
          <span>Grid: ${level.gridSize} · ${level.difficulty}</span>
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

  // Run immediately and set continuous backup intervals until the cloud sync completes loading
  renderGrid();
  setInterval(renderGrid, 500);
})();
