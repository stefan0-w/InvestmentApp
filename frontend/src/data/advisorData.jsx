// data/advisorData.js

export const quizQuestions = [
  {
    id: 1,
    question: "How long do you plan to hold these investments? (Time Horizon)",
    description: "Time is the most critical factor. Stocks need time to recover from potential drops.",
    answers: [
      { text: "Less than 3 years (e.g., buying a car, house down payment)", score: 0 },
      { text: "3 - 7 years (Medium term)", score: 4 },
      { text: "8 - 15 years (Long term)", score: 8 },
      { text: "Over 15 years (e.g., Retirement)", score: 10 },
    ]
  },
  {
    id: 2,
    question: "How would you react if your portfolio lost 20% in a month?",
    description: "Emotions are the investor's worst enemy. Be honest with yourself.",
    answers: [
      { text: "I would panic and sell everything to prevent further losses", score: 0 },
      { text: "I would be worried, but I wouldn't do anything", score: 3 },
      { text: "I would stay calm, understanding it's normal for the market", score: 6 },
      { text: "I would buy more assets at a 'discounted' price!", score: 8 },
    ]
  },
  {
    id: 3,
    question: "What is your current financial safety net (Emergency Fund)?",
    description: "Never invest money you might suddenly need for living expenses.",
    answers: [
      { text: "I have consumer debt / No savings", score: 0 },
      { text: "I have savings for 1-3 months of expenses", score: 3 },
      { text: "I have a full safety net (6+ months of expenses)", score: 5 },
    ]
  },
  {
    id: 4,
    question: "What is your age range?",
    description: "Younger investors have more 'human capital' time to recover from losses.",
    answers: [
      { text: "18 - 30 years old", score: 5 },
      { text: "31 - 45 years old", score: 3 },
      { text: "46 - 60 years old", score: 1 },
      { text: "60+ years old", score: 0 },
    ]
  },
  {
    id: 5,
    question: "What is your investment experience?",
    answers: [
      { text: "None - these are my first steps", score: 1 },
      { text: "Theoretical knowledge (blogs, books), but little practice", score: 3 },
      { text: "I have been actively investing for several years", score: 5 },
    ]
  }
];

export const portfolioProfiles = {
  SAFE: {
    key: "SAFE",
    title: "Capital Protection Profile",
    description: "Your investment horizon is too short or your financial situation does not allow for risk. Focus on protecting your money against inflation.",
    allocation: [
      { name: "Government Bonds", value: 80, fill: "#4CAF50" }, // Green
      { name: "Savings / Cash", value: 20, fill: "#8BC34A" }   // Light Green
    ],
    riskLevel: "Very Low"
  },
  CONSERVATIVE: {
    key: "CONSERVATIVE",
    title: "Conservative Profile",
    description: "You value peace of mind. You want returns higher than a bank deposit but cannot accept large fluctuations.",
    allocation: [
      { name: "Indexed Gov. Bonds", value: 60, fill: "#4CAF50" },
      { name: "Global Stocks (ETF)", value: 20, fill: "#2196F3" }, // Blue
      { name: "Gold", value: 15, fill: "#FFC107" },               // Amber
      { name: "Cash", value: 5, fill: "#9E9E9E" }                 // Grey
    ],
    riskLevel: "Low/Medium"
  },
  BALANCED: {
    key: "BALANCED",
    title: "Balanced Profile",
    description: "Classic investing. The perfect balance between safety and wealth growth.",
    allocation: [
      { name: "Dev. Markets Stocks (ETF)", value: 45, fill: "#2196F3" },
      { name: "Bonds", value: 30, fill: "#4CAF50" },
      { name: "Emerging Markets (ETF)", value: 10, fill: "#3F51B5" }, // Indigo
      { name: "Gold / Commodities", value: 10, fill: "#FFC107" },
      { name: "Cash", value: 5, fill: "#9E9E9E" }
    ],
    riskLevel: "Medium"
  },
  DYNAMIC: {
    key: "DYNAMIC",
    title: "Dynamic Profile",
    description: "You have time and nerves of steel. You aim to maximize profit in the long run.",
    allocation: [
      { name: "Dev. Markets Stocks (ETF)", value: 60, fill: "#2196F3" },
      { name: "Emerging Markets (ETF)", value: 20, fill: "#3F51B5" },
      { name: "Bonds", value: 10, fill: "#4CAF50" },
      { name: "Gold / Crypto / Alts", value: 10, fill: "#FF5722" } // Deep Orange
    ],
    riskLevel: "High"
  }
};