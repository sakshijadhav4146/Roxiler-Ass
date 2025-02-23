const mongoose = require('mongoose')

const transitionSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type: String

    },
    category:{
        type:String
    },
    sold:{
        type:Boolean
    },
    dateOfSale:{
        type:Date

    }

})

const product = new mongoose.model('product',transitionSchema)

module.exports = product;

