const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const voterRoutes = require('./routes/voters');
const electionRoutes = require('./routes/elections');
const voteRoutes = require('./routes/votes');
const resultsRoutes = require('./routes/results');
const dashboardRoutes = require('./routes/dashboard');
const blockchainRoutes = require('./routes/blockchain');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || '*', credentials: true }));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/voters', voterRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/blockchain', blockchainRoutes);

app.use((req, res) => res.status(404).json({ message: 'Not found' }));

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

module.exports = app;
