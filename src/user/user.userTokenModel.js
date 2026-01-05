const mongoose = require('mongoose');
const { Schema } = mongoose;


const userTokenSchema = new Schema({
    'token': {
        type: String,
        required: true,
    },
    'userId': {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    'expiresAt': {
        type: Date,
        default: () => new Date(+new Date() + 7*24*60*60*1000),
    },
}, { 'timestamps': true });

const userTokenModel = mongoose.model('UserToken', userTokenSchema);

module.exports = userTokenModel;