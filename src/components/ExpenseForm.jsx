import React, { useState } from 'react';

function ExpenseForm({ onAddExpense }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, amount }),
    });
    const newExpense = await response.json();
    onAddExpense(newExpense);
    setDescription('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="block w-full p-2 border rounded"
        required
      />
      <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded">
        Add Expense
      </button>
    </form>
  );
}

export default ExpenseForm;
