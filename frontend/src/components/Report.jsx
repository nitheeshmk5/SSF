import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import axios from "axios";

// Use your computer's IP address for network access
const API_URL = "http://192.168.194.154:5000"; // Dharshan
//const API_URL = "http://192.168.0.100:5000"; // HOME

const Report = () => {
  const [reportData, setReportData] = useState([]);
  const [selectedMonthExpenses, setSelectedMonthExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const email = localStorage.getItem("user");

  useEffect(() => {
    axios
      .get(`${API_URL}/get-monthly-report?email=${email}`)
      .then(({ data }) => setReportData(data))
      .catch((err) => console.error("Error fetching report:", err));
  }, [email]);

  const allMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = {
    labels: allMonths,
    datasets: [
      {
        label: "Expenses",
        data: allMonths.map((_, index) => {
          const monthData = reportData.find((item) => item.month === index + 1);
          return monthData ? monthData.total_expense : 0;
        }),
        backgroundColor: "rgba(20, 184, 166, 0.7)",
        borderColor: "#14B8A6",
        borderWidth: 1,
        hoverBackgroundColor: "#0D9488",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#F9FAFB",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#D1D5DB" },
        grid: { color: "#4B5563" },
      },
      y: {
        ticks: { color: "#D1D5DB" },
        grid: { color: "#4B5563" },
        beginAtZero: true,
      },
    },
  };

  const fetchExpensesForMonth = (month) => {
    setSelectedMonth(month);
    axios
      .get(`${API_URL}/get-expenses-for-month?email=${email}&month=${month}`)
      .then(({ data }) => setSelectedMonthExpenses(data))
      .catch((err) => {
        console.error("Error fetching expenses:", err);
        setSelectedMonthExpenses([]);
      });
  };

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-center text-text-100 mb-8">
          Monthly Expenses Report
        </h2>

        <div className="bg-dark-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="h-96">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {allMonths.map((month, index) => (
            <button
              key={month}
              className={`px-6 py-2 rounded-lg text-text-100 transition-all duration-300 shadow-md ${
                selectedMonth === index + 1
                  ? "bg-accent-600 hover:bg-accent-700"
                  : "bg-primary-600 hover:bg-primary-700"
              }`}
              onClick={() => fetchExpensesForMonth(index + 1)}
            >
              {month}
            </button>
          ))}
        </div>

        <div className="bg-dark-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          {selectedMonthExpenses.length === 0 ? (
            <p className="text-text-500 text-center">
              {selectedMonth
                ? `No expenses found for ${allMonths[selectedMonth - 1]}.`
                : "Select a month to view expenses."}
            </p>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-text-100 mb-4">
                Expenses for {allMonths[selectedMonth - 1]}
              </h3>
              <ul className="space-y-4">
                {selectedMonthExpenses.map((expense, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-all duration-200"
                  >
                    <span className="text-text-100">
                      {expense.expense_name}
                    </span>
                    <span className="text-text-300">
                      ₹{expense.expense_amount}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
