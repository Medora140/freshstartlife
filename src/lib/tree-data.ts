export interface TreeType {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  description: string;
  stages: string[]; // emoji for each growth stage (0=seed, 1=sprout, 2=sapling, 3=young, 4=mature)
}

export const TREE_TYPES: TreeType[] = [
  {
    id: "oak",
    name: "Oak",
    emoji: "🌳",
    cost: 0,
    description: "A strong, classic oak tree. Free to plant!",
    stages: ["🌰", "🌱", "🪴", "🌿", "🌳"],
  },
  {
    id: "pine",
    name: "Pine",
    emoji: "🌲",
    cost: 50,
    description: "An evergreen pine that stands tall.",
    stages: ["🌰", "🌱", "🪴", "🌿", "🌲"],
  },
  {
    id: "cherry",
    name: "Cherry Blossom",
    emoji: "🌸",
    cost: 100,
    description: "A beautiful cherry blossom tree.",
    stages: ["🌰", "🌱", "🪴", "🌷", "🌸"],
  },
  {
    id: "palm",
    name: "Palm",
    emoji: "🌴",
    cost: 75,
    description: "A tropical palm tree for warm vibes.",
    stages: ["🌰", "🌱", "🪴", "🌿", "🌴"],
  },
  {
    id: "cactus",
    name: "Cactus",
    emoji: "🌵",
    cost: 30,
    description: "A resilient desert cactus.",
    stages: ["🌰", "🌱", "🪴", "🌿", "🌵"],
  },
  {
    id: "maple",
    name: "Maple",
    emoji: "🍁",
    cost: 120,
    description: "A stunning autumn maple tree.",
    stages: ["🌰", "🌱", "🪴", "🍂", "🍁"],
  },
  {
    id: "bamboo",
    name: "Bamboo",
    emoji: "🎋",
    cost: 60,
    description: "Fast-growing bamboo — symbol of resilience.",
    stages: ["🌰", "🌱", "🪴", "🌿", "🎋"],
  },
  {
    id: "sunflower",
    name: "Sunflower",
    emoji: "🌻",
    cost: 40,
    description: "A bright sunflower that follows the light.",
    stages: ["🌰", "🌱", "🪴", "🌼", "🌻"],
  },
];

// Growth: each clean day = 1 growth point. 5 points = 1 stage. Max stage = 4.
export const POINTS_PER_STAGE = 1;
export const MAX_STAGE = 4;
// Coins: 5 coins per clean day
export const COINS_PER_CLEAN_DAY = 5;
