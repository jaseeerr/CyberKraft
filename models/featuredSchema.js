const mongoose = require('mongoose')
const Schema = mongoose.Schema

const featuredSchema = new Schema({
  
    title:String,
    image:String
   
})





module.exports = mongoose.model('featured',featuredSchema)
