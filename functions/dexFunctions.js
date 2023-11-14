const axios = require('axios');

async function get_stETH_WETH_Price() {
  try {
    const dexscreenerApiUrl = 'https://api.dexscreener.com/latest/dex/pairs/ethereum/0x4028daac072e492d34a3afdbef0ba7e35d8b55c4';
    const response = await axios.get(dexscreenerApiUrl);
    const pairs = response.data.pairs;

    const pair = pairs.find(pair =>
      pair.baseToken.symbol === 'stETH' && pair.quoteToken.symbol === 'WETH'
    );

    if (pair) {
      const priceNative = pair.priceNative;
      let msg = '';

      if (priceNative < 0.995) {
        msg = '*stETH < 0.995 in Uniswap V2:*';
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

module.exports = {
  get_stETH_WETH_Price,
};