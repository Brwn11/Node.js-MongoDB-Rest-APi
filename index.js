const express = require("express");
const mongoose = require("mongoose");

const customers = require('./routes/customers');

const app = express();
app.use(express.json());
app.use('/api/customers', customers);

mongoose
  .connect("mongodb://localhost/customers")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
