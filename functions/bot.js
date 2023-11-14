const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

exports.handler = async (event) => {
  // Remplacez 'YOUR_BOT_TOKEN', 'DEXSCREENER_API_URL', et 'YOUR_CHAT_ID' par les variables d'environnement Netlify
  const token = '6620822179:AAEFuaoJZY9f91JebAdzS1Wf3FS9H5Y3Yqs'; //process.env.BOT_TOKEN;
  const dexscreenerApiUrl = 'https://api.dexscreener.com/latest/dex/pairs/ethereum/0x4028daac072e492d34a3afdbef0ba7e35d8b55c4';
  const chatId = '-4024637922';

  const bot = new TelegramBot(token);

  // Fonction pour obtenir le prix de l'ETH en USDC depuis Dexscreener
  async function get_stETH_WETH_Price() {
    try {
      console.log('try to get price');
        const response = await axios.get(dexscreenerApiUrl);
        const pairs = response.data.pairs;
  
        // Recherchez la paire ETH/USDC dans la liste des paires
        const pair = pairs.find(pair =>
            pair.baseToken.symbol === 'stETH' && pair.quoteToken.symbol === 'WETH'
        );
  
        //console.log(`url : ${response.data.pair.url}`);
  
        url=response.data.pair.url;
  
        if (pair) {
            const priceNative = pair.priceNative;
            if(priceNative<0.99999){
              return {msg:'*stETH<0.995 in uniswap V2 :*', priceNative:priceNative, url:url};
            } else if (priceNative>1){
              return {msg:'*stETH>1 in uniswap V2 :*',priceNative:priceNative, url:url};
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

  // Fonction pour envoyer le prix dans le canal Telegram
  async function send_stETH_WETH_Price() {
    const results = await get_stETH_WETH_Price();
    if (results.priceNative !== null) {
      const message = `${results.msg}\nstETH = ${results.priceNative} WETH \n${results.url}`;
      bot.sendMessage(chatId, message, { parse_mode: 'Markdown', disable_web_page_preview: true });
    }
  }

  // Déclencher la fonction toutes les minutes
  setInterval(() => {
    send_stETH_WETH_Price();
  }, 1 * 1000); // 1 minute en millisecondes

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Function executed successfully' }),
  };
};