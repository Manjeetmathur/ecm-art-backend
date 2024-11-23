import mongoose, { Schema } from "mongoose";

const userSchema  = new Schema(
       {
              phone : {
                     type : String,
              },
              fullname : {
                     type : String,
                     required : true,
                     trim : true
              },
              email : {
                     type : String,
                     required : true,
                     unique : true,
              },
              password : {
                     type : String,
                     required : [true, "Password is required..."]
              },
              profile : {
                     type : String,
              },
              posts:[
                     {
                            type : mongoose.Schema.Types.ObjectId,
                            ref : "Post"
                     }
              ],
              cart:[
                     {
                            type : mongoose.Schema.Types.ObjectId,
                            ref : "Cart"
                     }
              ],
              order:[
                     {
                            type : mongoose.Schema.Types.ObjectId,
                            ref : "Order"
                     }
              ],
       },
       {
              timestamps : true,
       }
);

export const User = mongoose.model("User",userSchema)