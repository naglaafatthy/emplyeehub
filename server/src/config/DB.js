
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); // use Google/Cloudflare DNS (fixes querySrv ESERVFAIL)
 
const mongoose = require('mongoose');
 
// Connects once at startup. If it fails there is no point running the API.
async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}
 
module.exports = connectDB;
