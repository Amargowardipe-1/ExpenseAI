require("dotenv").config();

const app = require("./app");

const connectDB = require("./config/database");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect Database
    await connectDB();

    // Start Server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server Startup Failed");
    console.error(error.message);

    process.exit(1);
  }
};

startServer();