module.exports = {
  apps: [
    {
      name: 'folloca-server',
      script: './dist/main.js',
      watch: false,
      env_development: {
        NODE_ENV: 'development',
      },
      env_test: {
        NODE_ENV: 'test',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
