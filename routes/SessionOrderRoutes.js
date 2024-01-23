const sessionOrderSchema = require('../Models/SessionOrderModel')
const orderSchema = require('../Models/OrderModel')
const express = require('express')
const router = express.Router();

const findByIdAndSave = router.post('/findByIdAndSave',async(req,res)=>{
const id = req.body.transactionId;

try {
    const order = await sessionOrderSchema.findOne({transactionId:id});

    const newOrder = new orderSchema({
        name: order.name,
      email: order.email,
      number:order.number,
      userId: order.userId,
      orderItems: order.orderItems,
      shippingAddress: {
        streetAddress: order.shippingAddress.streetAddress,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        country:order.shippingAddress.country,
        pincode: order.shippingAddress.pincode,
      },
      orderAmount: order.orderAmount,
      transactionId: order.transactionId,
    })
   
    await newOrder.save();
    res.send('Order saved Successfully')
} catch (error) {
    res.status(400).json({message:error})
}
})

const downloadReceipt = router.post('/downloadreceipt',async(req,res)=>{
    const id = req.body.transactionId;
    
    try {
        const order = await sessionOrderSchema.findOne({transactionId:id});
        if(order.receiptPDF){
            const receipt = order.receiptPDF
         res.send({receipt})
        }
        
    } catch (error) {
        res.status(400).json({message:error})
    }
    })

module.exports = {findByIdAndSave,downloadReceipt}