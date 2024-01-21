const express = require('express')
const router = express.Router();
const PDFDocument = require("pdfkit");
const { jsPDF } = require('jspdf');
const stripe = require("stripe")(
   `${process.env.STRIPE_API}`
  );
const Donate = require('../Models/DonateModel')
const sessionDonationSchema = require('../Models/SessionDonationModal')

const generateReceiptPDF = async (htmlReceipt) => {
  try {
    const pdf = new jsPDF();
    pdf.html(htmlReceipt);
    return pdf.output('arraybuffer');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};


const donateRoute = router.post('/donate',async(req,res)=>{
const name = req.body.name;
const email = req.body.email;
const number = req.body.number;
const donationAmount = req.body.donationAmount;
console.log(name,email,number,donationAmount);

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
  const htmlReceipt = generateHtml({name,email,number},donationAmount);
  const pdfBuffer = await generateReceiptPDF(htmlReceipt);

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

const generateHtml = (user,donationAmount)=>{
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
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
        font-size:1.2rem;
        margin: 20px;
        padding: 20px;
        max-width: 800px; 
        margin: 0 auto;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1{
        text-align:center;
        color:black;
        font-size:1.7rem;
      }
      h2, h3 {
        text-align: center;
        color: black;
        font-size:1.5rem;
      }
      .user-info {
        margin-top: 20px;
      }
      .branding {
        text-align: center;
        font-size:1.2rem;
        margin-top: 50px; /* Adjust the margin as needed */
        font-style: italic;
        color: #888; /* Choose a color that fits your design */
      }
    </style>
  </head>
  <body>
    <h1>Donation Receipt</h1>

    <div class="user-info">
      <h3>Donated by</h3>
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone no.:</strong> ${user.number}</p>
    </div>

    <div class="user-info">
      <h3>Donated to</h3>
      <p><strong>YumYard Pvt Ltd</strong></p>
      <p><strong>Email:</strong> Donation@yumyard.com</p>
      <p><strong>Phone no.:</strong> 7208291301</p>
      <p><strong>Address:</strong> Mumbai, India</p>
    </div>

    <h3>Donation Details</h3>
    <p><strong>Donation Amount:</strong> ${donationAmount} INR</p>
    <p><strong>Date:</strong> ${currentDate}</p>
    <p><strong>Time:</strong> ${currentTime}</p>

    <div class="branding">
      <p>Thank you for supporting YumYard's initiative!</p>
    </div>
  </body>
  </html>
`;

return receiptHTML;
}