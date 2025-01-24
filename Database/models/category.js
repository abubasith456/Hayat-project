
const { Schema, model } = require("mongoose");

const categorySchema = Schema({
  id: Schema.Types.ObjectId,
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  link: { type: String },
});

module.exports = model("Category", categorySchema);