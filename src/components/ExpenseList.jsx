import React from 'react';

function ExpenseList({ expenses }) {
  return (
    <ul className="space-y-2">
      {expenses.map((expense) => (
        <li
          key={expense.id}
          className="p-2 border rounded flex justify-between"
        >
          <span>{expense.description}</span>
          <span>${expense.amount.toFixed(2)}</span>
        </li>
      ))}
    </ul>
  );
}

export default ExpenseList;
