const Feedback = require('../Models/FeedbackModel')
const express = require("express");
const router = express.Router();

const getAllFeedbacks = router.get("/getallfeedbacks", async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.send(feedbacks);
  } catch (error) {
    res.status(400).json({ message: "Could not load feedbacks" });
  }
});

const submitFeedback = router.post("/submitfeedback", async (req, res) => {
  const name = req.body.data.name;
  const email = req.body.data.email;
  const rating = req.body.data.rating;
  const comment = req.body.data.comment;
  const isCustomer = req.body.data.isCustomer;

  try {
    const newFeedback = new Feedback({
      name,
      email,
     rating,
     comment,
     isCustomer,
    });
    await newFeedback.save();
    res.send("Feedback Added Successfully");
  } catch (error) {
    res.status(400).json({ message: "Could not add feedback" });
  }
});
module.exports = { getAllFeedbacks,submitFeedback };
