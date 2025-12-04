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
    }
});
const userTokenModel = mongoose.model('UserToken', userTokenSchema);

module.exports = userTokenModel;