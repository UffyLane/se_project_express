module.exports = {
  apps: [
    {
      name: "wtwr-api",
      script: "app.js",
      cwd: "/home/uffylane07/se_project_express",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3001
      }
    }
  ]
};
