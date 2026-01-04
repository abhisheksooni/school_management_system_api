module.exports = {
  apps: [
    {
      name: "school-backend",
      script: "./app.js",
      watch: true,
      ignore_watch: ["node_modules", "uploads"],
      watch_options: {
        followSymlinks: false,
        usePolling: true,
        interval: 1000
      },
      env: {
        NODE_ENV: "development"
      }
    }
  ]
};
