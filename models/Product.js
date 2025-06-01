const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  variants: [String],
  inventory: Number,
});

module.exports = mongoose.model('Product', ProductSchema);
