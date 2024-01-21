const express = require('express')
const router = express.Router();
const easyinvoice = require('easyinvoice');
const stripe = require("stripe")(
   `${process.env.STRIPE_API}`
  );
const Donate = require('../Models/DonateModel')
const sessionDonationSchema = require('../Models/SessionDonationModal')



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
  const dataNpm = {
    // If not using the free version, set your API key
    // "apiKey": "123abc", // Get apiKey through: https://app.budgetinvoice.com/register
    
    // Customize enables you to provide your own templates
    // Please review the documentation for instructions and examples
    "customize": {
        //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html 
    },
    "images": {
        // The logo on top of your invoice
        "logo": "https://cdn.pixabay.com/photo/2014/03/24/17/16/dishes-295282_1280.png",
        // The invoice background
        "background": "https://public.budgetinvoice.com/img/watermark-draft.jpg"
    },
    // Your own data
    "sender": {
        "company": "YumYard Pvt Ltd",
        "address": "Sector 10, Panvel",
        "zip": "410209",
        "city": "Navi Mumbai",
        "country": "India"
        //"custom1": "custom value 1",
        //"custom2": "custom value 2",
        //"custom3": "custom value 3"
    },
    // Your recipient
    "client": {
        "company": name,
        "address": email,
        "zip": number,
        // "custom1": "custom value 1",
        // "custom2": "custom value 2",
        // "custom3": "custom value 3"
    },
    "information": {
        // Invoice number
        "number": "2021.0001",
        // Invoice data
        "date": "12-12-2021",
        // Invoice due date
        "due-date": "31-12-2021"
    },

    "products": [
        {
            "quantity": 2,
            "description": "Product 1",
            "tax-rate": 6,
            "price": 33.87
        },
        {
            "quantity": 4.1,
            "description": "Product 2",
            "tax-rate": 6,
            "price": 12.34
        },
        {
            "quantity": 4.5678,
            "description": "Product 3",
            "tax-rate": 21,
            "price": 6324.453456
        }
    ],
    // The message you would like to display on the bottom of your invoice
    "bottom-notice": "Thank You for your Donation.",
    // Settings to customize your invoice
    "settings": {
        "currency": "INR", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
       
    },

    "translate": {
       
    },
};

  const data = {
    documentTitle: 'Donation Receipt',
    currency: 'INR',
    taxNotation: 'GST',
    marginTop: 25,
    marginBottom: 25,
    sender: {
      company: 'YumYard Pvt Ltd',
      email: 'donation@yumyard.com',
      phone: '7208291301',
      address: 'Mumbai, India',
    },
    client: {
      company: name,
      email,
      phone: number,
    },
    items: [
      { description: 'Donation Amount', quantity: 1, tax: 0, price: donationAmount },
    ],
  };

  // Generate the invoice PDF
  console.log("before invoice");
  const invoiceResult = await easyinvoice.createInvoice(data);
  console.log("after invoice");
  const pdfBuffer = Buffer.from(invoiceResult.pdf, 'base64');
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
