import heroTub from "@/assets/hero-tub.png";
import gridProducts from "@/assets/grid-products.jpg";

export type Product = {
  slug: string;
  name: string;
  category: "Protein" | "Performance" | "Food" | "Accessories" | "Wellness";
  goals: string[];
  flavors: string[];
  sizes: { label: string; multiplier: number }[];
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  blurb: string;
  benefits: string[];
  ingredients: string;
  howToUse: string;
  nutrition: {
    protein: number;
    calories: number;
    servings: number;
    bcaa: number;
    eaa: number;
    sugar: number;
    fat: number;
    carbs: number;
  };
  popularity: number;
};

const tub = heroTub;
const acc = gridProducts;

export const products: Product[] = [
  {
    slug: "forge-whey-protein",
    name: "Signature Whey Protein",
    category: "Protein",
    goals: ["Muscle Gain", "Daily Nutrition", "Recovery"],
    flavors: ["Belgian Chocolate", "Cold Coffee", "Alphonso Mango", "Vanilla Cream"],
    sizes: [
      { label: "1 kg", multiplier: 1 },
      { label: "2 kg", multiplier: 1.85 },
      { label: "4 kg", multiplier: 3.5 },
    ],
    price: 2899,
    mrp: 4299,
    rating: 4.8,
    reviews: 4212,
    image: tub,
    badge: "Bestseller",
    blurb: "24g of fast-absorbing whey concentrate blend per scoop. Zero filler math.",
    benefits: [
      "24g protein and 5.5g BCAA per serving",
      "Digestive enzyme blend for zero bloat",
      "Instantised — mixes clean in 8 seconds",
      "Third-party lab tested, batch traceable",
    ],
    ingredients:
      "Whey protein concentrate, whey protein isolate, cocoa powder, digestive enzyme blend (protease, lactase), natural flavour, stevia.",
    howToUse:
      "Add 1 scoop (32g) to 200–250ml water or milk. Shake for 10 seconds. Best within 30 minutes post-training or as a daily protein top-up.",
    nutrition: { protein: 24, calories: 121, servings: 31, bcaa: 5.5, eaa: 11.2, sugar: 1.1, fat: 1.8, carbs: 2.4 },
    popularity: 98,
  },
  {
    slug: "forge-isolate",
    name: "Zero Carb Isolate",
    category: "Protein",
    goals: ["Lean Muscle", "Weight Loss", "Recovery"],
    flavors: ["Unflavoured", "Double Chocolate", "Strawberry Ice"],
    sizes: [
      { label: "1 kg", multiplier: 1 },
      { label: "2 kg", multiplier: 1.9 },
    ],
    price: 3749,
    mrp: 5299,
    rating: 4.9,
    reviews: 1876,
    image: tub,
    badge: "27g Protein",
    blurb: "Cold-filtered isolate at 90% protein by weight. Nothing hides in here.",
    benefits: [
      "27g protein, <1g carb, <1g fat",
      "Cross-flow micro-filtered",
      "Lactose friendly",
      "Ideal for cutting phases",
    ],
    ingredients: "Whey protein isolate (cross-flow microfiltered), natural flavour, sucralose-free sweetener blend.",
    howToUse: "1 scoop (30g) in 200ml cold water, post-workout or between meals.",
    nutrition: { protein: 27, calories: 112, servings: 33, bcaa: 6.1, eaa: 12.4, sugar: 0.3, fat: 0.4, carbs: 0.8 },
    popularity: 91,
  },
  {
    slug: "forge-mass-gainer",
    name: "Heavy Mass Gainer",
    category: "Protein",
    goals: ["Muscle Gain", "Strength & Performance"],
    flavors: ["Chocolate Fudge", "Kesar Badam"],
    sizes: [
      { label: "3 kg", multiplier: 1 },
      { label: "5 kg", multiplier: 1.55 },
    ],
    price: 2499,
    mrp: 3599,
    rating: 4.6,
    reviews: 943,
    image: tub,
    blurb: "Calorie-dense fuel for hard gainers who eat like it's a job.",
    benefits: ["1250 kcal per serving", "60g protein per serving", "Complex carb matrix", "Added MCTs and creatine"],
    ingredients: "Maltodextrin, whey concentrate, oat flour, cocoa, MCT powder, creatine monohydrate, vitamin blend.",
    howToUse: "2 scoops in 350ml milk, once or twice daily between meals.",
    nutrition: { protein: 60, calories: 1250, servings: 16, bcaa: 12, eaa: 24, sugar: 8, fat: 9, carbs: 230 },
    popularity: 74,
  },
  {
    slug: "forge-creatine",
    name: "Micronised Creatine",
    category: "Performance",
    goals: ["Strength & Performance", "Muscle Gain"],
    flavors: ["Unflavoured"],
    sizes: [
      { label: "250 g", multiplier: 1 },
      { label: "500 g", multiplier: 1.8 },
    ],
    price: 1199,
    mrp: 1899,
    rating: 4.9,
    reviews: 2610,
    image: acc,
    badge: "Lab Tested",
    blurb: "Creapure-grade monohydrate. The most proven strength molecule on earth.",
    benefits: ["3g pure monohydrate per scoop", "200 mesh micronised", "No loading phase needed", "Heavy-metal tested"],
    ingredients: "100% micronised creatine monohydrate.",
    howToUse: "1 scoop (3g) daily with water or your shake. Consistency beats timing.",
    nutrition: { protein: 0, calories: 0, servings: 83, bcaa: 0, eaa: 0, sugar: 0, fat: 0, carbs: 0 },
    popularity: 88,
  },
  {
    slug: "forge-pre-workout",
    name: "Ignition Pre-Workout",
    category: "Performance",
    goals: ["Strength & Performance", "Muscle Gain"],
    flavors: ["Blue Raspberry", "Green Apple", "Watermelon Crush"],
    sizes: [{ label: "300 g", multiplier: 1 }],
    price: 1899,
    mrp: 2699,
    rating: 4.7,
    reviews: 1332,
    image: acc,
    badge: "High Stim",
    blurb: "Clean 250mg caffeine, 6g citrulline. Focus without the crash.",
    benefits: ["6g L-citrulline for pumps", "3.2g beta-alanine", "250mg caffeine + L-theanine", "No proprietary blends"],
    ingredients: "L-citrulline, beta-alanine, caffeine anhydrous, L-theanine, L-tyrosine, electrolyte blend.",
    howToUse: "1 scoop in 300ml water, 20 minutes before training. Do not exceed 1 serving daily.",
    nutrition: { protein: 0, calories: 12, servings: 30, bcaa: 0, eaa: 0, sugar: 0, fat: 0, carbs: 3 },
    popularity: 85,
  },
  {
    slug: "forge-protein-bars",
    name: "Protein Bars (Box of 12)",
    category: "Food",
    goals: ["Daily Nutrition", "Lean Muscle", "Weight Loss"],
    flavors: ["Peanut Butter", "Choco Almond", "Coffee Caramel"],
    sizes: [{ label: "12 bars", multiplier: 1 }],
    price: 1299,
    mrp: 1799,
    rating: 4.5,
    reviews: 764,
    image: acc,
    blurb: "20g protein you can carry in a gym bag. Actually tastes like food.",
    benefits: ["20g protein per bar", "Under 210 kcal", "No added sugar", "High fibre"],
    ingredients: "Milk protein blend, almonds, peanut butter, soluble fibre, cocoa butter, natural flavour.",
    howToUse: "One bar as a mid-day snack or post-training bridge meal.",
    nutrition: { protein: 20, calories: 208, servings: 12, bcaa: 4.2, eaa: 8.6, sugar: 1.5, fat: 7, carbs: 16 },
    popularity: 70,
  },
  {
    slug: "forge-shaker",
    name: "Steel Vortex Shaker",
    category: "Accessories",
    goals: ["Daily Nutrition"],
    flavors: ["Matte Black", "Acid Lime"],
    sizes: [{ label: "750 ml", multiplier: 1 }],
    price: 799,
    mrp: 1199,
    rating: 4.7,
    reviews: 512,
    image: acc,
    blurb: "Leak-proof stainless build with a mixing vortex insert.",
    benefits: ["Double-wall stainless steel", "Leak-proof locking lid", "Odour resistant", "Dishwasher safe"],
    ingredients: "304 stainless steel, BPA-free lid.",
    howToUse: "Rinse before first use. Add liquid first, powder second.",
    nutrition: { protein: 0, calories: 0, servings: 0, bcaa: 0, eaa: 0, sugar: 0, fat: 0, carbs: 0 },
    popularity: 60,
  },
  {
    slug: "forge-multivitamin",
    name: "Athlete Multivitamin",
    category: "Wellness",
    goals: ["Daily Nutrition", "Recovery"],
    flavors: ["Unflavoured"],
    sizes: [{ label: "60 tablets", multiplier: 1 }],
    price: 899,
    mrp: 1399,
    rating: 4.6,
    reviews: 688,
    image: acc,
    blurb: "36 micronutrients tuned for people who train five-plus days a week.",
    benefits: ["36 vitamins & minerals", "Added omega-3 and lutein", "Supports immunity", "One tablet daily"],
    ingredients: "Vitamin A, C, D3, E, K, B-complex, zinc, magnesium, selenium, omega-3 concentrate, lutein.",
    howToUse: "1 tablet daily with breakfast.",
    nutrition: { protein: 0, calories: 4, servings: 60, bcaa: 0, eaa: 0, sugar: 0, fat: 0, carbs: 0 },
    popularity: 65,
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const categories = ["Protein", "Performance", "Food", "Accessories", "Wellness"] as const;

export const goals = [
  { name: "Muscle Gain", desc: "Surplus fuel and high-leucine protein for real size." },
  { name: "Lean Muscle", desc: "Low-carb protein that builds without the bloat." },
  { name: "Weight Loss", desc: "High satiety, low calories, zero compromise." },
  { name: "Strength & Performance", desc: "Creatine, pumps and clean stimulants." },
  { name: "Recovery", desc: "Aminos and micronutrients for next-day readiness." },
  { name: "Daily Nutrition", desc: "The everyday baseline your training assumes." },
];

export const formatINR = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN");
