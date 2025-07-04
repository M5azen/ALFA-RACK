const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
      unique: true,
    },
    productImages: {
      type: Array,
    },
    productDescription: {
      type: String,
    },
  },
  {
    strict: true,
  }
);
module.exports = mongoose.model("product", userSchema);
