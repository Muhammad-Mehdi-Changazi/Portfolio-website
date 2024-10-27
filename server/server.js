import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemailer from 'nodemailer'; // Use ES module import
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONG_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Listening on port ${process.env.PORT}`);
            console.log("Connected to Database");
        });
    })
    .catch((error) => {
        console.log(error);
    });

// POST route for sending emails
app.post('/send', (req, res) => {
    const { name, email, message } = req.body;

    console.log("message received!!!")
    // Create a transporter using your email service
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Change to your email service
        auth: {
            user: 'mehdichangazi135@gmail.com', // Your email
            pass: 'orvi trsz qirr iosh' // Your email password or app password
        }
    });

    // Email options
           // Email options
const mailOptions = {
    from: email,
    to: 'mehdichangazi135@gmail.com', // Your email address
    subject: `New message from ${name}`,
    html: `
        <p>You have received a new message:</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p>Best regards,<br>Server</p>
    `
};

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error:', error);
            return res.status(500).send('Error sending email');
        }
        console.log('Email sent:', info.response);
        res.status(200).send('Email sent successfully');
    });
});