const mongoose = require('mongoose')
const Schema = mongoose.Schema

const wishlistSchema = new Schema({
  
    owner:String,
    pid:String,
    productTitle:String,
    description:String,
    qty:Number,
    stock:String,
    price:String,
    image:String 
    
   
})





module.exports = mongoose.model('wishlist',wishlistSchema)