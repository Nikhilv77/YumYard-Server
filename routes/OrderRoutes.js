const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Order = require("../Models/OrderModel");
const PDFDocument = require("pdfkit");
const sessionOrderSchema = require("../Models/SessionOrderModel");
const stripe = require("stripe")(
  `${process.env.STRIPE_API}`
);
let newOrder;

const generateReceiptPDF = (user, address, cartItems, totalAmount) => {
  return new Promise((resolve, reject) => {
    try {
      const buffers = [];
      const pdfDoc = new PDFDocument();

      pdfDoc.on("data", (chunk) => buffers.push(chunk));
      pdfDoc.on("end", () => resolve(Buffer.concat(buffers)));
      pdfDoc.on("error", (error) => reject(error));

      // Header
      pdfDoc.fontSize(24).text('Yumyard Pvt Ltd', { align: 'center' });
      pdfDoc.moveDown().fontSize(18).text('Order Receipt', { align: 'center' });

      // Current Date and Time
      const currentDate = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
      pdfDoc.moveDown().fontSize(12).text(`Date: ${currentDate}, Time: ${currentTime}`, { align: 'left' });

      // User Information
      pdfDoc.moveDown().fontSize(13);
      pdfDoc.text(`Customer Name: ${user.name}`);
      pdfDoc.text(`Email: ${user.email}`);
      pdfDoc.text(`Phone Number: ${user.number}`);

      // Address
      pdfDoc.moveDown().fontSize(13);
      pdfDoc.text('Shipping Address:');
      pdfDoc.text(address);

      // Cart Items
      pdfDoc.moveDown().fontSize(13);
      pdfDoc.text('Ordered Items:').moveDown();;
      cartItems.forEach((item, index) => {
        const lineText = `${index + 1}. ${item.name}(${item.quantity}) - Rs ${item.price * item.quantity}`;
        pdfDoc.text(lineText, { align: 'left' }).moveDown();
        pdfDoc.moveTo(50, pdfDoc.y).lineTo(550, pdfDoc.y).stroke().moveDown();
      });

      // Total Amount
      pdfDoc.moveDown().fontSize(14);
      pdfDoc.text(`Total Amount: Rs ${totalAmount}`, { align: 'right' });

      // Thank You Message
      pdfDoc.moveDown().fontSize(12).text('Thank you for choosing Yumyard!', { align: 'center' });
      //footer
      pdfDoc
      .fontSize(10)
      .text('For inquiries, please contact Yumyard Pvt Ltd:',{ align: 'center'})
      .text('Email: info@yumyard.com | Phone: +1 123-456-7890', { align: 'center' })
      .moveDown();
      // Finalize the PDF
      pdfDoc.end();
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};



const placeOrder = router.post("/placeorder", async (req, res) => {

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
      unit_amount: 20 * 100, 
    },
    quantity: 1, 
  });
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url:
        "https://yumyard.vercel.app/OrderSuccessful?session_id={CHECKOUT_SESSION_ID}",
      cancel_url:
        "https://yumyard.vercel.app/OrderFailed?session_id={CHECKOUT_SESSION_ID}&success=false",
    });

    if (session) {
      const address = `${userAddress.streetAddress}, ${userAddress.pincode}, ${userAddress.city}, ${userAddress.state}`;
      const pdfBuffer = await generateReceiptPDF(currUser,
        address,
        cartItems,
        totalAmountWithShipping);

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
