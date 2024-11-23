import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
       post:
       {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Post"
       },
       postPrice:{
              type : Number,
              required:true
       },

       owner: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
       }
})

export const Order = mongoose.model("Order", OrderSchema)