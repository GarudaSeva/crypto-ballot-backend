require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto-ballot';

const blockchain = require('./lib/blockchain');

(async () => {
  try {
    await connectDB(MONGODB_URI);
    await blockchain.initialize();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`API server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
