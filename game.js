(function () {
  function getQueryLevel() {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("level")) || 1;
    return window.WORDSEARCH_LEVELS ? window.WORDSEARCH_LEVELS.find(l => l.id === id) : null;
  }

  const level = getQueryLevel();
  if (!level) {
    document.body.innerHTML = "<p style='padding:40px;color:#EDE3C8;'>Level context configuration missing.</p>";
    return;
  }

  const titleEl = document.getElementById("levelTitle");
  const subtitleEl = document.getElementById("levelSubtitle");
  if(titleEl) titleEl.textContent = `లెవెల్ ${level.id}: ${level.titleTelugu}`;
  if(subtitleEl) subtitleEl.textContent = `${level.gridSize}×${level.gridSize} · ${level.titleEnglish}`;

  const size = level.gridSize;
  const wordList = level.words;
  let discoveredWords = [];
  let isSelecting = false;
  let startCell = null;
  let gridMatrix = Array(size).fill(null).map(() => Array(size).fill(""));

  const teluguCharacters = ["అ", "ఆ", "ఇ", "ఈ", "ఉ", "ఊ", "క", "గ", "చ", "జ", "ట", "డ", "త", "ద", "న", "ప", "బ", "మ", "య", "ర", "ల", "వ", "స", "హ"];

  wordList.forEach((word) => {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 100) {
      const direction = Math.random() > 0.5 ? "H" : "V";
      const row = Math.floor(Math.random() * (direction === "V" ? (size - word.length) : size));
      const col = Math.floor(Math.random() * (direction === "H" ? (size - word.length) : size));

      let collision = false;
      for (let i = 0; i < word.length; i++) {
        const r = direction === "V" ? row + i : row;
        const c = direction === "H" ? col + i : col;
        if (gridMatrix[r][c] !== "" && gridMatrix[r][c] !== word[i]) {
          collision = true;
          break;
        }
      }

      if (!collision) {
        for (let i = 0; i < word.length; i++) {
          const r = direction === "V" ? row + i : row;
          const c = direction === "H" ? col + i : col;
          gridMatrix[r][c] = word[i];
        }
        placed = true;
      }
      attempts++;
    }
  });

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (gridMatrix[r][c] === "") {
        gridMatrix[r][c] = teluguCharacters[Math.floor(Math.random() * teluguCharacters.length)];
      }
    }
  }

  // Fallback Element Tracker to find whatever container selector is named
  const container = document.getElementById("gridContainer") || document.getElementById("grid") || document.getElementById("levelGrid");
  if (container) {
    container.style.display = "grid";
    container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    container.innerHTML = "";

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = document.createElement("div");
        cell.className = "word-cell";
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.textContent = gridMatrix[r][c];
        
        cell.style.display = "flex";
        cell.style.alignItems = "center";
        cell.style.justifyContent = "center";
        cell.style.cursor = "pointer";
        cell.style.userSelect = "none";
        
        cell.addEventListener("mousedown", () => handleStart(r, c));
        cell.addEventListener("mouseenter", () => handleMove(r, c));
        container.appendChild(cell);
      }
    }
  }

  document.addEventListener("mouseup", handleEnd);

  const wordBank = document.getElementById("wordBank");
  if (wordBank) {
    wordBank.innerHTML = "";
    wordList.forEach(w => {
      const item = document.createElement("div");
      item.className = "word-bank-item";
      item.id = `word-${w}`;
      item.textContent = w;
      wordBank.appendChild(item);
    });
  }

  function handleStart(r, c) {
    isSelecting = true;
    startCell = { r, c };
    updateHighlights(r, c);
  }

  function handleMove(r, c) {
    if (!isSelecting) return;
    updateHighlights(r, c);
  }

  function updateHighlights(currentR, currentC) {
    if(!container) return;
    const cells = container.querySelectorAll(".word-cell");
    cells.forEach(el => el.classList.remove("selecting"));

    const minR = Math.min(startCell.r, currentR);
    const maxR = Math.max(startCell.r, currentR);
    const minC = Math.min(startCell.c, currentC);
    const maxC = Math.max(startCell.c, currentC);

    if (startCell.r === currentR || startCell.c === currentC) {
      cells.forEach(el => {
        const r = Number(el.dataset.row);
        const c = Number(el.dataset.col);
        if (r >= minR && r <= maxR && c >= minC && c <= maxC) {
          el.classList.add("selecting");
        }
      });
    }
  }

  function handleEnd() {
    if (!isSelecting || !container) return;
    isSelecting = false;
    
    const selectedCells = container.querySelectorAll(".word-cell.selecting");
    let currentString = "";
    selectedCells.forEach(el => currentString += el.textContent);

    const reversedString = currentString.split("").reverse().join("");
    let foundWord = null;

    if (wordList.includes(currentString) && !discoveredWords.includes(currentString)) {
      foundWord = currentString;
    } else if (wordList.includes(reversedString) && !discoveredWords.includes(reversedString)) {
      foundWord = reversedString;
    }

    if (foundWord) {
      discoveredWords.push(foundWord);
      selectedCells.forEach(el => {
        el.classList.remove("selecting");
        el.classList.add("discovered");
      });
      const bankItem = document.getElementById(`word-${foundWord}`);
      if(bankItem) bankItem.classList.add("found");
      checkVictory();
    } else {
      selectedCells.forEach(el => el.classList.remove("selecting"));
    }
  }

  function checkVictory() {
    if (discoveredWords.length === wordList.length) {
      if (window.Progress && typeof window.Progress.recordCompletion === "function") {
        window.Progress.recordCompletion(level.id, 0);
      }
      const overlay = document.getElementById("winOverlay");
      if(overlay) overlay.classList.remove("hidden");
    }
  }
})();
