require("dotenv").config();

const env = {
  port: Number(process.env.PORT || 5000),
  mongodbUri:
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/transport_diagnostic_bounty",
  javaEngineUrl: process.env.JAVA_ENGINE_URL || "http://localhost:8080",
  useMockEngine: process.env.USE_MOCK_ENGINE !== "false",
  geminiApiKey: process.env.GEMINI_API_KEY
};

module.exports = { env };
