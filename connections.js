const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Dashboard");
    console.log("mongodb Connected");
  } catch (error) {
    console.log("mongodb connection error", error);
  }
};

module.exports = { connection };
