// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/project_final";

console.log(

  `Initiating the connection to database on ${MONGO_URI}`
);
const connect = async () => {
  return await mongoose.connect(MONGO_URI);
};

module.exports = connect;
