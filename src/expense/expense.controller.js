const expenseService = require("./expense.service");
const expenseDTO = require("./expense.dto");
const autoBind = require("auto-bind");

class ExpenseController {
  constructor(expenseService) {
    this.service = expenseService;
    this.dto = expenseDTO;
    autoBind(this);
  }

  async addExpense(req, res, next) {
    try {
        const response = await this.service.addExpense( new this.dto.AddExpenseRequestDTO({ ...req.body, userId: req.user.id }) );
      response.data = new this.dto.ExpenseGetDTO(response.data);
      return res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getExpenses(req, res, next) {
    try {
        const response = await this.service.getExpenses( req.user.id );
        return res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getMonthlyExpenses(req, res, next) {
    try {
        const response = await this.service.getMonthlyExpenses( req.user.id, req.body.date );
        return res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new ExpenseController(expenseService);
