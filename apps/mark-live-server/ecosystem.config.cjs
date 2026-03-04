/** PM2 进程配置，用于部署 dist-bundle */
module.exports = {
  apps: [
    {
      name: 'mark-live-server',
      script: './dist-bundle/index.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      env: {},
      env_production: {},
    },
  ],
};
