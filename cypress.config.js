const { defineConfig } = require("cypress");
const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');
const { Telegraf } = require("telegraf");
const { FmtString } = require("telegraf/format");

module.exports = defineConfig({
  // These settings apply everywhere unless overridden
  defaultCommandTimeout: 5000,
  viewportWidth: 1000,
  viewportHeight: 600,
  includeShadowDom: true,
  env: {
    DEMO: 'demo value',
  },
  e2e: {
    // baseUrl: 'http://localhost:1234',
    // this is to prevent cypress from removing old screenshots
    trashAssetsBeforeRuns: false,
    supportFile: false,
    specPattern: "tests/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) {
      const env = dotenv.config().parsed;
      // Add environment variables to Cypress config
      // config.env.TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
      config.env = Object.assign(config.env, dotenvParseVariables(env))
      console.log('environment', config.env)

      on("task", {
        log(message) {
          console.log(message);
          return null;
        },

        telegramNotification({ chatID, message }) {
          // @see https://telegraf.js.org/classes/Telegram.html#constructor
          const app = new Telegraf(config.env.TELEGRAM_BOT_TOKEN);
          const formattedMessage = new FmtString(message);
          return app.telegram.sendMessage(chatID, formattedMessage, {
            parse_mode: "MarkdownV2",
          });
        },
      });

      // Return updated Cypress config
      return config
    },
  },
});
