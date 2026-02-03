import express from 'express';
import'dotenv/config';
import routes from './routes.js';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
// import { startSendMailConsumer } from './consumer.js';


//  startSendMailConsumer();

const {
  CLOUD_NAME,
  API_KEY,
  API_SECRET,
} = process.env;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  throw new Error("Missing Cloudinary environment variables");
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const app = express();

app.use(cors());

app.use(express.json({limit: "50mb" }));
app.use(express.urlencoded({limit: "50mb" , extended: true}));

app.use("/api/utils",routes);

app.get("/", (req, res) => {
  console.log("the utils service is running");
  res.status(200).send("Utils service is running ✅");
});


const PORT = Number(process.env.PORT) || 5051;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on http://localhost:${PORT}`);
    });