const mongoose = require("mongoose");
const {
  mongodbPassword,
  mongodbUser,
  mongodbHost,
  mongodbName,
} = require("../config/keys");

if (!mongodbPassword) {
  console.error(
    'required env var MONGO_DB_PASSWORD not found, use "read -s MONGO_DB_PASSWORD; export MONGO_DB_PASSWORD" to export env var, exiting'
  );
  process.exit(-1);
}

mongoose
  .connect(
    `mongodb+srv://${mongodbUser}:${mongodbPassword}@${mongodbHost}/${mongodbName}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((e) => {
    console.log("Error connecting to MongoDB");
  });
