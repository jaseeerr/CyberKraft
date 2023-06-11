const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({

    owner:String,
    date:Date,
    products:{},
    address:String,
    payment:String,
    paymentStatus:String,
    amount:String,
    orderStatus:String,
    coupon:String

   
})





module.exports = mongoose.model('order',orderSchema)