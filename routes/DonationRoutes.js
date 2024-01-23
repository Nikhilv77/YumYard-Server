const express = require('express')
const router = express.Router();
const PDFDocument = require("pdfkit");
const stripe = require("stripe")(
   `${process.env.STRIPE_API}`
  );
const Donate = require('../Models/DonateModel')
const sessionDonationSchema = require('../Models/SessionDonationModal')

const generateReceiptPDF = (name, email, number, donationAmount) => {
  return new Promise((resolve, reject) => {
    try {
      const buffers = [];
      const currentDate = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
      const pdfDoc = new PDFDocument();

      pdfDoc.on("data", (chunk) => buffers.push(chunk));
      pdfDoc.on("end", () => resolve(Buffer.concat(buffers)));
      pdfDoc.on("error", (error) => reject(error));

      // donation receipt header
      pdfDoc
        .fontSize(18)
        .text('Donation Receipt', { align: 'center' })
        .fontSize(12)
        .text('Thank you for your generous contribution!', { align: 'center' })
        .moveDown();

      // recipient information
      pdfDoc
        .fontSize(12)
        .text('Donated To', { align: 'center' })
        .text('Yumyard Pvt Ltd', { align: 'center' })
        .moveDown();

      //  donation information
      pdfDoc
        .fontSize(12)
        .text(`Date - ${currentDate}`)
        .text(`Time - ${currentTime}`)
        .moveDown();

      //  donor details
      pdfDoc
        .fontSize(12)
        .text(`Donor Name - ${name}`)
        .text(`Donor Email - ${email}`)
        .text(`Donor Phone - ${number}`)
        .text(`Donation Amount - Rs ${donationAmount}`)
        .moveDown();

      //  line for separation
      pdfDoc.moveTo(50, pdfDoc.y).lineTo(550, pdfDoc.y).stroke().moveDown();

      // thank you message
      pdfDoc
        .fontSize(12)
        .text('Your contribution is greatly appreciated!', { align: 'center' })
        .moveDown();

      // footer
      pdfDoc
        .fontSize(10)
        .text('For inquiries, please contact Yumyard Pvt Ltd:',{ align: 'center'})
        .text('Email: info@yumyard.com | Phone: +1 123-456-7890', { align: 'center' })
        .moveDown();

      // pdf
      pdfDoc.end();
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const donateRoute = router.post('/donate',async(req,res)=>{
const name = req.body.name;
const email = req.body.email;
const number = req.body.number;
const donationAmount = req.body.donationAmount;

const lineItems  =[{price_data:{
    currency:'inr',
    product_data:{
        name:"Donation"
    },
    unit_amount : donationAmount * 100
},
quantity:1,
}]
const session = await stripe.checkout.sessions.create({
    payment_method_types:['card'],
    line_items:lineItems,
    mode:'payment',
    success_url: "https://yumyard.vercel.app/DonationSuccessful?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "https://yumyard.vercel.app/DonationFailed?session_id={CHECKOUT_SESSION_ID}&success=false",

})
if(session){
 
  const pdfBuffer = await generateReceiptPDF(name,email,number,donationAmount);

    const newDonation = new sessionDonationSchema({
        name:name,
        email:email,
        number:number,
        donationAmount:donationAmount,
        transactionId: session.id,
        donationReceipt:pdfBuffer,
    })
    await newDonation.save();
    res.send({id : session.id})
}else{
    res.send('Donation Failed!')
}
})

const getAllDonations = router.get('/getalldonations', async (req,res)=>{
    try{
      const allDonations = await Donate.find();
      res.send(allDonations)
    }catch(error){
      res.send(error)
    }
  })
module.exports = {donateRoute,getAllDonations}

