const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.stuller.com/", // <-- update
    defaultCommandTimeout: 12000,
    pageLoadTimeout: 60000,
    retries: {
      runMode: 2,
      openMode: 0
    },
    env: {
      username: "stullerqa24319", // set via CLI or cypress.env.json
      password: "5p!sazyPBq"
    },
    setupNodeEvents(on, config) {
      // keep empty unless you need plugins
      return config;
    },
  },
});