import {Router} from "express"
import { getUserDetails, login, logout, registerUser } from "../controller/userController.js"
import {upload} from "../middleware/multerMiddleware.js"
import { verifyJwt } from "../middleware/authMiddleware.js";

const router = Router();


router.route("/register").post( upload.single("profile") ,registerUser)
router.route("/login").post(login)
router.route("/logout").get( verifyJwt ,logout)
router.route("/get-user-details").get( verifyJwt ,getUserDetails)

export default router
