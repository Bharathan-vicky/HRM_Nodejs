// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const empRoutes = require('./routes/employees.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const configRoutes = require('./routes/config.routes');
const errorHandler = require('./middlewares/error.middleware');

const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', empRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/config', configRoutes);

app.get('/', (req, res) => res.send({ message: 'HRM Location Backend API' }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
