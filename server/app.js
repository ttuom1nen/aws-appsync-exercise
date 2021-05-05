const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
// const mongodb = process.env.MONGODB_URL;
// console.log(mongodb);

const schema = require("./schema/schema");

const app = express();

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Connected!");
});

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: schema,
  })
);

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Listening on port ", PORT);
});
