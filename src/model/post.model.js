
import mongoose from "mongoose";
const PostSchema = mongoose.Schema({
       postImage : {
              type : String,
              required : true,
       },
       postTitle : {
              type : String,
       },
       postPrice : {
              type : Number,
       },
       postContent : {
              type : String,
              required : true,
       },
       owner : {
              type : mongoose.Schema.Types.ObjectId,
              ref : " User"
       },

})

export const Post = mongoose.model("Post",PostSchema)