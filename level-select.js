(function () {
  // Safe helper execution initialization loop
  function renderGrid() {
    const gridEl = document.getElementById("levelGrid");
    if (!gridEl) return;

    gridEl.innerHTML = "";
    
    // Read clean global window arrays
    const levelsArray = window.LEVELS || [];

    if (levelsArray.length === 0) {
      console.warn("Sannivesham levels configuration array data not detected yet.");
      return;
    }

    levelsArray.forEach((level) => {
      // Graceful checking fallback rules built safely for asynchronous state cycles
      const isUnlocked = typeof window.Progress?.isUnlocked === "function" 
        ? window.Progress.isUnlocked(level.id) 
        : (level.id === 1);

      const progress = typeof window.Progress?.getLevelProgress === "function"
        ? window.Progress.getLevelProgress(level.id)
        : { completed: false, bestTime: null, bestMoves: null };

      const card = document.createElement(isUnlocked ? "a" : "div");
      card.className = `level-card ${isUnlocked ? "" : "locked"}`;
      
      if (isUnlocked) {
        // Adapt clean custom parameters dynamically matching respective folder systems
        const path = window.location.pathname;
        if (path.includes("Sliding-Puzzle")) {
          card.href = `puzzle.html?level=${level.id}`;
        } else {
          card.href = `game.html?level=${level.id}`;
        }
      }

      // Safe identification attributes check
      const hasBilingual = level.titleTelugu && level.titleEnglish;
      const displayTitle = hasBilingual ? level.titleTelugu : (level.title || "");
      const extraSubtitle = hasBilingual ? `(${level.titleEnglish})` : `(${level.difficulty || "Easy"})`;

      let innerHTML = `
        <div class="level-number">CHAPTER ${level.id}</div>
        <div class="level-title" style="font-weight: 600; font-size: 1.35rem; margin-bottom: 2px;">${displayTitle}</div>
        <div class="level-subtitle" style="font-family: 'Cinzel', serif; font-size: 0.95rem; color: var(--gold); opacity: 0.85; margin-bottom: 12px;">${extraSubtitle}</div>
        <div class="level-meta" style="font-size: 0.85rem; opacity: 0.75;">
          <span>Grid: ${level.gridSize || level.size || '3×3'}</span>
      `;

      if (progress.completed) {
        const scoreShow = progress.bestTime || progress.bestMoves || "Done";
        innerHTML += `<span> · ⭐ Best: ${scoreShow}</span>`;
      }

      innerHTML += `</div>`;

      if (!isUnlocked) {
        innerHTML += `<div class="level-lock-icon" style="position: absolute; top: 20px; right: 20px;">🔒</div>`;
      }

      card.innerHTML = innerHTML;
      gridEl.appendChild(card);
    });
  }

  // 1. First immediate render try cycle
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(renderGrid, 100);
  } else {
    window.addEventListener("DOMContentLoaded", renderGrid);
  }

  // 2. Secondary listener trigger keeping rendering perfect after asynchronous Firebase login verification checks finish
  if (window.auth) {
    window.auth.onAuthStateChanged(() => {
      setTimeout(renderGrid, 500);
    });
  } else {
    // Standard delay backup mapping safely if auth script sequence triggers early
    setTimeout(renderGrid, 600);
    setTimeout(renderGrid, 1500);
  }
})();
