import 'dotenv/config';

const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    port: process.env.PORT || 5000,
    nodeEnv: 'development',
  },
  production: {
    port: process.env.PORT || 3000,
    nodeEnv: 'production',
  },
  test: {
    port: process.env.PORT || 5001,
    nodeEnv: 'test',
  },
};

const configObj = {
  ...config[env],
  env,
};

export default configObj;
