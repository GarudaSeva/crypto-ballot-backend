const blockchain = require('../lib/blockchain');

async function getBlockchain(req, res) {
  try {
    const chain = await blockchain.getChain();
    const isValid = await blockchain.isValid();
    res.json({ chain, isValid, length: chain.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getBlockchain };
