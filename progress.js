// Progress storage for Sannivesham Word Search
const Progress = (() => {
  const KEY = "sanniveshamWordSearchProgress";

  function loadAll() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveAll(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function getLevelProgress(levelId) {
    const all = loadAll();
    return all[levelId] || { completed: false, bestTimeSeconds: null };
  }

  function isUnlocked(levelId) {
    // Level 1 is always unlocked by default
    if (Number(levelId) === 1) return true;
    
    // Previous level must be completed to unlock the current one
    const prev = getLevelProgress(Number(levelId) - 1);
    return !!prev.completed;
  }

  function recordCompletion(levelId, timeSeconds) {
    const all = loadAll();
    const existing = all[levelId] || { completed: false, bestTimeSeconds: null };
    
    all[levelId] = {
      completed: true,
      bestTimeSeconds: existing.bestTimeSeconds
        ? Math.min(existing.bestTimeSeconds, timeSeconds)
        : timeSeconds
    };
    saveAll(all);
  }

  return { getLevelProgress, isUnlocked, recordCompletion };
})();
