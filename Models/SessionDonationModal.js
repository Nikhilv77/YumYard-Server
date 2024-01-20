const mongoose = require('mongoose')
const sessionDonationSchema = mongoose.Schema({
name:{type:String,required:true},
email:{type:String,require:true},
number:{type:Number,required:true},
donationAmount:{type:Number,required:true},
transactionId:{type:String,required:true},
donationReceipt:{type:Buffer,required:true}
},{timestamps:true});
const sessionDonation = mongoose.model('session-donations',sessionDonationSchema);
module.exports = sessionDonation