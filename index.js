const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');
const puppeteer = require('puppeteer');
const { Telegraf } = require("telegraf");
const { FmtString } = require("telegraf/format");

const env = dotenv.config().parsed;
const parsedEnv = Object.assign({}, dotenvParseVariables(env))

const telegramNotification = async ({ chatID, message }) => {
  // @see https://telegraf.js.org/classes/Telegram.html#constructor
  const app = new Telegraf(parsedEnv.TELEGRAM_BOT_TOKEN);
  const formattedMessage = new FmtString(message);
  return await app.telegram.sendMessage(chatID, formattedMessage, {
    parse_mode: "MarkdownV2",
  });
}

(async () => {
  // Launch a new browser instance
  const browser = await puppeteer.launch();

  // Open a new page
  const page = await browser.newPage();

  // Navigate to the desired URL
  await page.goto('https://cccfl.as.me/schedule.php?location=1771+N.+Semoran+Blvd%2C+Orlando+FL+32807');

  // Select the HTML node using page.$eval()
  const element = await page.$('#step-pick-appointment'); // Replace 'selector' with your CSS selector

  if (element) {
    // Take a screenshot of the HTML node
    const date = new Date();
    let filename = date.getTime() + "-appointment-step.png"
    await element.screenshot({ path: 'cypress/screenshots/' + filename });
  } else {
    console.error('Element not found');
  }

  const noTimesElement = await page.$("#no-times-available-message")
  if (noTimesElement) {
    console.log("No appointment times");
    if (parsedEnv.DEBUG) {
      await telegramNotification({
        chatID: parsedEnv.TARGET_CHAT_ID,
        message: "Testing",
      })
    }
  } else {
    console.log('MIGHT BE TIMES AVAILABLE!!!');
    // element not present, so, let's book the appointment
    await telegramNotification({
      chatID: parsedEnv.TARGET_CHAT_ID,
      message: "*Hurry Apurate*, hay nuevas citas disponibles.",
    })
  }

  // Close the browser
  await browser.close();
})();
