// functions/api.js
const serverless = require('serverless-http');
const app = require('../server'); // <-- Perubahan di sini! Sesuaikan path ini

// Ini adalah handler yang akan dieksekusi oleh Netlify Function
exports.handler = serverless(app);