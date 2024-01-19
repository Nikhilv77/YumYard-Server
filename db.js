const mongoose = require("mongoose");
let url =
  `${process.env.MONGO_URI}`;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("connected", () => {
  console.log("databse connected successfully");
});
db.on("error", () => {
  console.log("database connection failed");
});
module.exports = mongoose;
