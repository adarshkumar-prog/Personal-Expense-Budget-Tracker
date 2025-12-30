module.exports.config = {
    JWT_SECRET: process.env.JWT_SECRET || 'S0M3S3CR3TK3Y',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'R3FR3SHS3CR3TK3Y',
}