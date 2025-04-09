import React, { useState, useEffect } from "react";
import axios from "axios";

const BudgetAndExpenses = () => {
  const [budgets, setBudgets] = useState([]);
  const [budgetName, setBudgetName] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const email = localStorage.getItem("user");

  const [expenseCatagory, setExpenseCatagory] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [expenseName, setExpenseName] = useState("");

  // Replace with your computer's IP address
  //const API_URL = "http://192.168.194.154:5000"; // Dharshan
  const API_URL = "http://192.168.0.101:5000"; // HOME

  useEffect(() => {
    axios
      .get(`${API_URL}/get-budgets?email=${email}`)
      .then(({ data }) => setBudgets(data))
      .catch((err) => console.error("Error fetching budgets:", err));
  }, [email]);

  const addBudget = async () => {
    if (!budgetName || !budgetAmount) return alert("Please fill all fields");
    try {
      const response = await axios.post(`${API_URL}/add-budget`, {
        email,
        name: budgetName,
        amount: budgetAmount,
      });
      alert(response.data.message);
      setBudgetName("");
      setBudgetAmount("");
      const { data } = await axios.get(`${API_URL}/get-budgets?email=${email}`);
      setBudgets(data);
    } catch (error) {
      alert("Failed to add budget");
      console.error("Error:", error.response?.data || error.message);
    }
  };

  const addExpense = async () => {
    if (!expenseCatagory || !expenseAmount || !expenseDate || !expenseName)
      return alert("Please fill all fields");
    try {
      const response = await axios.post(`${API_URL}/add-expense`, {
        email,
        budgetName: expenseCatagory,
        expenseAmount,
        expenseDate,
        expenseName,
      });
      alert(response.data.message);
      setExpenseCatagory("");
      setExpenseAmount("");
      setExpenseDate("");
      setExpenseName("");
      const { data } = await axios.get(`${API_URL}/get-budgets?email=${email}`);
      setBudgets(data);
    } catch (error) {
      alert("Failed to add expense");
      console.error("Error:", error.response?.data || error.message);
    }
  };

  const deleteBudget = async (name) => {
    try {
      const response = await axios.delete(`${API_URL}/delete-budget`, {
        data: { email, name },
      });
      alert(response.data.message);
      setBudgets(budgets.filter((budget) => budget.name !== name));
    } catch (error) {
      alert("Failed to delete budget");
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Section */}
        <div className="bg-dark-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-bold text-text-100 mb-6">
            Manage Budgets
          </h2>
          <input
            className="w-full p-3 mb-4 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600 bg-dark-700 text-text-100 placeholder-text-500 transition-all duration-300"
            type="text"
            placeholder="Budget Name"
            value={budgetName}
            onChange={(e) => setBudgetName(e.target.value)}
          />
          <input
            className="w-full p-3 mb-4 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600 bg-dark-700 text-text-100 placeholder-text-500 transition-all duration-300"
            type="number"
            placeholder="Budget Amount"
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
          />
          <button
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-text-100 rounded-lg hover:from-primary-700 hover:to-accent-700 transition-all duration-300 shadow-md"
            onClick={addBudget}
          >
            Add Budget
          </button>
        </div>

        {/* Expense Section */}
        <div className="bg-dark-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-bold text-text-100 mb-6">Add Expense</h2>
          <select
            className="w-full p-3 mb-4 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600 bg-dark-700 text-text-100 transition-all duration-300"
            value={expenseCatagory}
            onChange={(e) => setExpenseCatagory(e.target.value)}
          >
            <option value="" className="text-text-500">
              Select Budget
            </option>
            {budgets.map((budget) => (
              <option key={budget.name} value={budget.name}>
                {budget.name}
              </option>
            ))}
          </select>
          <input
            className="w-full p-3 mb-4 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600 bg-dark-700 text-text-100 placeholder-text-500 transition-all duration-300"
            type="text"
            placeholder="Expense Name"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
          />
          <input
            className="w-full p-3 mb-4 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600 bg-dark-700 text-text-100 placeholder-text-500 transition-all duration-300"
            type="number"
            placeholder="Expense Amount"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
          />
          <input
            className="w-full p-3 mb-4 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600 bg-dark-700 text-text-100 transition-all duration-300"
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
          />
          <button
            className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-text-100 rounded-lg hover:from-teal-700 hover:to-teal-600 transition-all duration-300 shadow-md"
            onClick={addExpense}
          >
            Add Expense
          </button>
        </div>

        {/* Budget List Section */}
        <div className="bg-dark-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-bold text-text-100 mb-6">
            Your Budgets
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {budgets.length === 0 ? (
              <p className="text-text-500">No budgets added yet.</p>
            ) : (
              budgets.map((budget) => {
                const progress = (
                  (budget.amount / budget.originalAmount) *
                  100
                ).toFixed(2);
                return (
                  <div
                    key={budget.name}
                    className="p-4 bg-dark-700 rounded-lg shadow-sm hover:bg-dark-600 transition-all duration-300"
                  >
                    <span className="font-semibold text-lg text-text-100">
                      {budget.name}
                    </span>
                    <div className="w-full bg-dark-600 rounded-full h-3 mt-2">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          progress <= 80 ? "bg-orange-600" : "bg-accent-600"
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-text-300 mt-2 block">
                      ₹{budget.amount} / ₹{budget.originalAmount} ({progress}%)
                    </span>
                    <button
                      className="mt-3 bg-danger-600 text-text-100 px-4 py-1 rounded-lg hover:bg-danger-700 transition-all duration-300"
                      onClick={() => deleteBudget(budget.name)}
                    >
                      Delete
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAndExpenses;
