const mongoose = require("mongoose");
const bevarageSchema = mongoose.Schema(
    {
      name: { type: String, require},
      price : {type : Number,require},
      category: { type: String, require},
      image: { type: String, require},
      description: { type: String, require},
    },
    { timestamps: true }
  )
const bevarageModel = mongoose.model('bevarages', bevarageSchema);
module.exports = bevarageModel;
