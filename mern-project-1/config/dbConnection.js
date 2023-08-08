const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.CONNECTIONS_STRING);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDb;
