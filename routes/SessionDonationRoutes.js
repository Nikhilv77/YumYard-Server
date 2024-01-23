const sessionDonationSchema = require('../Models/SessionDonationModal')
const donationSchema = require('../Models/DonateModel')
const express = require('express')
const router = express.Router();

const findByIdAndSaveDonation = router.post('/findByIdAndSaveDonation',async(req,res)=>{
const id = req.body.transactionId;


try {
    const donation = await sessionDonationSchema.findOne({transactionId:id});

    const newDonation = new donationSchema({
        name: donation.name,
      email: donation.email,
      number:donation.number,
      donationAmount: donation.donationAmount,
      transactionId: donation.transactionId,
    })
    await newDonation.save();
    res.send('Donation saved Successfully')
} catch (error) {
    res.status(400).json({message:error})
}
})

const downloadDonationReceipt = router.post('/downloaddonationreceipt',async(req,res)=>{
    const id = req.body.transactionId;
    try {
        const donation = await sessionDonationSchema.findOne({transactionId:id});
        if(donation.donationReceipt){
            const receipt = donation.donationReceipt
         res.send({receipt})
        }
        
    } catch (error) {
        res.status(400).json({message:error})
    }
    })

module.exports = {findByIdAndSaveDonation,downloadDonationReceipt}