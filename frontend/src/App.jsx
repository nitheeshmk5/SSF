import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import BudgetAndExpenses from "./components/budgets";
import GoalsAndSuggestions from "./components/goals";
import Navbar from "./components/Navbar";
import LoginSignUp from "./components/LoginSignUp";
import Report from "./components/Report";

// Simple Homepage Component
const Homepage = () => {
  const user = localStorage.getItem("user");

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-dark-800 p-8 rounded-xl shadow-2xl text-center">
        <h1 className="text-4xl font-bold text-text-100 mb-6">
          Smart Self Finance
        </h1>
        <p className="text-text-300 text-lg mb-8">
          Take control of your finances with ease. Track budgets, monitor
          expenses, and achieve your goals—all in one place.
        </p>
        <button
          onClick={() => (window.location.href = user ? "/budget" : "/login")}
          className="py-3 px-6 bg-gradient-to-r from-primary-600 to-accent-600 text-text-100 rounded-lg hover:from-primary-700 hover:to-accent-700 transition-all duration-300 shadow-md"
        >
          {user ? "Go to Budgets" : "Get Started"}
        </button>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const user = localStorage.getItem("user");
  return user ? element : <Navigate to="/login" replace />;
};

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginSignUp />} />
      <Route
        path="/budget"
        element={<ProtectedRoute element={<BudgetAndExpenses />} />}
      />
      <Route
        path="/monthly-report"
        element={<ProtectedRoute element={<Report />} />}
      />
      <Route
        path="/goals"
        element={<ProtectedRoute element={<GoalsAndSuggestions />} />}
      />
    </Routes>
  </Router>
);

export default App;
