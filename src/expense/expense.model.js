const mongoose = require('mongoose');
const { Schema } = mongoose;

const expenseSchema = new Schema({
    'userId' : {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    'amount' : {
        type: Number,
        required: true,
    },
    'category' : {
        type: String,
        enum: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other'],
        required: true,
        default: 'Other',
    },
    'description' : {
        type: String,
        default: '',
    },
    'date' : {
        type: Date,
        required: true,
        default: Date.now,
    }
}, { 'timestamps': true });

const ExpenseModel = mongoose.model('ExpenseModel', expenseSchema);
module.exports = ExpenseModel;