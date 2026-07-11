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

  document.getElementById("levelTitle").textContent = `లెవెల్ ${level.id}: ${level.titleTelugu}`;
  document.getElementById("levelSubtitle").textContent = `${level.gridSize}×${level.gridSize} · ${level.titleEnglish}`;

  const size = level.gridSize;
  const wordList = level.words;
  let discoveredWords = [];
  let isSelecting = false;
  let startCell = null;
  let gridMatrix = Array(size).fill(null).map(() => Array(size).fill(""));

  const teluguCharacters = ["అ", "ఆ", "ఇ", "ఈ", "ఉ", "ఊ", "ఋ", "ఎ", "ఏ", "ఐ", "ఒ", "ఓ", "ఔ", "క", "ఖ", "గ", "ఘ", "చ", "ఛ", "జ", "ఝ", "ట", "ఠ", "డ", "ఢ", "త", "థ", "ద", "ధ", "న", "ప", "ఫ", "బ", "భ", "మ", "య", "ర", "ల", "వ", "శ", "ష", "స", "హ", "ళ", "క్ష", "ఱ"];

  // Inject target strings into the matrix arrays horizontally and vertically
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

  // Fill remaining null indices with random characters
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (gridMatrix[r][c] === "") {
        gridMatrix[r][c] = teluguCharacters[Math.floor(Math.random() * teluguCharacters.length)];
      }
    }
  }

  // Draw Game UI Grid Node Systems
  const container = document.getElementById("gridContainer");
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  container.innerHTML = "";

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement("div");
      cell.className = "word-cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.textContent = gridMatrix[r][c];
      
      cell.addEventListener("mousedown", () => handleStart(r, c));
      cell.addEventListener("mouseenter", () => handleMove(r, c));
      container.appendChild(cell);
    }
  }

  document.addEventListener("mouseup", handleEnd);

  const wordBank = document.getElementById("wordBank");
  wordBank.innerHTML = "";
  wordList.forEach(w => {
    const item = document.createElement("div");
    item.className = "word-bank-item";
    item.id = `word-${w}`;
    item.textContent = w;
    wordBank.appendChild(item);
  });

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
    if (!isSelecting) return;
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
      document.getElementById(`word-${foundWord}`).classList.add("found");
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
      document.getElementById("winOverlay").classList.remove("hidden");
    }
  }
})();
