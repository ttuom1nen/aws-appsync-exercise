const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./schema/schema");
const testSchema = require("./schema/types_schema");

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: testSchema,
  })
);

const PORT = 4000;

app.listen(PORT, () => {
  console.log("Listening on port ", PORT);
});
