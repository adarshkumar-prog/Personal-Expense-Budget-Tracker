const mongoose = require('mongoose');
const { Schema } = mongoose;

const BudgetSchema = new Schema({
    'userId' : {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    'monthlyLimit' : {
        type: Number,
        required: true,
    },
    'month' : {
        type: String,
        required: true,
    },
    'year' : {
        type: Number,
        required: true,
    }
}, { 'timestamps': true });

const BudgetModel = mongoose.model('BudgetModel', BudgetSchema);
module.exports = BudgetModel;