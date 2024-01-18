const express = require("express");
const htmlToPdf = require("html-pdf");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Order = require("../Models/OrderModel");
const sessionOrderSchema = require("../Models/SessionOrderModel");
const stripe = require("stripe")(
  `${process.env.STRIPE_API}`
);
let newOrder;
const htmlToPdfBuffer = async (html) => {
  return new Promise((resolve, reject) => {
    htmlToPdf.create(html).toBuffer((err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
};

const placeOrder = router.post("/placeorder", async (req, res) => {
  console.log("logged from placeorder");
  console.log(`${process.env.STRIPE_API}`)
  const { currUser, cartItems, totalPrice, userAddress } = req.body;

  const totalAmountWithShipping = totalPrice + 20;
  const lineItems = cartItems.map((cartItem) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: cartItem.name,
      },
      unit_amount: cartItem.price * 100,
    },
    quantity: cartItem.quantity,
  }));
  lineItems.push({
    price_data: {
      currency: "inr",
      product_data: {
        name: "Shipping Charge",
      },
      unit_amount: 20 * 100, // Amount in cents
    },
    quantity: 1, // Assuming a fixed shipping charge
  });
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url:
        "http://localhost:3000/OrderSuccessful?session_id={CHECKOUT_SESSION_ID}",
      cancel_url:
        "http://localhost:3000/OrderFailed?session_id={CHECKOUT_SESSION_ID}&success=false",
    });

    if (session) {
      const receiptHtml = generateReceipt(
        currUser,
        userAddress,
        cartItems,
        totalAmountWithShipping
      );

      const pdfBuffer = await htmlToPdfBuffer(receiptHtml);

      const pdfFileName = `receipt_${session.id}.pdf`;

      newOrder = new sessionOrderSchema({
        name: currUser.name,
        email: currUser.email,
        number: currUser.number,
        userId: currUser._id,
        orderItems: cartItems,
        shippingAddress: {
          streetAddress: userAddress.streetAddress,
          city: userAddress.city,
          state: userAddress.state,
          country: userAddress.country,
          pincode: userAddress.pincode,
        },
        orderAmount: totalAmountWithShipping,
        transactionId: session.id,
        receiptPDF: pdfBuffer,
      });
      await newOrder.save();
      res.json({ id: session.id });
    } else {
      res.send("Transaction Failed");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

const getAllOrders = router.post("/getUserOrders", async (req, res) => {
  const { currUserEmail } = req.body;
  try {
    const orders = await Order.find({ email: currUserEmail });
    res.send(orders);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});
const getAllUserOrders = router.get("/getallorders", async (req, res) => {
  try {
    const allOrders = await Order.find();
    res.send(allOrders);
  } catch (error) {
    res.send(error);
  }
});

const delivery = router.post("/deliver", async (req, res) => {
  const orderId = req.body.orderId;
  try {
    const currentOrder = await Order.findById(orderId);
    if (!currentOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    const updatedIsDelivered = !currentOrder.isDelivered;

    await Order.updateOne(
      { _id: orderId },
      { $set: { isDelivered: updatedIsDelivered } }
    );
    res.send("Ordered Delivered Successfully!");
  } catch (error) {
    res
      .status(400)
      .json({ message: "Could not deliver, something went wrong!" });
  }
});

const cancelOrder = router.post("/cancelorder", async (req, res) => {
  const orderId = req.body.orderId;
  try {
    const order = await Order.findOne({ _id: orderId });
    order.isCancelled = true;
    await order.save();
    res.send("Order cancelled SuccessFully!");
  } catch (error) {
    res.status(400).json({ message: "could not cancel!" });
  }
});
module.exports = {
  placeOrder,
  getAllOrders,
  getAllUserOrders,
  delivery,
  cancelOrder,
};
const generateReceipt = (user, userAddress, cartItems, totalAmount) => {
  const address = `${userAddress.streetAddress}, ${userAddress.pincode}, ${userAddress.city}, ${userAddress.state}`;
  const currentDate = new Date().toLocaleString();
  const formattedItems = cartItems
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.price} INR</td>
      <td>${item.quantity * item.price} INR</td>
    </tr>
  `
    )
    .join("");

  const receiptHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Times Roman';
          margin: 20px;
          padding: 20px;
          max-width: 800px; 
          margin: 0 auto;
          font-size: 1.2rem;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2{
          font-size: 1.6rem;
          text-align: center;
          color: #333;
        }
        h3 {
          font-size: 1.4rem;
          text-align: center;
          color: #333;
        }
        table {
          width: 100%;
          margin-top: 20px;
          border-collapse: collapse;
          font-size: 1.2rem;
        }
        th, td {
          padding: 15px;
          border-bottom: 1px solid #ddd;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        tfoot {
          font-weight: bold;
        }
        .user-info {
          margin-top: 20px;
        }
        .branding {
          text-align: center;
          margin-top: 50px; /* Adjust the margin as needed */
          font-style: italic;
          font-size: 1.2rem;
          color: #888; /* Choose a color that fits your design */
        }
      </style>
    </head>
    <body>
      <h2>Order Receipt</h2>

      <div class="user-info">
       
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone no.:</strong> ${user.number}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Ordered At:</strong> ${currentDate}</p>
      </div>
      <h3>Items</h3>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price per Unit</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${formattedItems}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3">Total Amount</td>
            <td>${totalAmount} INR</td>
          </tr>
        </tfoot>
      </table>
      
    <div class="branding">
    <p>Thank you for choosing YumYard!</p>
  </div>
    </body>
    </html>
  `;

  return receiptHTML;
};
