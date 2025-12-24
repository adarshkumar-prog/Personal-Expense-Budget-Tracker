const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
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
      const budgetData = await this.budgetModel.findOne({
        userId,
        month: expenseDTO.month,
        year: expenseDTO.year,
      });
      if (budgetData) {
        if (budgetData.monthlyLimit < expenseDTO.amount) {
          throw new Error("Expense amount exceeds the monthly budget limit");
        }
        if (budgetData.monthlyLimit === expenseDTO.amount) {
          await sendSMS(
            `+91${user.phone}`,
            "🚨 Budget Alert: You have reached your expense limit"
          );
        }
        budgetData.monthlyLimit -= expenseDTO.amount;
        await budgetData.save();
      } else {
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

  async getExpensePDF(userId) {
    const expenses = await ExpenseModel.find({ userId }).sort({
      createdAt: -1,
    });

    if (!expenses.length) {
      throw new Error("No expenses found");
    }

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));

    doc.fontSize(20).text("Expense Report", { align: "center" }).moveDown();

    doc
      .fontSize(12)
      .text(`Generated on: ${new Date().toLocaleDateString()}`)
      .moveDown(2);

    const headerY = doc.y;

doc
  .fontSize(12)
  .text("date", 40, headerY, { width: 80 })
  .text("category", 120, headerY, { width: 100 })
  .text("description", 220, headerY, { width: 180 })
  .text("amount(INR)", 420, headerY, { width: 90 });

doc.moveDown();


    doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();

    let total = 0;

    const safeString = (v) => (v === undefined || v === null ? "" : String(v));
    const safeNumber = (v, fallback = 0) =>
      Number.isFinite(v)
        ? v
        : Number.isFinite(Number(v))
        ? Number(v)
        : fallback;

    let y = doc.y + 8;
    const lineHeight = 18;

    expenses.forEach((exp) => {
      const amount = safeNumber(exp.amount, 0);
      total += amount;

      const description = safeString(exp.description);
      const category = safeString(exp.category);

      const date = safeString(
        exp.date ||
          (exp.createdAt ? new Date(exp.createdAt).toLocaleDateString() : "")
      );

      if (y > doc.page.height - doc.page.margins.bottom - 50) {
        doc.addPage();
        y = doc.y + 8;
      }

      doc
        .fontSize(10)
        .text(date, 40, y, { width: 80 })
        .text(category, 120, y, { width: 100 })
        .text(description, 220, y, { width: 180 })
        .text(amount.toFixed(2), 420, y, { width: 90, align: "right" });

      y += lineHeight;
    });

    doc
      .moveDown(2)
      .fontSize(12)
      .text(`Total Expense: INR ${total.toFixed(2)}`, { align: "right" });

    doc.end();

    const pdfBuffer = await new Promise((resolve) => {
      doc.on("end", () => {
        resolve(Buffer.concat(buffers));
      });
    });

    return { data: pdfBuffer };
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
      const budgetData = await this.budgetModel.findOne({
        userId,
        month: expense.month,
        year: expense.year,
      });
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
      if (!expense.userId.equals(user.id)) {
        throw new Error("Unauthorized access");
      }
      const previousAmount = expense.amount;
      const budgetData = await this.budgetModel.findOne({
        userId,
        month: expense.month,
        year: expense.year,
      });
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

module.exports = new ExpenseService(ExpenseModel, userModel, budgetModel, {
  sendSMS,
});
