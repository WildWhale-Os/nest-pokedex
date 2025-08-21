export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGO_URI,
  defaultLimit: process.env.DEFAULT_LIMIT || 7,
});
