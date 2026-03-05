export type TarotCard = {
  id: number;
  name: string;
  nameFr: string;
  arcana: "major" | "minor";
  suit?: "wands" | "cups" | "swords" | "pentacles";
  number: number;
  keywords: string[];
  upright: string;
  reversed: string;
  symbol: string; // SVG symbol key
};

export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 0,
    name: "The Fool",
    nameFr: "Le Fou",
    arcana: "major",
    number: 0,
    keywords: ["beginnings", "innocence", "spontaneity", "free spirit"],
    upright:
      "New beginnings, innocence, adventure, idealism, taking a leap of faith",
    reversed: "Recklessness, risk-taking, naivety, foolishness",
    symbol: "fool",
  },
  {
    id: 1,
    name: "The Magician",
    nameFr: "Le Magicien",
    arcana: "major",
    number: 1,
    keywords: ["manifestation", "resourcefulness", "power", "inspired action"],
    upright:
      "Manifestation, resourcefulness, power, inspired action, willpower",
    reversed: "Manipulation, poor planning, untapped talents",
    symbol: "magician",
  },
  {
    id: 2,
    name: "The High Priestess",
    nameFr: "La Grande Prêtresse",
    arcana: "major",
    number: 2,
    keywords: ["intuition", "mystery", "inner voice", "subconscious"],
    upright: "Intuition, sacred knowledge, divine feminine, inner voice",
    reversed: "Secrets, disconnected from intuition, withdrawal",
    symbol: "highpriestess",
  },
  {
    id: 3,
    name: "The Empress",
    nameFr: "L'Impératrice",
    arcana: "major",
    number: 3,
    keywords: ["femininity", "beauty", "nature", "nurturing", "abundance"],
    upright: "Femininity, beauty, nature, nurturing, abundance, fertility",
    reversed: "Creative block, dependence on others, smothering",
    symbol: "empress",
  },
  {
    id: 4,
    name: "The Emperor",
    nameFr: "L'Empereur",
    arcana: "major",
    number: 4,
    keywords: ["authority", "structure", "control", "fatherhood"],
    upright: "Authority, establishment, structure, a father figure",
    reversed: "Tyranny, rigidity, coldness",
    symbol: "emperor",
  },
  {
    id: 5,
    name: "The Hierophant",
    nameFr: "Le Hiérophante",
    arcana: "major",
    number: 5,
    keywords: ["spiritual wisdom", "tradition", "conformity", "morality"],
    upright: "Spiritual wisdom, religious beliefs, conformity, tradition",
    reversed: "Personal beliefs, freedom, challenging the status quo",
    symbol: "hierophant",
  },
  {
    id: 6,
    name: "The Lovers",
    nameFr: "Les Amoureux",
    arcana: "major",
    number: 6,
    keywords: ["love", "harmony", "relationships", "values", "choices"],
    upright: "Love, harmony, relationships, values alignment, choices",
    reversed: "Self-love, disharmony, imbalance, misaligned values",
    symbol: "lovers",
  },
  {
    id: 7,
    name: "The Chariot",
    nameFr: "Le Chariot",
    arcana: "major",
    number: 7,
    keywords: ["control", "willpower", "success", "determination"],
    upright: "Control, willpower, success, action, determination",
    reversed: "Self-discipline, opposition, lack of direction",
    symbol: "chariot",
  },
  {
    id: 8,
    name: "Strength",
    nameFr: "La Force",
    arcana: "major",
    number: 8,
    keywords: ["strength", "courage", "patience", "control", "compassion"],
    upright: "Strength, courage, persuasion, influence, compassion",
    reversed: "Inner strength, self-doubt, low energy, raw emotion",
    symbol: "strength",
  },
  {
    id: 9,
    name: "The Hermit",
    nameFr: "L'Ermite",
    arcana: "major",
    number: 9,
    keywords: ["soul-searching", "introspection", "inner guidance", "solitude"],
    upright: "Soul-searching, introspection, being alone, inner guidance",
    reversed: "Isolation, loneliness, withdrawal",
    symbol: "hermit",
  },
  {
    id: 10,
    name: "Wheel of Fortune",
    nameFr: "La Roue de Fortune",
    arcana: "major",
    number: 10,
    keywords: ["good luck", "karma", "life cycles", "destiny", "turning point"],
    upright: "Good luck, karma, life cycles, destiny, turning point",
    reversed: "Bad luck, resistance to change, breaking cycles",
    symbol: "wheel",
  },
  {
    id: 11,
    name: "Justice",
    nameFr: "La Justice",
    arcana: "major",
    number: 11,
    keywords: ["justice", "fairness", "truth", "cause and effect", "law"],
    upright: "Justice, fairness, truth, cause and effect, law",
    reversed: "Unfairness, lack of accountability, dishonesty",
    symbol: "justice",
  },
  {
    id: 12,
    name: "The Hanged Man",
    nameFr: "Le Pendu",
    arcana: "major",
    number: 12,
    keywords: ["pause", "surrender", "letting go", "new perspectives"],
    upright: "Pause, surrender, letting go, new perspectives",
    reversed: "Delays, resistance, stalling, indecision",
    symbol: "hangedman",
  },
  {
    id: 13,
    name: "Death",
    nameFr: "La Mort",
    arcana: "major",
    number: 13,
    keywords: ["endings", "change", "transformation", "transition"],
    upright: "Endings, change, transformation, transition",
    reversed: "Resistance to change, personal transformation, inner purging",
    symbol: "death",
  },
  {
    id: 14,
    name: "Temperance",
    nameFr: "La Tempérance",
    arcana: "major",
    number: 14,
    keywords: ["balance", "moderation", "patience", "purpose"],
    upright: "Balance, moderation, patience, purpose",
    reversed: "Imbalance, excess, self-healing, realignment",
    symbol: "temperance",
  },
  {
    id: 15,
    name: "The Devil",
    nameFr: "Le Diable",
    arcana: "major",
    number: 15,
    keywords: ["shadow self", "attachment", "addiction", "restriction"],
    upright: "Shadow self, attachment, addiction, restriction, sexuality",
    reversed: "Releasing limiting beliefs, exploring dark thoughts, detachment",
    symbol: "devil",
  },
  {
    id: 16,
    name: "The Tower",
    nameFr: "La Tour",
    arcana: "major",
    number: 16,
    keywords: ["sudden change", "upheaval", "chaos", "revelation", "awakening"],
    upright: "Sudden change, upheaval, chaos, revelation, awakening",
    reversed: "Personal transformation, fear of change, averting disaster",
    symbol: "tower",
  },
  {
    id: 17,
    name: "The Star",
    nameFr: "L'Étoile",
    arcana: "major",
    number: 17,
    keywords: ["hope", "faith", "purpose", "renewal", "spirituality"],
    upright: "Hope, faith, purpose, renewal, spirituality",
    reversed: "Lack of faith, despair, self-trust, disconnection",
    symbol: "star",
  },
  {
    id: 18,
    name: "The Moon",
    nameFr: "La Lune",
    arcana: "major",
    number: 18,
    keywords: ["illusion", "fear", "the unconscious", "confusion"],
    upright:
      "Illusion, fear, the unconscious, confusion, complexity, secrets",
    reversed: "Release of fear, repressed emotion, inner confusion",
    symbol: "moon",
  },
  {
    id: 19,
    name: "The Sun",
    nameFr: "Le Soleil",
    arcana: "major",
    number: 19,
    keywords: ["positivity", "fun", "warmth", "success", "vitality"],
    upright: "Positivity, fun, warmth, success, vitality, joy",
    reversed: "Inner child, feeling down, overly optimistic",
    symbol: "sun",
  },
  {
    id: 20,
    name: "Judgement",
    nameFr: "Le Jugement",
    arcana: "major",
    number: 20,
    keywords: ["judgement", "rebirth", "inner calling", "absolution"],
    upright: "Judgement, rebirth, inner calling, absolution",
    reversed: "Self-doubt, inner critic, ignoring the call",
    symbol: "judgement",
  },
  {
    id: 21,
    name: "The World",
    nameFr: "Le Monde",
    arcana: "major",
    number: 21,
    keywords: ["completion", "integration", "accomplishment", "travel"],
    upright: "Completion, integration, accomplishment, travel",
    reversed: "Seeking personal closure, short-cuts, delays",
    symbol: "world",
  },
];

