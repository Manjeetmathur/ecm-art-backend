import mongoose from "mongoose";

const CartSchema = mongoose.Schema({
       post:{
              type: mongoose.Schema.Types.ObjectId,
              ref: "Post"
       },

       owner: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
       }
})

export const Cart = mongoose.model("Cart", CartSchema)