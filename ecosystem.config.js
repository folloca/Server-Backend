module.exports = {
  apps: [
    {
      name: 'folloca-server',
      script: './dist/main.js',
      instances: 4,
      exec_mode: 'cluster',
      merge_logs: true,
      autorestart: true,
      watch: true,
      instance_var: 'INSTANCE_ID',
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
