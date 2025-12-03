const mongoose = require('mongoose');

async function connectToDatabase(url) {

    try {
        return await mongoose.connect(url);
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
}

module.exports = {
    connectToDatabase,
};
