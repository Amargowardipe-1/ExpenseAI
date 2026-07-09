const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./modules/auth/auth.routes");
const categoryRoutes = require("./modules/category/category.routes");
const expenseRoutes = require("./modules/expense/expense.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");


const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/error.middleware");

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);




app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "ExpenseAI Backend Running",
    data: null,
  });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;