// ========================================================
// PM2 ECOSYSTEM CONFIGURATION FOR DYARI BACKEND
// Used to keep Node.js API server running 24/7 on VPS
// ========================================================

module.exports = {
  apps: [
    {
      name: 'dyari-api',
      script: './server/index.js',
      cwd: '/var/www/dyariapp.my.id',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
