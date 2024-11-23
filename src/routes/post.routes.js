import {Router} from 'express'
import { upload } from '../middleware/multerMiddleware.js'
import { verifyJwt } from '../middleware/authMiddleware.js'
import { addOrRemoveToCart, cancelOrder, getPostById , createPost, deletePost, getAllPost, orderItem } from '../controller/post.controller.js'

const router = Router()

router.route("/create-post").post(verifyJwt ,upload.single('postImage'),createPost)
router.route("/delete-post").post(verifyJwt,deletePost)
router.route("/add-remove-cart").post(verifyJwt,addOrRemoveToCart)
router.route("/order-item").post(verifyJwt,orderItem)
router.route("/cancel-order").post(verifyJwt,cancelOrder)
router.route("/get-post").get(getAllPost)
router.route("/get-post-by-id/:postId").get(getPostById)

export default router