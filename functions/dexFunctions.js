const axios = require('axios');

async function get_stETH_WETH_Price() {
  try {
    console.log("get eth");
    const dexscreenerApiUrl = 'https://api.dexscreener.com/latest/dex/pairs/ethereum/0x4028daac072e492d34a3afdbef0ba7e35d8b55c4';
    const response = await axios.get(dexscreenerApiUrl);
    const pairs = response.data.pairs;
    console.log("get eth");
    const pair = pairs.find(pair =>
      pair.baseToken.symbol === 'stETH' && pair.quoteToken.symbol === 'WETH'
    );
    console.log("pair");
    if (pair) {
      const priceNative = pair.priceNative;
      let msg = '';

      if (priceNative < 1) {
        msg = '*stETH < 0.999 in Uniswap V2:*';
        return { msg, priceNative, url: response.data.pair.url };
      } else if (priceNative > 1) {
        msg = '*stETH > 1 in Uniswap V2:*';
        return { msg, priceNative, url: response.data.pair.url };
      }

      
    } else {
      console.error('La paire stETH/WETH n\'a pas été trouvée.');
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du prix depuis Dexscreener:', error.message);
    return null;
  }
}
/*
module.exports = {
  get_stETH_WETH_Price,
};
*/

const TelegramBot = require('node-telegram-bot-api');

//const { get_stETH_WETH_Price } = require('./functions/dexFunctions');

const token = '6620822179:AAEFuaoJZY9f91JebAdzS1Wf3FS9H5Y3Yqs';
const chatId = '-4024637922';

// Initialiser le bot Telegram
const bot = new TelegramBot(token, { polling: true });
console.log("booot");

// Écouter les commandes /start
bot.onText(/\/start/, (msg) => {
  console.log("start");
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Bienvenue! Je suis votre bot Dexscreener.');
});

// Fonction pour envoyer le prix dans le canal Telegram
async function send_stETH_WETH_Price() {
  console.log("send eth");
  const results = await get_stETH_WETH_Price();
  console.log(results);
  if (results && results.priceNative !== null) {
      const message = `${results.msg}\nstETH = ${results.priceNative} WETH \n${results.url}`;
      console.log("succeed eth");

      // Envoyer le message
      bot.sendMessage(chatId, message, { parse_mode: 'Markdown', disable_web_page_preview: true });
  }
}

/*
// Déclencher la fonction toutes les minutes
setInterval(() => {
  send_stETH_WETH_Price();
}, 10 * 1000); // 1 minute en millisecondes
*/