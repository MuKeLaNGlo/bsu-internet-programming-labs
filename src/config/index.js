require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api',

  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100
  },

  corsOptions: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  },

  rateLimiting: {
    windowMs: 15 * 60 * 1000,
    max: 100
  }
};