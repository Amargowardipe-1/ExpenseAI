require("dotenv").config();

const app = require("./app");

const connectDB = require("./config/database");
require("./jobs/tempFileCleanup.job");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect Database
    await connectDB();

    // Start Server  — bind to 0.0.0.0 so real devices on Wi-Fi can connect
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📱 Real device access: http://192.168.1.45:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error("❌ Server Startup Failed");
    console.error(error.message);

    process.exit(1); 
  }
};

startServer();