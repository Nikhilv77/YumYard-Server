const mongoose = require('mongoose')
const donationSchema = mongoose.Schema({
name:{type:String,required:true},
email:{type:String,require:true},
number:{type:Number,required:true},
donationAmount:{type:Number,required:true},
transactionId:{type:String,required:true},
},{timestamps:true});
const Donation = mongoose.model('donation',donationSchema);
module.exports = Donation