const mongoose = require("mongoose");
const feedbackSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    isCustomer: { type: Boolean, required: true },
  },
  { timestamps: true }
);
const Feedback = mongoose.model("feedbacks", feedbackSchema);
module.exports = Feedback;
