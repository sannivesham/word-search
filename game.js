(function () {
  const params = new URLSearchParams(window.location.search);
  const levelId = Number(params.get("level")) || 1;
  const level = getLevel(levelId);

  if (!level) {
    document.body.innerHTML = "<p style='padding:40px;color:#EDE3C8;'>Chapter not found.</p>";
    return;
  }
  if (!Progress.isUnlocked(levelId)) {
    window.location.href = "index.html";
    return;
  }

  const { title, difficulty, gridSize, words } = level;
  
  // Grid tracking matrices
  let gridMatrix = [];
  let foundWords = new Set();
  let selectedCells = []; // Tracks the current drag coordinates [{r, c}, ...]
  let isDragging = false;
  let dragStartCell = null;

  // Clock variables
  let seconds = 0;
  let timerHandle = null;
  let solved = false;

  // Setup DOM headers
  document.getElementById("gameTitle").textContent = `చాప్టర్ ${level.id}: ${title}`;
  document.getElementById("gameSubtitle").textContent = `కఠినత్వం: ${difficulty} · గడులు: ${gridSize}×${gridSize}`;

  const gridEl = document.getElementById("wordsearchGrid");
  const wordItemsEl = document.getElementById("wordItems");
  const timerEl = document.getElementById("timer");
  const matchCountEl = document.getElementById("matchCount");

  // Telugu filler pool containing standard independent syllables to pack space cleanly
  const TELUGU_FILLER = ["క", "న", "మ", "ర", "స", "త", "ల", "వ", "ధ", "జ", "భ", "గ", "చ", "ప", "డ", "రు"];

  function formatTime(s) {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  }

  function startTimer() {
    timerHandle = setInterval(() => {
      seconds++;
      timerEl.textContent = formatTime(seconds);
    }, 1000);
  }

  // --- Grid Matrix Generation Engine ---
  function initGrid() {
    // Generate empty matrix shell
    gridMatrix = Array(gridSize).fill(null).map(() => Array(gridSize).fill(""));

    // Directions: Horizontal (East), Vertical (South), Diagonal (Southeast)
    const directions = [
      { r: 0, c: 1 },
      { r: 1, c: 0 },
      { r: 1, c: 1 }
    ];

    words.forEach(wordObj => {
      const syllableArray = wordObj.telugu;
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 100) {
        attempts++;
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const startR = Math.floor(Math.random() * gridSize);
        const startC = Math.floor(Math.random() * gridSize);

        // Check if word fits inside board constraints
        if (
          startR + dir.r * (syllableArray.length - 1) >= gridSize ||
          startC + dir.c * (syllableArray.length - 1) >= gridSize
        ) {
          continue;
        }

        // Check for character collisions
        let canPlace = true;
        for (let i = 0; i < syllableArray.length; i++) {
          const currR = startR + dir.r * i;
          const currC = startC + dir.c * i;
          if (gridMatrix[currR][currC] !== "" && gridMatrix[currR][currC] !== syllableArray[i]) {
            canPlace = false;
            break;
          }
        }

        // Commit placement if space matches perfectly
        if (canPlace) {
          for (let i = 0; i < syllableArray.length; i++) {
            gridMatrix[startR + dir.r * i][startC + dir.c * i] = syllableArray[i];
          }
          placed = true;
        }
      }
    });

    // Populate remaining empty items using random Telugu filler characters
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (gridMatrix[r][c] === "") {
          gridMatrix[r][c] = TELUGU_FILLER[Math.floor(Math.random() * TELUGU_FILLER.length)];
        }
      }
    }
  }

  function buildGridUI() {
    gridEl.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gridEl.innerHTML = "";

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cell = document.createElement("div");
        cell.className = "ws-cell";
        cell.textContent = gridMatrix[r][c];
        cell.dataset.r = r;
        cell.dataset.c = c;

        // Mouse Interactivity
        cell.addEventListener("mousedown", (e) => startDrag(r, c));
        cell.addEventListener("mouseenter", (e) => continueDrag(r, c));

        gridEl.appendChild(cell);
      }
    }

    // Global drag cancellation mechanics
    window.addEventListener("mouseup", endDrag);

    // Touch Support for Mobile devices
    gridEl.addEventListener("touchstart", handleTouchStart, { passive: false });
    gridEl.addEventListener("touchmove", handleTouchMove, { passive: false });
    gridEl.addEventListener("touchend", handleTouchEnd, { passive: false });
  }

  function buildWordListUI() {
    wordItemsEl.innerHTML = "";
    words.forEach(wordObj => {
      const fullWordText = wordObj.telugu.join("");
      const div = document.createElement("div");
      div.className = `word-item ${foundWords.has(fullWordText) ? "found" : ""}`;
      div.id = `word-${fullWordText}`;
      div.innerHTML = `
        <span>${fullWordText}</span>
        <span class="en-hint">(${wordObj.english})</span>
      `;
      wordItemsEl.appendChild(div);
    });
    matchCountEl.textContent = `${foundWords.size}/${words.length}`;
  }

  // --- Interaction Mechanics Selection Logic ---
  function startDrag(r, c) {
    if (solved) return;
    isDragging = true;
    dragStartCell = { r, c };
    selectPath(r, c);
  }

  function continueDrag(r, c) {
    if (!isDragging || solved || !dragStartCell) return;
    
    // Calculate vector directions to snap coordinate selection along straight grid lines
    const dR = r - dragStartCell.r;
    const dC = c - dragStartCell.c;
    
    let stepR = 0;
    let stepC = 0;

    if (dR === 0 && dC !== 0) { // Horizontal snap
      stepC = Math.sign(dC);
    } else if (dC === 0 && dR !== 0) { // Vertical snap
      stepR = Math.sign(dR);
    } else if (Math.abs(dR) === Math.abs(dC) && dR !== 0) { // Diagonal snap
      stepR = Math.sign(dR);
      stepC = Math.sign(dC);
    } else {
      return; // Ignore non-linear adjustments
    }

    // Clear active trail and step through components linearly
    selectedCells = [];
    let currR = dragStartCell.r;
    let currC = dragStartCell.c;
    const targets = Math.max(Math.abs(dR), Math.abs(dC)) + 1;

    for (let i = 0; i < targets; i++) {
      selectedCells.push({ r: currR, c: currC });
      currR += stepR;
      currC += stepC;
    }

    renderSelectionHighlights();
  }

  function selectPath(r, c) {
    selectedCells = [{ r, c }];
    renderSelectionHighlights();
  }

  function renderSelectionHighlights() {
    // Reset standard grid overlays
    const cells = gridEl.querySelectorAll(".ws-cell");
    cells.forEach(cell => cell.classList.remove("selected"));

    // Apply color markers to active cells
    selectedCells.forEach(coord => {
      const cellEl = gridEl.querySelector(`.ws-cell[data-r="${coord.r}"][data-c="${coord.c}"]`);
      if (cellEl) cellEl.classList.add("selected");
    });
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;

    if (selectedCells.length > 0) {
      // Assemble characters forwards
      let textForward = selectedCells.map(coord => gridMatrix[coord.r][coord.c]).join("");
      // Assemble characters backwards (supports reverse selections automatically)
      let textBackward = [...selectedCells].reverse().map(coord => gridMatrix[coord.r][coord.c]).join("");

      let matchedWord = null;
      words.forEach(w => {
        const joined = w.telugu.join("");
        if (joined === textForward || joined === textBackward) {
          matchedWord = joined;
        }
      });

      if (matchedWord && !foundWords.has(matchedWord)) {
        foundWords.add(matchedWord);
        
        // Pin visual markers permanently
        selectedCells.forEach(coord => {
          const cellEl = gridEl.querySelector(`.ws-cell[data-r="${coord.r}"][data-c="${coord.c}"]`);
          if (cellEl) cellEl.classList.add("permanent-found");
        });

        buildWordListUI();
        checkWinCondition();
      }
    }

    selectedCells = [];
    renderSelectionHighlights();
  }

  // --- Mobile Touch Events Normalizer Engine ---
  function getTouchCell(touchEvent) {
    const touch = touchEvent.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.classList.contains("ws-cell")) {
      return {
        r: Number(element.dataset.r),
        c: Number(element.dataset.c)
      };
    }
    return null;
  }

  function handleTouchStart(e) {
    const cell = getTouchCell(e);
    if (cell) {
      e.preventDefault();
      startDrag(cell.r, cell.c);
    }
  }

  function handleTouchMove(e) {
    const cell = getTouchCell(e);
    if (cell) {
      e.preventDefault();
      continueDrag(cell.r, cell.c);
    }
  }

  function handleTouchEnd(e) {
    endDrag();
  }

  // --- Win State Verification Mechanics ---
  function checkWinCondition() {
    if (foundWords.size === words.length) {
      solved = true;
      clearInterval(timerHandle);

      Progress.recordCompletion(level.id, seconds);

      document.getElementById("winTime").textContent = `సమయం: ${formatTime(seconds)}`;
      document.getElementById("winOverlay").classList.remove("hidden");

      const nextBtn = document.getElementById("nextLevelBtn");
      const nextLevel = getLevel(level.id + 1);
      if (nextLevel) {
        nextBtn.style.display = "inline-block";
        nextBtn.onclick = () => {
          window.location.href = `wordsearch.html?level=${nextLevel.id}`;
        };
      } else {
        nextBtn.style.display = "none";
      }
    }
  }

  // Execute on runtime
  initGrid();
  buildGridUI();
  buildWordListUI();
  startTimer();
})();
