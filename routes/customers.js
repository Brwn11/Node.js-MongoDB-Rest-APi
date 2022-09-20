const express = require("express");
const app = express.Router();
app.use(express.json());
const mongoose = require("mongoose");
const Joi = require("joi");
const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
  },
  phone: { type: String, required: true, min: 3, max: 10 },
  isGold: { type: Boolean, required: true, default: false },
});
const Customer = mongoose.model("Customers", customerSchema);

async function getCustomers() {
  const customers = await Customer.find();
  return customers;
}
// GET
app.get("/", async (req, res) => {
  const customers = await getCustomers();
  res.send(customers);
});
// POST
app.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let customer = Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  try {
    const result = await customer.save();
    res.send(result);
  } catch (err) {
    console.log(err.message);
    res.send(err);
  }
});
// PUT
app.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
    { new: true }
  );
  if (!customer)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(customer);
});

// DELET
app.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(customer);
});
// Get BY ID
app.get("/:id" , async (req,res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(customer);
});
function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(3).required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
}

module.exports = app;
