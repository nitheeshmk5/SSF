const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());

// Allow all origins for testing (update this for production)
//app.use(cors());
// Alternatively, specify allowed origins:
app.use(
  cors({
    origin: [, "http://localhost:5173", "http://192.168.0.101:5173"],
  })
);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "userdb",
});

db.connect((err) => {
  if (err) console.log("DB Connection Error:", err);
  else console.log("Connected to MySQL");
});

// Register User
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: "Error hashing password" });

    db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      (err) => {
        if (err) return res.status(500).json({ error: "User already exists" });
        res.json({ message: "User registered successfully" });
      }
    );
  });
});

// Login User
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err || results.length === 0)
      return res.status(400).json({ error: "Invalid email or password" });

    bcrypt.compare(password, results[0].password, (err, match) => {
      if (!match)
        return res.status(400).json({ error: "Invalid email or password" });
      res.json({ message: "Login successful" });
    });
  });
});

// Add Budget
app.post("/add-budget", (req, res) => {
  const { email, name, amount } = req.body;

  if (!email || !name || !amount) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const sql =
    "INSERT INTO budgets (email, name, amount, originalAmount) VALUES (?, ?, ?, ?)";
  db.query(sql, [email, name, amount, amount], (err, result) => {
    if (err) {
      console.error("Error adding budget:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Budget added successfully" });
  });
});

// Delete Budget
app.delete("/delete-budget", (req, res) => {
  const { email, name } = req.body;
  console.log("Deleting budget for:", email, "Budget Name:", name);

  if (!email || !name) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const sql = "DELETE FROM budgets WHERE email = ? AND name = ?";
  db.query(sql, [email, name], (err, result) => {
    if (err) {
      console.error("Error deleting budget:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Budget deleted successfully" });
  });
});

// Get Budgets
app.get("/get-budgets", (req, res) => {
  const email = req.query.email;
  db.query("SELECT * FROM budgets WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching budgets" });
    res.json(results);
  });
});

// Add Expense
app.post("/add-expense", (req, res) => {
  const { email, budgetName, expenseAmount, expenseDate, expenseName } =
    req.body;

  if (!email || !budgetName || !expenseAmount || !expenseDate || !expenseName) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const insertExpenseSql = `
    INSERT INTO expenses (email, budget_name, expense_amount, expense_date, expense_name)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    insertExpenseSql,
    [email, budgetName, expenseAmount, expenseDate, expenseName],
    (err, result) => {
      if (err) {
        console.error("Error inserting expense:", err);
        return res.status(500).json({ error: "Error inserting expense" });
      }

      const updateBudgetSql = `
        UPDATE budgets
        SET amount = amount - ?
        WHERE email = ? AND name = ?
      `;

      db.query(
        updateBudgetSql,
        [expenseAmount, email, budgetName],
        (err, result) => {
          if (err) {
            console.error("Error updating budget:", err);
            return res.status(500).json({ error: "Error updating budget" });
          }

          res.json({
            message: "Expense added successfully and budget updated",
          });
        }
      );
    }
  );
});

// Get Monthly Report
app.get("/get-monthly-report", (req, res) => {
  const email = req.query.email;

  const sql = `
    SELECT 
      MONTH(expense_date) AS month,
      YEAR(expense_date) AS year,
      SUM(expense_amount) AS total_expense
    FROM expenses
    WHERE email = ?
    GROUP BY YEAR(expense_date), MONTH(expense_date)
    ORDER BY YEAR(expense_date) DESC, MONTH(expense_date) DESC
  `;

  db.query(sql, [email], (err, results) => {
    if (err)
      return res.status(500).json({ error: "Error fetching monthly report" });

    const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);
    const data = allMonths.map((month) => {
      const monthData = results.find((item) => item.month === month);
      return {
        month,
        year: new Date().getFullYear(),
        total_expense: monthData ? monthData.total_expense : 0,
      };
    });

    res.json(data);
  });
});

// Get Expenses for a Specific Month
app.get("/get-expenses-for-month", (req, res) => {
  const { email, month } = req.query;

  const sql = `
    SELECT expense_name, expense_amount
    FROM expenses
    WHERE email = ? AND MONTH(expense_date) = ?
  `;

  db.query(sql, [email, month], (err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching expenses" });
    res.json(results);
  });
});

// Add Goal
app.post("/add-goal", (req, res) => {
  const { email, goalName, targetAmount, targetDate } = req.body;

  if (!email || !goalName || !targetAmount || !targetDate) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const sql =
    "INSERT INTO goals (email, goal_name, target_amount, target_date) VALUES (?, ?, ?, ?)";
  db.query(sql, [email, goalName, targetAmount, targetDate], (err, result) => {
    if (err) {
      console.error("Error adding goal:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Goal added successfully" });
  });
});

// Get Goals
app.get("/get-goals", (req, res) => {
  const email = req.query.email;
  db.query("SELECT * FROM goals WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching goals" });
    res.json(results);
  });
});

// Start server on 0.0.0.0 to allow network access
app.listen(5000, "0.0.0.0", () => console.log("Server running on port 5000"));
