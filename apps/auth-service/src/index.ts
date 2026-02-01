import express from 'express';
import 'dotenv/config';
import  userRouter  from './routes/auth.route.js';
import cors from 'cors';
import cookieParser from "cookie-parser";


const app = express();
app.use(cors({
  credentials: true,
  origin: "http://localhost:3000",
}));
app.use(express.json({limit: "50mb" }));
app.use(express.urlencoded({limit: "50mb" , extended: true}));
app.use(cookieParser());
app.use('/api/auth', userRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Auth Service!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Auth service is running on port ${PORT}`);
});