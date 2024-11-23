import { Cart } from "../model/Cart.model.js";
import { Order } from "../model/Oreder.model.js";
import { Post } from "../model/post.model.js";
import { User } from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import sendMail from "../utils/Sendmail.js";

const createPost = asyncHandler(async (req, res) => {
       const { postContent,postPrice,postTitle } = req.body

       try {
              const user = req.user
              if (!user) {
                     throw new ApiError(404, "user not found")
              }

              const postImagePath = req?.file?.path

              if (!postImagePath) {
                     throw new ApiError(401, "Image required . . .")
              }

              const postImage = await uploadOnCloudinary(postImagePath)

              const post = await Post.create({
                     postContent,
                     postPrice,
                     postTitle,
                     postImage: postImage.secure_url
              })
              await user.posts.push(post._id)
              await user.save()
              res.status(200).json({
                     success: true,
                     message: "post uploaded",
                     post
              })

       } catch (error) {
              res.json({
                     message: error.message
              })
       }
})

const deletePost = asyncHandler(async (req, res) => {
       const { postId } = req.body
       const user = req.user
       try {

              if (!user) {
                     throw new ApiError(404, "user not found")
              }
              if (!postId) {
                     throw new ApiError(404, "post not found")
              }

              const post = await Post.findByIdAndDelete(postId)
              if(!post){
                     throw new ApiError("Post not found . . .")
              }
              user.posts = user.posts.filter(id => id.toString() !== postId.toString())
              await user.save()
              res.status(200).json({
                     message: "post deleted ",
                     success: true,
              })
       } catch (error) {
              res.json({
                     message: error.message
              })
       }
})

const addOrRemoveToCart = asyncHandler(async (req, res) => {
       const { postId } = req.body
       const user = req.user

       try {
              if (!user) {
                     throw new ApiError(404, "user not found")
              }
              if (!postId) {
                     throw new ApiError(404, "user not found")
              }

              const cartPost = await Cart.findOne({ post: postId })

              if (!cartPost) {
                     const cartpost = await Cart.create({
                            post: postId,
                            owner: user._id
                     })
                     user.cart.push(cartpost._id)
                     await user.save()
                     res.status(200).json({
                            message: "added to cart",
                            success: true,
                            cartpost
                     })

              } else {
                     
                     await Cart.findByIdAndDelete( cartPost._id)

                     user.cart = user.cart.filter(id => id.toString() !== cartPost._id.toString())
                     await user.save()

                     res.status(200).json({
                            message: "remove from cart",
                            success: true
                     })
              }

       } catch (error) {
              res.json({
                     message: error.message
              })
       }


})

const orderItem = asyncHandler(async (req, res) => {
       const { postId,postPrice } = req.body
       const user = req.user

       try {
              if (!user) {
                     throw new ApiError(404, "user not found")
              }
              if (!postId) {
                     throw new ApiError(404, "post not found")
              }

              const p = await Post.findById(postId)

              if(!p){
                     throw new ApiError("Post not found")
              }

              const orderpost = await Order.create({
                     post: postId,
                     postPrice,
                     owner: user._id
              })
              user.order.push(orderpost._id)
              await user.save()
              
              let para = `thanks for your order for ${p.postContent} 
                                    rupees ${postPrice} `
              sendMail(para, user.email)
              sendMail(user.email, "kumanjeet779@gmail.com")
              
              res.status(200).json({
                     message: "Order Placed",
                     success: true,
                     orderpost
              })
       } catch (error) {
              res.json({
                     message: error.message
              })
       }


})

const cancelOrder = asyncHandler(async(req,res) => {
       const {orderId} = req.body
       const user = req.user
       try {
              if(!orderId){
                     throw new ApiError(401,"Order not found");
              }
              const order = await Order.findByIdAndDelete(orderId)

              if(!order){
                     throw new ApiError("Order not found")
              }

              user.order = user.order.filter(id => id.toString() !== orderId.toString())

              await user.save()

              res.status(200).json({
                     message: "order cancel",
                     success : true
              })
              
       } catch (error) {
              res.json({
                     message : error.message
              })
       }
})

const getAllPost = asyncHandler(async(req,res) => {
       try {
              const allPost = await Post.find().sort({createdAt : -1})
              res.status(200).json({
                     allPost
              })

       } catch (error) {
              
       }
})

const getPostById = asyncHandler(async(req,res) => {
       try {
              const {postId} = req.params
              console.log(postId);
              
              const post = await Post.findById(postId)

              res.status(200).json({
                     message:"fetched",
                     success:true,
                     post
              })

       } catch (error) {
              
       }
})

export {
       createPost,
       deletePost,
       addOrRemoveToCart,
       cancelOrder,
       orderItem,
       getAllPost,
       getPostById
}