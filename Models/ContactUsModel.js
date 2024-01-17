const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    number:{type:Number,required:true},
    category:{type:String,required:true},
    message:{type:String,required:true},
    isCustomer:{type:Boolean,required:true}
},{timestamps:true})

const ContactUs = mongoose.model('contact-us',contactSchema)
module.exports = ContactUs;