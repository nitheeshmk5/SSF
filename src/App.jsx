import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

function App() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/expenses')
      .then((res) => res.json())
      .then((data) => setExpenses(data));
  }, []);

  const addExpense = (newExpense) => {
    setExpenses((prev) => [...prev, newExpense]);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">Self-Finance App</h1>
      <ExpenseForm onAddExpense={addExpense} />
      <ExpenseList expenses={expenses} />
    </div>
  );
}

export default App;
