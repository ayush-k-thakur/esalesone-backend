const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const sendEmail = require('../services/mailer');
const { v4: uuidv4 } = require('uuid');

router.post('/', async (req, res) => {
  const {
    product,
    customer,
    payment
  } = req.body;

  const orderNumber = uuidv4().slice(0, 8);
  let transactionStatus;

  switch (payment.cardNumber) {
    case '1': transactionStatus = 'approved'; break;
    case '2': transactionStatus = 'declined'; break;
    case '3': transactionStatus = 'error'; break;
    default: transactionStatus = 'error';
  }

  const order = new Order({
    orderNumber,
    product,
    customer,
    transactionStatus
  });

  try {
    await order.save();

    await sendEmail(customer.email, transactionStatus, order);

    if (transactionStatus === 'approved') {
      await Product.updateOne(
        { title: product.title },
        { $inc: { inventory: -product.quantity } }
      );
      res.status(200).json({ orderStatus: true, orderId: order._id });
      return
    }
    res.status(200).json({ orderStatus: false, orderId: order._id });
    return;
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.status(200).json(order);
  } catch {
    res.status(404).json({ message: 'Order not found' });
  }
});

module.exports = router;
