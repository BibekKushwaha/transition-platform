import axios from "axios";
import getBuffer from "../utils/buffer.js";
import { prisma } from "@repo/db/client";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/tryCatch.js";
import bcrypt from 'bcrypt';
import { registerSchema, loginSchema } from "@repo/schemas";

import jwt from 'jsonwebtoken';
// import { forgotPasswordTemplate } from "../templete.js";
// import { publishToTopic } from "../producer.js";
// import { redisClient } from "../index.js";


export const  registerUser = TryCatch(async(req,res,next)=>{
      const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.flatten(),
      });
    }
      const { name, email, password } = result.data;

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });


    if (existingUser) {
        throw new ErrorHandler(409, "User with this email already exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);


        // const file = req.file;

        // if (!file) {
        // throw new ErrorHandler(400, "Resume file is required for jobseekers");
        // }

        // const fileBuffer = getBuffer(file);

        // if (!fileBuffer || !fileBuffer.content) {
        // throw new ErrorHandler(500, "Failed to generate buffer");
        // }

        // if (!process.env.UPLOAD_SERVICE) {
        //     throw new ErrorHandler(500, "Upload service not configured");
        // }

        // const { data } = await axios.post(
        // `${process.env.UPLOAD_SERVICE}/api/utils/upload`,
        // { buffer: fileBuffer.content }
        // );
        
        const response = await prisma.user.create({
          data: {
              name,
              email,
              password: hashPassword
            
          },
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        })
        if (!process.env.JWT_SEC) {
          throw new ErrorHandler(500, "JWT secret not configured");
        }
    const token = jwt.sign(
        { id: response?.id },
        process.env.JWT_SEC as string,
        {
        expiresIn: "15d",
        }
    );

    res.cookie("token", token);

return res.status(201).json({
  success: true,
  message: "User registered successfully",
  user: response,
});

});

export const loginUser = TryCatch(async (req, res, next) => {
      const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.flatten(),
      });
    }
      const { email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  if (!user) {
    throw new ErrorHandler(400, "Invalid credentials");
  }


  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new ErrorHandler(400, "Invalid credentials");
  }
  
  const token = jwt.sign(
    { id: user?.id },
    process.env.JWT_SEC as string,
    {
      expiresIn: "15d",
    }
  );
  res.cookie("token", token);
  res.json({
    message: "user Loggedin",
    user: user, 
  });
});

// export const forgotPassword = TryCatch(async (req, res, next) => {
//   const { email } = req.body;

//   if (!email) {
//     throw new ErrorHandler(400, "email is required");
//   }

//   const users =
//     await sql`SELECT user_id, email FROM users WHERE email = ${email}`;

//   if (users.length === 0) {
//     return res.json({
//       message: "If that email exists, we have sent a reset link",
//     });
//   }
//   const user = users[0]!;

//   const resetToken = jwt.sign(
//     {
//       email: user.email,
//       type: "reset",
//     },
//     process.env.JWT_SEC as string,
//     { expiresIn: "15m" }
//   );

//   const resetLink = `${process.env.Frontend_Url}/reset/${resetToken}`;

//   await redisClient.set(`forgot:${email}`, resetToken, {
//     EX: 900,
//   });

//   const message = {
//     to: email,
//     subject: "RESET Your Password - Job Portal",
//     html: forgotPasswordTemplate(resetLink),
//   };

//   publishToTopic("send-mail", message).catch((error) => {
//     console.error("failed to send message", error);
//   });

//   res.json({
//     message: "If that email exists, we have sent a reset link",
//   });
// });

// export const resetPassword = TryCatch(async (req, res, next) => {
//   const { token } = req.params;
//   const { password } = req.body;

//   let decoded: any;
//   if(!token){
//     throw new ErrorHandler(400, "Token has Expired");
//   }

//   try {
//     decoded = jwt.verify(token, process.env.JWT_SEC as string);
//   } catch (error) {
//     throw new ErrorHandler(400, "Expired token");
//   }

//   if (decoded.type !== "reset") {
//     throw new ErrorHandler(400, "Invalid token type");
//   }

//   const email = decoded.email;

//   const stroredToken = await redisClient.get(`forgot:${email}`);

//   if (!stroredToken || stroredToken !== token) {
//     throw new ErrorHandler(400, "token has been expired");
//   }

//   const users = await sql`SELECT user_id FROM users WHERE email = ${email}`;

//   if (users.length === 0) {
//     throw new ErrorHandler(404, "User not found");
//   }

//   const user = users[0]!;

//   const hashPassword = await bcrypt.hash(password, 10);

//   await sql`UPDATE users SET password = ${hashPassword} WHERE user_id = ${user.user_id}`;

//   await redisClient.del(`forgot:${email}`);

//   res.json({ message: "Password changed successfully" });
// });
