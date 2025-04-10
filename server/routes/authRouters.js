import express from "express";
import {registerUser,loginUser,googleLogin,getAllUsers} from "../controllers/authControllers.js"

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);
router.post('/logout', (req, res) => {
  console.log("Logout API HIT");
  res.clearCookie("user", { path: "/", httpOnly: false, secure: false, sameSite: "strict" });
  console.log("Cookie cleared");
  res.status(200).json({ message: "Logged out successfully" });
});
router.get('/user',getAllUsers)

export default router;
