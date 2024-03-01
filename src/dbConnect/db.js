const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error);
    console.error("URI de conexión:", process.env.MONGODB_URI);
  }
}

module.exports = connectDB;
