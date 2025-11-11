// config for the project: keep a JWT secret and export it
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

module.exports = { JWT_SECRET };