const ContactUs = require("..//Models/ContactUsModel");
const express = require("express");
const router = express.Router();

const getAllContacts = router.get("/getallcontacts", async (req, res) => {
  try {
    const contacts = await ContactUs.find();
    res.send(contacts);
  } catch (error) {
    res.status(400).json({ message: "Could not load contacts" });
  }
});

const submitContact = router.post("/submitcontact", async (req, res) => {
  const name = req.body.data.name;
  const email = req.body.data.email;
  const number = req.body.data.number;
  const category = req.body.data.category;
  const message = req.body.data.message;
  const isCustomer = req.body.data.isCustomer;

  try {
    const newContact = new ContactUs({
      name,
      email,
      number,
      category,
      message,
      isCustomer,
    });
    await newContact.save();
    res.send("Contact Added Successfully");
  } catch (error) {
    res.status(400).json({ message: "Could not add contact" });
  }
});
module.exports = { getAllContacts, submitContact };
