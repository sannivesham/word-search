// Word Search Level Definitions
// Storing words as arrays of Telugu syllable units to support compound characters cleanly.
const LEVELS = [
  {
    id: 1,
    title: "రామాయణ పాత్రలు (Ramayana Heroes)",
    difficulty: "సులభం (Easy)",
    gridSize: 8,
    words: [
      { telugu: ["రా", "ము", "డు"], english: "RAMA" },
      { telugu: ["సీ", "త"], english: "SITA" },
      { telugu: ["ల", "క్ష్మ", "ణు", "డు"], english: "LAKSHMANA" },
      { telugu: ["భ", "ర", "తు", "డు"], english: "BHARATA" }
    ]
  },
  {
    id: 2,
    title: "వానర సేన (The Vanara Army)",
    difficulty: "సులభం (Easy)",
    gridSize: 8,
    words: [
      { telugu: ["హ", "ను", "మం", "తు", "డు"], english: "HANUMAN" },
      { telugu: ["సు", "గ్రీ", "వు", "డు"], english: "SUGRIVA" },
      { telugu: ["అం", "గ", "దు", "డు"], english: "ANGADA" },
      { telugu: ["జాం", "బ", "వం", "తు", "డు"], english: "JAMBAVANTA" }
    ]
  },
  {
    id: 3,
    title: "ఇతిహాస నగరాలు (Epic Cities)",
    difficulty: "మధ్యమం (Medium)",
    gridSize: 10,
    words: [
      { telugu: ["అ", "యో", "ధ్య"], english: "AYODHYA" },
      { telugu: ["లం", "క"], english: "LANKA" },
      { telugu: ["మి", "థి", "ల"], english: "MITHILA" },
      { telugu: ["కిష్", "కిం", "ధ"], english: "KISHKINDHA" }
    ]
  },
  {
    id: 4,
    title: "మహాభారత వీరులు (Mahabharata Warriors)",
    difficulty: "మధ్యమం (Medium)",
    gridSize: 10,
    words: [
      { telugu: ["కృష్", "ణూ", "డు"], english: "KRISHNA" },
      { telugu: ["అర్", "జు", "ను", "డు"], english: "ARJUNA" },
      { telugu: ["కర్", "ణు", "డు"], english: "KARNA" },
      { telugu: ["భీ", "ము", "డు"], english: "BHIMA" },
      { telugu: ["ధర్", "మ", "రా", "జు"], english: "YUDHISHTHIRA" }
    ]
  }
];

function getLevel(id) {
  return LEVELS.find(l => l.id === Number(id));
}
