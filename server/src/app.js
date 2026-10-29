// const express = require('express');
 
// const app = express();
 
// app.use(express.json());
 
// app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
 
// module.exports = app;
const express = require('express');

 
const logger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const departmentRoutes = require('./routes/departmentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
 
const app = express();
 
const cors = require('cors');
 
//app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());
 
app.use(cors({ origin: allowedOrigins }));

app.use(express.json());


app.use(express.json());
app.use(logger);
 
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
// app.use('/api/employee', employeeRoutes);
 
// Always last: unknown routes, then errors
app.use(notFound);
app.use(errorHandler);
 
module.exports = app;

