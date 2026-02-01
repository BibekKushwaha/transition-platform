import express from 'express';
import {  loginUser, registerUser } from '../controllers/auth.controller.js';
import uploadFile from '../middleware/multer.js';

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
// router.post("/forgot",forgotPassword);
// router.post("/reset/:token",resetPassword);

export default router;