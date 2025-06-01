const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = async function sendEmail(to, status, order) {
  const nodemailer = require('nodemailer');

  let subject = '', html = '';
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const sender = {
    address: "ayuss524425@gmail.com",
    name: "Ayush Kumar",
  };

  if (status === 'approved') {
    subject = `Order Confirmed: #${order.orderNumber}`;
    html = `
      <h2>Thank you for your order!</h2>
      <p>Order Number: <strong>${order.orderNumber}</strong></p>
      <p>Product: ${order.product.title} (${order.product.variant})</p>
      <p>Quantity: ${order.product.quantity}</p>
      <p>Total: $${order.product.price * order.product.quantity}</p>
    `;
  } else {
    subject = `Order Failed: #${order.orderNumber}`;
    html = `
      <h2>We're sorry, your transaction failed.</h2>
      <p>Please try again or contact support.</p>
    `;
  }

  console.log("Sending email to:", to);

  try {
    const info = await transport.sendMail({
      from: sender,
      to: to,
      subject,
      html: html,
      // category and sandbox are not standard Nodemailer options, you can remove them unless your SMTP provider supports them
    });
    console.log(info);
  } catch (error) {
    console.error(error);
  }
};
