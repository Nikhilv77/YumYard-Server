const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    number:{type:Number,require:true},
    userId:{type:String,required:true},
    orderItems:[],
    shippingAddress:{type:Object,required:true},
    orderAmount:{type:Number,required:true},
    isDelivered:{type:Boolean,required:true, default:false},
    isCancelled:{type:Boolean,required:true,default:false},
    transactionId:{type:String,required:true},
},{timestamps:true})

module.exports = mongoose.model('orders',orderSchema)