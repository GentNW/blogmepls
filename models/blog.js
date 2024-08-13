const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const blogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        },
        title: {
            type:String,
            required: true
        },
        textContent: {
            type:String,
            default:"Lorem ipsum dolor sit amet, consectetur adipiscing elit."  
        }
    },
    {
        timestamps:true
    }
)

blogSchema.plugin(AutoIncrement, {
    inc_field: 'blog',
    id: 'blogNums',
    start_seq: 1
})

module.exports= mongoose.model('blogs', blogSchema)