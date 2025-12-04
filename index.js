const express = require('express');
const { connectToDatabase } = require('./connect');
const userRoutes = require('./src/user/user.routes');
const expenseRoutes = require('./src/expense/expense.route');

const app = express();
const port = 5001;

app.use(express.json());
app.use('/users', userRoutes);
app.use('/expenses', expenseRoutes);


connectToDatabase('mongodb://localhost:27017/personal-expense-and-income-tracker').then(() => {
    console.log('Connected to the database successfully');
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    })
})