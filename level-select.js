(function () {
  const gridEl = document.getElementById("levelGrid");
  if (!gridEl) return;

  gridEl.innerHTML = "";

  LEVELS.forEach((level) => {
    const isUnlocked = Progress.isUnlocked(level.id);
    const progress = Progress.getLevelProgress(level.id);

    const card = document.createElement(isUnlocked ? "a" : "div");
    card.className = `level-card ${isUnlocked ? "" : "locked"}`;
    
    if (isUnlocked) {
      card.href = `wordsearch.html?level=${level.id}`;
    }

    // Prepare a clean list preview of words for children/parents to see
    const previewText = level.words.map(w => w.telugu.join("")).join(", ");

    let innerHTML = `
      <div class="level-number">చాప్టర్ ${level.id}</div>
      <div class="level-title">${level.title}</div>
      <div class="level-meta">
        <span><strong>కఠినత్వం:</strong> ${level.difficulty}</span>
        <span><strong>గడులు:</strong> ${level.gridSize}×${level.gridSize}</span>
    `;

    if (progress.completed && progress.bestTimeSeconds !== null) {
      const m = String(Math.floor(progress.bestTimeSeconds / 60)).padStart(2, "0");
      const s = String(progress.bestTimeSeconds % 60).padStart(2, "0");
      innerHTML += `<span><strong>ఉత్తమ సమయం:</strong> ${m}:${s}</span>`;
    }

    innerHTML += `
      </div>
      <div class="level-words-preview">${previewText}</div>
    `;

    if (!isUnlocked) {
      innerHTML += `<div class="level-lock-icon">🔒</div>`;
    }

    card.innerHTML = innerHTML;
    gridEl.appendChild(card);
  });
})();
