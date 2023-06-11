const mongoose = require('mongoose')
const Schema = mongoose.Schema

const offerSchema = new Schema({
    pid:String,
    productTitle:String,
    description:String,
    price:String,
    stock:String,
    image:[], 
    category:String,
    offprice:String
   
})





module.exports = mongoose.model('offer',offerSchema)
