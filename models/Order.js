const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: String,
  product: {
    title: String,
    variant: String,
    quantity: Number,
    price: Number,
  },
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zip: String,
  },
  transactionStatus: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
