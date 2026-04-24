export type RestaurantStatus = "picked" | "candidate" | "filtered";

export interface DietaryFit {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
}

export interface AvailabilitySlot {
  label: string;
  time: string;
  available: boolean;
  remaining?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  neighborhood: string;
  rating: number;
  reviewCount: number;
  openTableId?: string;
  dietary: DietaryFit;
  score: number;
  availability: AvailabilitySlot[];
  status: RestaurantStatus;
  filteredReason?: string;
  reasoning: string;
  topDishes: string[];
  accentColor: string;
  confirmation?: string;
}

export interface PartyMember {
  id: string;
  name: string;
  host?: boolean;
  dietary?: string[];
  accentColor: string;
}

export interface Session {
  id: string;
  shortId: string;
  title: string;
  createdAt: string;
  pickedAt: string;
  dateTime: string;
  partySize: number;
  location: string;
  chatContext: string;
  members: PartyMember[];
  filters: { label: string; active: boolean }[];
  pipelineTiming: { label: string; value: string }[];
}

export const session: Session = {
  id: "ses_7a3fd2c19b",
  shortId: "7A3F-D2",
  title: "Saturday dinner",
  createdAt: "2 hours ago",
  pickedAt: "14 minutes ago",
  dateTime: "Sat, Apr 26 · 7:00 PM",
  partySize: 5,
  location: "San Francisco, CA",
  chatContext:
    "…craving handmade pasta · anything italian · mid-budget · Alice is vegetarian · carol said gluten-free",
  members: [
    { id: "m1", name: "Victoria", host: true, accentColor: "#F04E55" },
    {
      id: "m2",
      name: "Alice",
      dietary: ["vegetarian"],
      accentColor: "#6840FF",
    },
    { id: "m3", name: "Bob", accentColor: "#2ECC71" },
    {
      id: "m4",
      name: "Carol",
      dietary: ["gluten-free"],
      accentColor: "#F59E0B",
    },
    { id: "m5", name: "Dave", accentColor: "#1132F5" },
  ],
  filters: [
    { label: "Italian", active: true },
    { label: "Mid-range", active: true },
    { label: "Vegetarian OK", active: true },
    { label: "Gluten-free OK", active: true },
    { label: "SF · Downtown", active: false },
  ],
  pipelineTiming: [
    { label: "Overlap computed", value: "42 ms" },
    { label: "WunderGraph query", value: "1.9 s" },
    { label: "Claude selection", value: "1.2 s" },
    { label: "TinyFish booking", value: "14.3 s" },
  ],
};

