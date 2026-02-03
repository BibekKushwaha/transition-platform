// import { Kafka } from "kafkajs";
// import nodemailer from "nodemailer";
// import  "dotenv/config";


// export const startSendMailConsumer = async () => {
//   try {
//     const kafka = new Kafka({
//       clientId: "mail-service",
//       brokers: [process.env.Kafka_Broker || "localhost:9092"],
//     });

//     const admin = kafka.admin();
//     const consumer = kafka.consumer({ groupId: "mail-service-group" });

//     const topicName = "send-mail";

//     // Create topic if it doesn't exist
//     await admin.connect();
//     const existingTopics = await admin.listTopics();
    
//     if (!existingTopics.includes(topicName)) {
//       await admin.createTopics({
//         topics: [{ topic: topicName, numPartitions: 1, replicationFactor: 1 }],
//       });
//       console.log(`✅ Topic "${topicName}" created successfully`);
//     }
//     await admin.disconnect();

//     await consumer.connect();

//     await consumer.subscribe({ topic: topicName, fromBeginning: false });

//     console.log("✅ Mail service consumer started, listening for sending mail");

//     await consumer.run({
//       eachMessage: async ({ topic, partition, message }) => {
//         try {
//           const { to, subject, html } = JSON.parse(
//             message.value?.toString() || "{}"
//           );

//           const transporter = nodemailer.createTransport({
//             host: "smtp.gmail.com",
//             port: 465,
//             secure: true,
//             auth: {
//               user: process.env.SMTP_USER,
//               pass: process.env.SMTP_PASS,
//             },
//           });

//           await transporter.sendMail({
//             from: "Job Portal <no-reply>",
//             to,
//             subject,
//             html,
//           });

//           console.log(`Mail has been sent to ${to}`);
//         } catch (error) {
//           console.log("Failed to send mail", error);
//         }
//       },
//     });
//   } catch (error) {
//     console.log("failed to start kafka consumer", error);
//   }
// };
