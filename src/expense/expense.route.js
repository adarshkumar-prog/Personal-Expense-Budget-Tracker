const express = require('express');
const expenseController = require('./expense.controller');
const userController = require('../user/user.controller');

const router = express.Router();

router.post('/addExpense', userController.checkLogin, expenseController.addExpense);
router.get('/getExpenses', userController.checkLogin, expenseController.getExpenses);
router.get('/monthly-expenses', userController.checkLogin, expenseController.MonthlyExpenses);
router.get('/monthly-expense-amount', userController.checkLogin, expenseController.MonthlyExpenseAmount);
router.get('/get-pdf', userController.checkLogin, expenseController.getExpensePDF);
router.get('/highest-spending-month', userController.checkLogin, expenseController.HighestSpendingMonth);
router.get('/lowest-spending-month', userController.checkLogin, expenseController.LowestSpendingMonth);
router.get('/average-monthly-expense', userController.checkLogin, expenseController.AverageMonthlyExpense);
router.put('/updateExpense/:id', userController.checkLogin, expenseController.updateExpense);
router.delete('/deleteExpense/:id', userController.checkLogin, expenseController.deleteExpense);

// Highest spending month

// Average monthly expense
module.exports = router;