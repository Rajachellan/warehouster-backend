const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    // Allow blog images uploaded on :4000 to display in admin (:5173) and frontend (:3000)
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    // Allow both common dev ports (3000 / 3001) because Next may auto-shift.
    origin: [config.clientUrl, config.frontendUrl, 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
    credentials: true,
  })
);
app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many form submissions. Please try again later.' },
});
app.use('/api/leads', leadLimiter);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Warehouster API is running', env: config.env });
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
