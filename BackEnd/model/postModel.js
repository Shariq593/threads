import mongoose, { Mongoose } from "mongoose";

const postSchema = mongoose.Schema({ 
    postedBy:{
        type: Mongoose.Schema.Types.ObjectId ,//Special Identifier
        ref: 'User' ,
        required: true
    },
    text:{
        type: String,
        maxLength:500
    },
    img:{
        type: String,

    },
    likes:{
        type: Number,
        default: 0
    },
    replies: [
        {
            userId:{
                type:Mongoose.Schema.Types.ObjectId,
                ref:'User',
                required: true
            },
            text:{
                type:String,
                required: true
            },
            userProgilePic:{
                type:String
            },
            username:{
                type: String
            }

        }
    ]


},{
    timeStamps:true
})

const Post = mongoose.model("Post",postSchema);
export default Post