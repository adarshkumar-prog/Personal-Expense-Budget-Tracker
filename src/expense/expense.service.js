const mongoose = require("mongoose");
const ExpenseModel = require("../expense/expense.model");
const userModel = require("../user/user.models");
const budgetModel = require("../budget/budget.model");
const { sendSMS } = require("../notification/index");
const autoBind = require("auto-bind");

class ExpenseService {
  constructor(ExpenseModel, userModel, budgetModel, sendSMS) {
    this.expenseModel = ExpenseModel;
    this.budgetModel = budgetModel;
    this.userModel = userModel;
    this.sendSMS = sendSMS;
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
      const budgetData = await this.budgetModel.findOne({ userId, month: expenseDTO.month, year: expenseDTO.year });
      if (budgetData) {
        if (budgetData.monthlyLimit < expenseDTO.amount) {
          throw new Error("Expense amount exceeds the monthly budget limit");
        }
        if (budgetData.monthlyLimit === expenseDTO.amount) {
          await sendSMS(
            `+91${user.phone}`,
            '🚨 Budget Alert: You have reached your expense limit');
        }
        budgetData.monthlyLimit -= expenseDTO.amount;
        await budgetData.save();
      }
      else {
        throw new Error("No budget set for this month and year");
      }
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

  async getMonthlyExpenses(userId, month, year) {
    try {
      const expenses = await this.expenseModel
        .find({ userId, month, year })
        .sort({ createdAt: -1 });
      return {
        count: expenses.length,
        data: expenses,
        message: "Monthly expenses fetched successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async updateExpense(expenseId, expenseDTO) {
    try {
      const userId = expenseDTO.userId;
      const expense = await this.expenseModel.findById(expenseId);
      if (!expense) {
        throw new Error("Expense not found");
      }
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      if (!expense.userId.equals(user.id)) {
        throw new Error("Unauthorized access");
      }

      const previousAmount = expense.amount;
      const budgetData = await this.budgetModel.findOne({ userId, month: expense.month, year: expense.year });
      if (budgetData) {
        budgetData.monthlyLimit += previousAmount;
        budgetData.monthlyLimit -= expenseDTO.amount;
        await budgetData.save();
      }

      const expenseData = await this.expenseModel.findByIdAndUpdate(
        expenseId,
        expenseDTO,
        { new: true }
      );
      if (expenseData) {
        return {
          data: expenseData.toJSON(),
          message: "Expense updated successfully",
        };
      }
      throw new Error("Updating expense failed");
    } catch (error) {
      throw error;
    }
  }

  async deleteExpense(expenseId, userId) {
    try {
      const expense = await this.expenseModel.findById(expenseId);
      if (!expense) {
        throw new Error("Expense not found");
      }
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      console.log(user);
      if (!expense.userId.equals(user.id)) {
        throw new Error("Unauthorized access");
      }
      const previousAmount = expense.amount;
      const budgetData = await this.budgetModel.findOne({ userId, month: expense.month, year: expense.year });
      if (budgetData) {
        budgetData.monthlyLimit += previousAmount;
        await budgetData.save();
      }

      await this.expenseModel.findByIdAndDelete(expenseId);
      return {
        message: "Expense deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ExpenseService(ExpenseModel, userModel, budgetModel, { sendSMS });
