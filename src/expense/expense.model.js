const mongoose = require("mongoose");
const { Schema } = mongoose;

const expenseSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Food",
        "Groceries",
        "Transport",
        "Rent",
        "Utilities",
        "Entertainment",
        "Health",
        "Education",
        "Shopping",
        "Travel",
        "Subscriptions",
        "Insurance",
        "EMI",
        "Personal Care",
        "Gifts",
        "Other",
      ],
      required: true,
      default: "Other",
    },
    description: {
      type: String,
      default: "",
    },
    day: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const ExpenseModel = mongoose.model("ExpenseModel", expenseSchema);
module.exports = ExpenseModel;
