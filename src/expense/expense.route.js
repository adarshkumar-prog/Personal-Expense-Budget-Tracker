const express = require('express');
const expenseController = require('./expense.controller');
const userController = require('../user/user.controller');

const router = express.Router();

router.post('/addExpense', userController.checkLogin, expenseController.addExpense);
router.get('/getExpenses', userController.checkLogin, expenseController.getExpenses);
router.get('/monthly-expenses', userController.checkLogin, expenseController.getMonthlyExpenses);
// router.put('/updateExpense/:id', expenseController.checkLogin, expenseController.updateExpense);
// router.delete('/deleteExpense/:id', expenseController.checkLogin, expenseController.deleteExpense);

module.exports = router;