export const restaurants: Restaurant[] = [
  {
    id: "r1",
    name: "Cotogna",
    cuisine: "Italian · Rustic",
    priceRange: "$$",
    neighborhood: "Jackson Square",
    rating: 4.6,
    reviewCount: 2847,
    openTableId: "cotogna-san-francisco",
    dietary: { vegetarian: true, vegan: false, glutenFree: true },
    score: 94,
    status: "picked",
    confirmation: "A47X9KLM",
    availability: [
      { label: "Sat · 6:30", time: "6:30 PM", available: true, remaining: 3 },
      { label: "Sat · 7:00", time: "7:00 PM", available: true, remaining: 5 },
      { label: "Sat · 7:30", time: "7:30 PM", available: true, remaining: 2 },
      { label: "Sat · 8:00", time: "8:00 PM", available: false },
    ],
    reasoning:
      "Handles Alice's vegetarian and Carol's gluten-free constraints cleanly — house-made GF pasta, robust vegetable-forward menu. Mid-range pricing hits your group's budget, and Jackson Square matches the chat's 'downtown-adjacent' vibe. 7 PM had the widest availability across your overlap.",
    topDishes: [
      "Cacio e pepe",
      "Wood-fired vegetables",
      "Handkerchief pasta",
      "Roasted chicken",
    ],
    accentColor: "#C45538",
  },
  {
    id: "r2",
    name: "Flour + Water",
    cuisine: "Italian · Pasta",
    priceRange: "$$",
    neighborhood: "Mission",
    rating: 4.5,
    reviewCount: 3120,
    dietary: { vegetarian: true, vegan: false, glutenFree: true },
    score: 88,
    status: "candidate",
    availability: [
      { label: "Sat · 7:00", time: "7:00 PM", available: true, remaining: 2 },
      { label: "Sat · 7:30", time: "7:30 PM", available: false },
      { label: "Sat · 8:00", time: "8:00 PM", available: true, remaining: 4 },
    ],
    reasoning:
      "Strong pasta program with GF options. Slightly harder to get into at 7 PM, and Mission location is a 15-min Lyft from downtown — small friction vs. Cotogna.",
    topDishes: ["Tasting menu", "Margherita pizza", "Squid ink pasta"],
    accentColor: "#D8A14A",
  },
  {
    id: "r3",
    name: "A16",
    cuisine: "Italian · Southern",
    priceRange: "$$$",
    neighborhood: "Marina",
    rating: 4.4,
    reviewCount: 1950,
    dietary: { vegetarian: true, vegan: false, glutenFree: true },
    score: 82,
    status: "candidate",
    availability: [
      { label: "Sat · 7:00", time: "7:00 PM", available: true, remaining: 6 },
      { label: "Sat · 7:30", time: "7:30 PM", available: true, remaining: 4 },
    ],
    reasoning:
      "Great Neapolitan pizzas and vegetarian antipasti, but pricing skews upscale for your 'mid-budget' signal. Marina is farther than the chat suggested.",
    topDishes: ["Margherita DOC", "Burrata", "Short rib"],
    accentColor: "#8AB14B",
  },
  {
    id: "r4",
    name: "Rich Table",
    cuisine: "Californian",
    priceRange: "$$$",
    neighborhood: "Hayes Valley",
    rating: 4.6,
    reviewCount: 2210,
    dietary: { vegetarian: true, vegan: true, glutenFree: true },
    score: 80,
    status: "candidate",
    availability: [
      { label: "Sat · 6:30", time: "6:30 PM", available: true, remaining: 2 },
      { label: "Sat · 7:00", time: "7:00 PM", available: false },
    ],
    reasoning:
      "Vegan-friendly and creative, but the chat leaned Italian specifically. Limited 7 PM inventory on Saturday.",
    topDishes: ["Sardine chips", "Douglas fir levain", "Porcini doughnuts"],
    accentColor: "#6B8B71",
  },
  {
    id: "r5",
    name: "Perbacco",
    cuisine: "Italian · Piemontese",
    priceRange: "$$$",
    neighborhood: "FiDi",
    rating: 4.5,
    reviewCount: 1605,
    dietary: { vegetarian: true, vegan: false, glutenFree: false },
    score: 74,
    status: "candidate",
    availability: [
      { label: "Sat · 7:00", time: "7:00 PM", available: true, remaining: 8 },
    ],
    reasoning:
      "Downtown-adjacent, Italian, high rating. Gluten-free menu is limited — Carol would have fewer options. Price tilts upscale.",
    topDishes: ["Agnolotti", "Brasato al Barolo", "Vitello tonnato"],
    accentColor: "#A9524F",
  },
  {
    id: "r6",
    name: "Nopa",
    cuisine: "Californian",
    priceRange: "$$",
    neighborhood: "NoPa",
    rating: 4.5,
    reviewCount: 4100,
    dietary: { vegetarian: true, vegan: false, glutenFree: true },
    score: 71,
    status: "candidate",
    availability: [
      { label: "Sat · 7:00", time: "7:00 PM", available: true, remaining: 5 },
      { label: "Sat · 8:00", time: "8:00 PM", available: true, remaining: 3 },
    ],
    reasoning:
      "Price and vibe match, but the chat specifically asked for Italian. Solid fallback if Italian options filled up.",
    topDishes: ["Wood-fired flatbread", "Local vegetable plate", "Pork chop"],
    accentColor: "#5475A8",
  },
  {
    id: "r7",
    name: "Tony's Pizza Napoletana",
    cuisine: "Italian · Pizza",
    priceRange: "$",
    neighborhood: "North Beach",
    rating: 4.3,
    reviewCount: 5820,
    dietary: { vegetarian: true, vegan: false, glutenFree: false },
    score: 0,
    status: "filtered",
    filteredReason:
      "No reliable gluten-free menu — Carol's hard constraint filters this out.",
    availability: [],
    reasoning: "",
    topDishes: [],
    accentColor: "#B8443A",
  },
];
