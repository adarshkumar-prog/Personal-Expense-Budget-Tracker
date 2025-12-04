const mongoose = require("mongoose");
const ExpenseModel = require("../expense/expense.model");
const userModel = require("../user/user.models");
const autoBind = require("auto-bind");

class ExpenseService {
  constructor(ExpenseModel, userModel) {
    this.expenseModel = ExpenseModel;
    this.userModel = userModel;
    autoBind(this);
  }

  async addExpense(expenseDTO) {
    try {
      const userId = expenseDTO.userId;
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const expenseData = await this.expenseModel.create({
        ...expenseDTO,
        userId: user.id,
      });
      if (expenseData) {
        return {
          data: expenseData.toJSON(),
          message: "Expense added successfully",
        };
      }
      throw new Error("Adding expense failed");
    } catch (error) {
      throw error;
    }
  }

  async getExpenses(userId) {
    try {
      const expenses = await this.expenseModel
        .find({ userId })
        .sort({ createdAt: -1 });
      return {
        count: expenses.length,
        data: expenses,
        message: "Expenses fetched successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async getMonthlyExpenses(userId, date) {
    const month = {
      month: date.month,
      year: date.year,
    };
    try {
      const startDate = new Date(month.year, month.month - 1, 1);
      const endDate = new Date(month.year, month.month, 0);
      endDate.setHours(23, 59, 59, 999);

      const expenses = await this.expenseModel
        .find({
          userId,
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .sort({ date: -1 });

      return {
        count: expenses.length,
        data: expenses,
        message: "Monthly expenses fetched successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ExpenseService(ExpenseModel, userModel);
