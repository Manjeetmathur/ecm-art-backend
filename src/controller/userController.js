import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../model/user.model.js";
import bcrypt from "bcrypt"
import { Post } from "../model/post.model.js";
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;
  try {

    if (
      [fullName, email, password, confirmPassword].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({email});

    if (existedUser) {
      throw new ApiError(409, "user is already exist ... ");
    }

    if(password !== confirmPassword){
      throw new ApiError(401,"password doesn't match . . .")
    }

    const hashPassword = await bcrypt.hash(password,10)

    const profileLocalPath = req.file?.path;
    
    const profile = await uploadOnCloudinary(profileLocalPath);
    
    const user = await User.create({
      fullname : fullName,
      profile: profile?.url || " ",
      email,
      password : hashPassword,
    });
    
    console.log(user);
    
    const createdUser = await User.findById(user._id).select(
      "-password"
    );

    if (!createdUser) {
      throw new ApiError(500, " Something went wrong while requesting the user");
    }
    
    return res.status(200).json({ 
      success : true,
      message : "User registered successfully",
      createdUser
    });
    console.log(createdUser);

  } catch (error) {
    res.json({
      message : error.message
    })
  }
});

const login  = asyncHandler(async(req,res) => {
    const {email,password} = req.body
    try {
      if(!email || !password){
        throw new ApiError(402, "Required email or password. . .")
      }

      const user = await User.findOne({email})

      if(!user){
        throw new ApiError(404,"User not Found . . .")
      }

      const isPasswordValid = await bcrypt.compare(password,user.password)

      if(!isPasswordValid){
        throw new ApiError(404, "Password is not valid . . .")
      }
      const token = jwt.sign({userId : user._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn : "1d"})

      const tokenOption = {
        httpOnly : true,
        secure : true,
        sameSite : 'strict',
        maxAge : 1 * 24 * 60 * 60 * 1000
      }

      const loggedInUser = {
        email : user.email,
        userId : user._id,
        fullName : user.fullname
      } 

      return  res.cookie('token',token,tokenOption).json({
        message : "User logged in successfully",
        success : true,
        loggedInUser
      })


    } catch (error) {
      res.json({
        message : error.message
      })
    }
})

const logout = asyncHandler (async(req,res) => {
  try {
    const user = req.user
    if(!user){
      throw new ApiError("User is not logged in . . . ")
    }
    res.clearCookie('token').json({
      success : true,
      message : "user logged out successfully . . . "
    })
  } catch (error) {
    res.status(402).json({
      message : error.message
    })
  }
})

const getUserDetails = asyncHandler(async(req,res) => {
  let user = req.user
  user = await User.findById(user._id).populate({path : 'order'})
  console.log(user);
  
  res.status(200).json({
    success : true,
    user
  })
} )

export { registerUser,login,logout ,getUserDetails};