function createMinorArcana(
  suit: "wands" | "cups" | "swords" | "pentacles",
  startId: number
): TarotCard[] {
  const suitData = {
    wands: {
      nameFr: "Bâtons",
      element: "fire",
      theme: "passion, creativity, ambition",
      upright: (n: string) => `${n} of creative energy, ambition, and inspiration`,
      reversed: (n: string) => `Blocked ${n.toLowerCase()}, delays, or frustration in creative endeavors`,
    },
    cups: {
      nameFr: "Coupes",
      element: "water",
      theme: "emotions, relationships, intuition",
      upright: (n: string) => `${n} of emotional fulfillment, relationships, and intuition`,
      reversed: (n: string) => `Emotional imbalance, repressed feelings, or relationship struggles`,
    },
    swords: {
      nameFr: "Épées",
      element: "air",
      theme: "intellect, conflict, truth",
      upright: (n: string) => `${n} of mental clarity, truth-seeking, and decisive action`,
      reversed: (n: string) => `Mental confusion, miscommunication, or unresolved conflict`,
    },
    pentacles: {
      nameFr: "Pentacles",
      element: "earth",
      theme: "material, work, stability",
      upright: (n: string) => `${n} of material security, work, and practical matters`,
      reversed: (n: string) => `Financial instability, lack of focus, or missed opportunities`,
    },
  };

  const numbers = [
    { n: 1, name: "Ace", nameFr: "As", roman: "I" },
    { n: 2, name: "Two", nameFr: "Deux", roman: "II" },
    { n: 3, name: "Three", nameFr: "Trois", roman: "III" },
    { n: 4, name: "Four", nameFr: "Quatre", roman: "IV" },
    { n: 5, name: "Five", nameFr: "Cinq", roman: "V" },
    { n: 6, name: "Six", nameFr: "Six", roman: "VI" },
    { n: 7, name: "Seven", nameFr: "Sept", roman: "VII" },
    { n: 8, name: "Eight", nameFr: "Huit", roman: "VIII" },
    { n: 9, name: "Nine", nameFr: "Neuf", roman: "IX" },
    { n: 10, name: "Ten", nameFr: "Dix", roman: "X" },
    { n: 11, name: "Page", nameFr: "Valet", roman: "Page" },
    { n: 12, name: "Knight", nameFr: "Cavalier", roman: "Knight" },
    { n: 13, name: "Queen", nameFr: "Reine", roman: "Queen" },
    { n: 14, name: "King", nameFr: "Roi", roman: "King" },
  ];

  const suitInfo = suitData[suit];
  const suitNameCap = suit.charAt(0).toUpperCase() + suit.slice(1);

  return numbers.map((num, i) => ({
    id: startId + i,
    name: `${num.name} of ${suitNameCap}`,
    nameFr: `${num.nameFr} de ${suitInfo.nameFr}`,
    arcana: "minor" as const,
    suit,
    number: num.n,
    keywords: [suitInfo.element, suitInfo.theme],
    upright: suitInfo.upright(num.name),
    reversed: suitInfo.reversed(num.name),
    symbol: suit,
  }));
}

export const MINOR_ARCANA: TarotCard[] = [
  ...createMinorArcana("wands", 22),
  ...createMinorArcana("cups", 36),
  ...createMinorArcana("swords", 50),
  ...createMinorArcana("pentacles", 64),
];

export const ALL_TAROT_CARDS: TarotCard[] = [
  ...MAJOR_ARCANA,
  ...MINOR_ARCANA,
];

export const SUBJECTS = [
  { value: "love", label: "Amour", labelEn: "Love" },
  { value: "family", label: "Famille", labelEn: "Family" },
  { value: "friendship", label: "Amitié", labelEn: "Friendship" },
  { value: "money", label: "Argent", labelEn: "Money" },
  { value: "job", label: "Travail", labelEn: "Job" },
  { value: "school", label: "École", labelEn: "School" },
  { value: "career", label: "Carrière", labelEn: "Career" },
  { value: "future", label: "Futur", labelEn: "Future" },
];

export function shuffleDeck(cards: TarotCard[]): TarotCard[] {
  const deck = [...cards];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
