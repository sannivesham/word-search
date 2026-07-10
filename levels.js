// Word Search Level Definitions (12 Levels Complete Dataset)
// Storing words as arrays of Telugu syllable units to support compound characters cleanly.
const LEVELS = [
  {
    id: 1,
    title: "రామాయణ పాత్రలు (Ramayana Heroes)",
    difficulty: "సులభం (Easy)",
    gridSize: 8,
    words: [
      { telugu: ["రా", "ము", "డు"], english: "RAMA" },
      { telugu: ["シー", "త"], english: "SITA" },
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
      { telugu: ["హ", "nu", "మం", "తు", "డు"], english: "HANUMAN" },
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
      { telugu: ["అర్", "జు", "nu", "డు"], english: "ARJUNA" },
      { telugu: ["కర్", "ణు", "డు"], english: "KARNA" },
      { telugu: ["భీ", "ము", "డు"], english: "BHIMA" }
    ]
  },
  {
    id: 5,
    title: "రామాయణ ఋషులు (Sages of Ramayana)",
    difficulty: "సులభం (Easy)",
    gridSize: 8,
    words: [
      { telugu: ["వా", "ల్మీ", "కి"], english: "VALMIKI" },
      { telugu: ["వ", "సి", "ష్ఠు", "డు"], english: "VASISTHA" },
      { telugu: ["వి", "శ్వా", "మి", "త్రు", "డు"], english: "VISHWAMITRA" },
      { telugu: ["అ", "త్రి"], english: "ATRI" }
    ]
  },
  {
    id: 6,
    title: "మహాభారత గురువులు (Gurus of Mahabharata)",
    difficulty: "సులభం (Easy)",
    gridSize: 8,
    words: [
      { telugu: ["ద్రో", "ణు", "డు"], english: "DRONA" },
      { telugu: ["కృ", "పా", "చా", "ర్యు", "లు"], english: "KRIPA" },
      { telugu: ["భీ", "ష్ము", "డు"], english: "BHISHMA" },
      { telugu: ["వ్యా", "సు", "డు"], english: "VYASA" }
    ]
  },
  {
    id: 7,
    title: "దివ్య ఆయుధాలు (Divine Weapons)",
    difficulty: "మధ్యమం (Medium)",
    gridSize: 10,
    words: [
      { telugu: ["గాం", "డీ", "వం"], english: "GANDIVA" },
      { telugu: ["బ్రహ్", "మా", "స్త్రం"], english: "BRAHMASTRA" },
      { telugu: ["సు", "దర్", "శ", "న", "చ", "క్రం"], english: "SUDARSHANA" },
      { telugu: ["పా", "శు", "ప", "తా", "స్త్రం"], english: "PASHUPATA" }
    ]
  },
  {
    id: 8,
    title: "మహాభారత సామ్రాజ్యాలు (Epic Kingdoms)",
    difficulty: "మధ్యమం (Medium)",
    gridSize: 10,
    words: [
      { telugu: ["హ", "స్తి", "నా", "పు", "రం"], english: "HASTINAPURA" },
      { telugu: ["ఇం", "ద్ర", "ప్ర", "స్థ"], english: "INDRAPRASTHA" },
      { telugu: ["ద్వా", "ర", "క"], english: "DVARAKA" },
      { telugu: ["పాం", "చా", "లం"], english: "PANCHALA" }
    ]
  },
  {
    id: 9,
    title: "కౌరవ ప్రముఖులు (Prominent Kauravas)",
    difficulty: "కఠినం (Hard)",
    gridSize: 12,
    words: [
      { telugu: ["దుర్", "యో", "ధ", "ను", "డు"], english: "DURYODHANA" },
      { telugu: ["దుశ్", "శా", "స", "ను", "డు"], english: "DUSSHASANA" },
      { telugu: ["శ", "కు", "ని"], english: "SHAKUNI" },
      { telugu: ["వి", "కర్", "ణు", "డు"], english: "VIKARNA" }
    ]
  },
  {
    id: 10,
    title: "పుణ్య నదులు (Sacred Rivers of Epics)",
    difficulty: "కఠినం (Hard)",
    gridSize: 12,
    words: [
      { telugu: ["గం", "గ"], english: "GANGA" },
      { telugu: ["య", "ము", "న"], english: "YAMUNA" },
      { telugu: ["గో", "దా", "వ", "రి"], english: "GODAVARI" },
      { telugu: ["స", "ర", "యూ"], english: "SARAYU" }
    ]
  },
  {
    id: 11,
    title: "రాక్షస ప్రముఖులు (Mighty Asuras)",
    difficulty: "కఠినం (Hard)",
    gridSize: 12,
    words: [
      { telugu: ["రా", "వ", "ణా", "సు", "రు", "డు"], english: "RAVANA" },
      { telugu: ["कुం", "భ", "కర్", "ణు", "డు"], english: "KUMBHAKARNA" },
      { telugu: ["వి", "భీ", "ష", "ణు", "డు"], english: "VIBHISHANA" },
      { telugu: ["ఇం", "ద్ర", "జి", "త్తు"], english: "INDRAJIT" }
    ]
  },
  {
    id: 12,
    title: "ఇతిహాస నారీమణులు (Noble Women of Epics)",
    difficulty: "కఠినం (Hard)",
    gridSize: 12,
    words: [
      { telugu: ["ద్రౌ", "ప", "ది"], english: "DRAUPADI" },
      { telugu: ["कुం", "తీ", "దే", "వి"], english: "KUNTI" },
      { telugu: ["గాం", "ధా", "రి"], english: "GANDHARI" },
      { telugu: ["మం", "డో", "ద", "రి"], english: "MANDODARI" }
    ]
  }
];

function getLevel(id) {
  return LEVELS.find(l => l.id === Number(id));
}
