import React, { useState } from "react";
import Groq from "groq-sdk";

// Initialize Groq SDK (move API key to environment variable in production)
const apiKey = "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"; // Consider using process.env.REACT_APP_GROQ_API_KEY
const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

// Mock investment strategies with realistic data
const mockInvestmentStrategies = [
  {
    name: "Mutual Funds",
    type: "Diversified Equity",
    returnRate: 0.12,
    risk: "Medium",
    minInvestment: 5000,
  },
  {
    name: "Fixed Deposits",
    type: "Bank Deposit",
    returnRate: 0.06,
    risk: "Low",
    minInvestment: 10000,
  },
  {
    name: "Stocks",
    type: "Equity",
    returnRate: 0.15,
    risk: "High",
    minInvestment: 2000,
  },
];

const GoalsAndSuggestions = () => {
  const [goalInput, setGoalInput] = useState({
    name: "",
    timeline: "",
    income: "",
    savings: "",
    targetAmount: "",
  });
  const [goals, setGoals] = useState([]);
  const [suggestions, setSuggestions] = useState(null);
  const [investmentOptions, setInvestmentOptions] = useState([]);
  const [aiAmount, setAiAmount] = useState("");
  const [aiResults, setAiResults] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGoalInput((prev) => ({ ...prev, [name]: value }));
  };

  const addGoal = () => {
    const { name, timeline, income, savings, targetAmount } = goalInput;

    if (!name || !timeline || !income || !savings || !targetAmount) {
      alert("Please fill all fields.");
      return;
    }

    const parsedTimeline = parseInt(timeline);
    const parsedIncome = parseFloat(income);
    const parsedSavings = parseFloat(savings);
    const parsedTarget = parseFloat(targetAmount);

    if (
      isNaN(parsedTimeline) ||
      parsedTimeline <= 0 ||
      isNaN(parsedIncome) ||
      parsedIncome <= 0 ||
      isNaN(parsedSavings) ||
      parsedSavings < 0 ||
      isNaN(parsedTarget) ||
      parsedTarget <= 0
    ) {
      alert("Please enter valid positive numbers for all fields.");
      return;
    }

    if (parsedSavings > parsedTarget) {
      alert("Current savings cannot exceed the target amount.");
      return;
    }

    const newGoal = {
      name,
      timeline: parsedTimeline,
      income: parsedIncome,
      savings: parsedSavings,
      targetAmount: parsedTarget,
      progress: (parsedSavings / parsedTarget) * 100,
    };

    setGoals((prev) => [...prev, newGoal]);
    calculateSavingsPlan(newGoal);
    setGoalInput({
      name: "",
      timeline: "",
      income: "",
      savings: "",
      targetAmount: "",
    });
  };

  const calculateSavingsPlan = (goal) => {
    const remainingAmount = goal.targetAmount - goal.savings;
    const months = goal.timeline;

    if (remainingAmount <= 0) {
      setSuggestions({
        message: `🎉 You've already reached your goal "${goal.name}"!`,
        type: "success",
      });
      setInvestmentOptions([]);
      return;
    }

    const monthlySaving = remainingAmount / months;
    const disposableIncome = goal.income - monthlySaving;

    let message;
    if (disposableIncome < 0) {
      message = `⚠️ Warning: To reach "${goal.name}" (₹${
        goal.targetAmount
      }) in ${months} months, you need ₹${monthlySaving.toFixed(
        2
      )} monthly, but your income (₹${
        goal.income
      }) is insufficient. Consider extending the timeline or increasing income.`;
    } else {
      const weeklySaving = remainingAmount / (months * 4);
      const dailySaving = remainingAmount / (months * 30);
      message = `To reach "${goal.name}" (₹${
        goal.targetAmount
      }), save ₹${weeklySaving.toFixed(2)} weekly, ₹${monthlySaving.toFixed(
        2
      )} monthly, or ₹${dailySaving.toFixed(
        2
      )} daily. Disposable income after savings: ₹${disposableIncome.toFixed(
        2
      )}.`;
    }

    const viableInvestments = mockInvestmentStrategies.filter(
      (option) =>
        option.minInvestment <= remainingAmount &&
        option.minInvestment <= goal.income
    );

    setSuggestions({
      message,
      type: disposableIncome < 0 ? "warning" : "info",
    });
    setInvestmentOptions(viableInvestments.length > 0 ? viableInvestments : []);
  };

  const fetchAIResults = async () => {
    if (!aiAmount || parseFloat(aiAmount) <= 0) {
      alert("Please enter a valid investment amount.");
      return;
    }

    setAiLoading(true);
    setAiResults("");
    try {
      let result = "";
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Best stocks in India for 2025 under ₹${aiAmount} using the most recent data. Provide a brief recommendation for each stock, including only the stock name and why it should be bought—do not display any price information. Include a disclaimer at the end.`,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: true,
        stop: null,
      });

      for await (const chunk of chatCompletion) {
        result += chunk.choices[0]?.delta?.content || "";
      }
      setAiResults(result);
    } catch (error) {
      setAiResults(
        "Error fetching AI recommendations. Please try again later."
      );
      console.error("AI Error:", error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-text-100">
          Your Financial Goals
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-dark-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-semibold text-text-100 mb-6">
              Add a New Goal
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={goalInput.name}
                onChange={handleInputChange}
                placeholder="Goal Name (e.g., New Car)"
                className="w-full p-3 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600 bg-dark-700 text-text-100 placeholder-text-500 transition-all duration-300"
              />
              <input
                type="number"
                name="timeline"
                value={goalInput.timeline}
                onChange={handleInputChange}
                placeholder="Timeline (Months)"
                className="w-full p-3 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600 bg-dark-700 text-text-100 placeholder-text-500 transition-all duration-300"
              />
              <input
                type="number"
                name="income"
                value={goalInput.income}
                onChange={handleInputChange}
                placeholder="Monthly Income (₹)"
                className="w-full p-3 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600 bg-dark-700 text-text-100 placeholder-text-500 transition-all duration-300"
              />
              <input
                type="number"
                name="savings"
                value={goalInput.savings}
                onChange={handleInputChange}
                placeholder="Current Savings (₹)"
                className="w-full p-3 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600 bg-dark-700 text-text-100 placeholder-text-500 transition-all duration-300"
              />
              <input
                type="number"
                name="targetAmount"
                value={goalInput.targetAmount}
                onChange={handleInputChange}
                placeholder="Target Amount (₹)"
                className="w-full p-3 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600 bg-dark-700 text-text-100 placeholder-text-500 transition-all duration-300"
              />
              <button
                onClick={addGoal}
                className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-text-100 rounded-lg hover:from-primary-700 hover:to-accent-700 transition-all duration-300 shadow-md"
              >
                Add Goal
              </button>
            </div>
          </div>

          <div className="bg-dark-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-semibold text-text-100 mb-6">
              Your Goals
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {goals.length === 0 ? (
                <p className="text-text-500">No goals added yet.</p>
              ) : (
                goals.map((goal, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-dark-700 rounded-lg shadow-sm hover:bg-dark-600 transition-all duration-300"
                  >
                    <h3 className="font-semibold text-lg text-text-100">
                      {goal.name}
                    </h3>
                    <div className="w-full bg-dark-600 rounded-full h-3 mt-2">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          goal.progress >= 100
                            ? "bg-accent-600"
                            : "bg-primary-600"
                        }`}
                        style={{ width: `${Math.min(goal.progress, 100)}%` }}
                      />
                    </div>
                    <p className="text-sm text-text-300 mt-2">
                      ₹{goal.savings.toLocaleString()} / ₹
                      {goal.targetAmount.toLocaleString()} (
                      {goal.progress.toFixed(2)}%)
                    </p>
                    <p className="text-sm text-text-400">
                      Timeline: {goal.timeline} months
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {suggestions && (
          <div className="bg-dark-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-text-100 mb-4">
              Savings Plan
            </h2>
            <p
              className={`text-lg ${
                suggestions.type === "success"
                  ? "text-accent-600"
                  : suggestions.type === "warning"
                  ? "text-danger-600"
                  : "text-text-100"
              }`}
            >
              {suggestions.message}
            </p>
            {investmentOptions.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {investmentOptions.map((option, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-dark-700 rounded-lg shadow-sm hover:scale-105 transition-all duration-300"
                  >
                    <h3 className="font-semibold text-text-100">
                      {option.name}
                    </h3>
                    <p className="text-sm text-text-300">Type: {option.type}</p>
                    <p className="text-sm text-text-300">
                      Return: {(option.returnRate * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-text-300">Risk: {option.risk}</p>
                    <p className="text-sm text-text-300">
                      Min: ₹{option.minInvestment.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-dark-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-text-100 mb-6">
            AI Stock Recommendations
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="number"
              value={aiAmount}
              onChange={(e) => setAiAmount(e.target.value)}
              placeholder="Enter amount (₹)"
              className="w-full md:w-1/2 p-3 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600 bg-dark-700 text-text-100 placeholder-text-500 transition-all duration-300"
            />
            <button
              onClick={fetchAIResults}
              className="w-full md:w-auto py-3 px-6 bg-gradient-to-r from-accent-600 to-primary-600 text-text-100 rounded-lg hover:from-accent-700 hover:to-primary-700 transition-all duration-300 shadow-md disabled:opacity-50"
              disabled={aiLoading}
            >
              {aiLoading ? "Fetching..." : "Get Recommendations"}
            </button>
          </div>
          {aiResults && (
            <pre className="mt-6 bg-dark-700 p-4 rounded-lg text-text-300 whitespace-pre-wrap font-mono">
              {aiResults}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalsAndSuggestions;
