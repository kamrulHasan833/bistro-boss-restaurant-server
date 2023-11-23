// require external moduls
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// require internal modules
const mongodb_config = require("./mongodb/mongodb.config");
const createJWTToken = require("./authentication/createJWTToken");
const { paymentIntent } = require("./handlers/postHandlers");
// create express app
const app = express();

// declare app port
const port = process.env.PORT || 5000;

// use external middleware
app.use(express.json());
app.use(cors());

// create routes or apis
app.get("/", (req, res) => {
  res.send("Bistro Boss server is running..");
});
// athenticate with jwt
app.post("/bistro-boss-restaurant/v1/signin", createJWTToken);
// create payment intent
app.post("/create-payment-intent", paymentIntent);
// configure and api data from mongodb
mongodb_config(app);

app.listen(port, () => {
  console.log(`Server is listening on prot: ${port}...`);
});
