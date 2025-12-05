const express = require('express');
const budgetController = require('./budget.controller');
const userController = require('../user/user.controller');

const router = express.Router();

router.post('/setBudget', userController.checkLogin, budgetController.setBudget);
router.get('/getBudget', userController.checkLogin, budgetController.getBudget);
router.put('/updateBudget/:id', userController.checkLogin, budgetController.updateBudget);
router.delete('/deleteBudget/:id', userController.checkLogin, budgetController.deleteBudget);

module.exports = router;