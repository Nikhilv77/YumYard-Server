const mongoose = require("mongoose");
const SidesSchema = mongoose.Schema(
    {
      name: { type: String, require},
      price : {type : Number,require},
      category: { type: String, require},
      image: { type: String, require},
      description: { type: String, require},
    },
    { timestamps: true }
  )
const SidesModel = mongoose.model('sides', SidesSchema);
module.exports = SidesModel;
