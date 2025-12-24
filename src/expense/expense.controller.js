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

  async MonthlyExpenses(req, res, next) {
    try {
        const response = await this.service.MonthlyExpenses( req.user.id, req.body.month, req.body.year );
        return res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getExpensePDF(req, res, next) {
  try {
    const response = await this.service.getExpensePDF(req.user.id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="expenses.pdf"'
    );
    res.setHeader('Content-Length', response.data.length);

    return res.status(200).send(response.data);
  } catch (error) {
    next(error);
  }
}

  async HighestSpendingMonth(req, res, next) {
    try {
      const year = req.query.year;
        const response = await this.service.HighestSpendingMonth( req.user.id, year );
        return res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async LowestSpendingMonth(req, res, next) {
    try {
        const year = req.query.year;
        const response = await this.service.LowestSpendingMonth( req.user.id, year );
        return res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async AverageMonthlyExpense(req, res, next) {
    try {
        const year = req.query.year;
        const month = req.query.month;
        const response = await this.service.AverageMonthlyExpense( req.user.id, year, month );
        return res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async MonthlyExpenseAmount(req, res, next) {
    try {
        const response = await this.service.MonthlyExpenseAmount( req.user.id, req.body.year, req.body.month );
        return res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  async updateExpense(req, res, next) {
    try {
        const response = await this.service.updateExpense( req.params.id, new this.dto.AddExpenseRequestDTO({ ...req.body, userId: req.user.id }) );
        response.data = new this.dto.ExpenseGetDTO(response.data);
        return res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteExpense(req, res, next) {
    try {
        const response = await this.service.deleteExpense( req.params.id, req.user.id );
        return res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new ExpenseController(expenseService);
