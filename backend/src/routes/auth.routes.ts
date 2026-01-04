import { Router } from "express"
import authController from "src/controllers/auth.controllers"
import oauthController from "src/controllers/oauth.controllers"
import { validateSchema } from "src/middlewares/auth/user.middleware"
import { userSchema } from "src/schema/user.schema"
import authService from "src/services/auth/auth.service"

const router = Router()

// SignUp Route
router.post("/signup", validateSchema(userSchema), authController.signupUser)

// SignIn Route
router.post("/signin", authController.signinUser)

// Verify OTP Route
router.post("/verify-OTP", authController.verifyOTP)

// Forgot Password Route
router.post("/forgot-password",authController.forgotPassword)

// Reset Password Route
router.post("/reset-password", authController.resetPassword)


// Github  Route(where code will be assigned)
router.get('/github',oauthController.getGithubURL)

// Github callback url
router.get('/callback/github',oauthController.signinwithGithubUser)


// Facebook Route(where code will be assigned)
router.get('/facebook',oauthController.getFacebookURL)

// Facebook callback url
router.get('/callback/facebook',oauthController.signinwithFacebookUser)

// Google Route(where code will be assigned)
router.get('/google',oauthController.getGoogleURL)

// Facebook callback url
router.get('/callback/google',oauthController.signinwithGoogleUser)

export default router;