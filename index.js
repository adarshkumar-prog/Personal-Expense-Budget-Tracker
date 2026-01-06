require('dotenv').config();
const express = require('express');
const { connectToDatabase } = require('./connect');
const userRoutes = require('./src/user/user.routes.js');
const expenseRoutes = require('./src/expense/expense.route');
const budgetRoutes = require('./src/budget/budget.route');

const app = express();
const port = process.env.PORT || 5001;
const MONGOURL = process.env.MONGODB_URI;

app.use(express.json());
app.use('/users', userRoutes);
app.use('/expenses', expenseRoutes);
app.use('/budgets', budgetRoutes);


connectToDatabase(MONGOURL).then(() => {
    console.log('Connected to the database successfully');
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    })
})