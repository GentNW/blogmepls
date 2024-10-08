const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId,
    },
    username: {
        type:String,
        required: true,
    },
    password: {
        type:String,
        required: true,
    },
    blognumbers: {
        type: Number,
        default:0,
    },  
    roles:{
        type:[String],
        default: ["Blogger"],
        required:true,
    }
})

module.exports= mongoose.model('Users', userSchema)