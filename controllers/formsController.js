const nodemailer = require('nodemailer');
const Register = require('../models/Register');

/** ======================================================================
 * ?                    Environment Variables
====================================================================== */
const SENDER_MAIL = process.env.SENDER_MAIL;
const SENDER_MAIL_PASSWORD = process.env.SENDER_MAIL_PASSWORD;

/** ======================================================================
 * ?                          Routes
====================================================================== */

const createEmailBody = (data) => {
    return `
Dear Trinity Team,

A new message has been received:

Sender Name: ${data.name}
Email: ${data.email}
Note: ${data.message}

Thank you.

Best Regards,
Trinity
`;
};

const contactUs = async (req, res) => {
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: SENDER_MAIL,
                pass: SENDER_MAIL_PASSWORD
            }
        });

        var mailOptions = {
            from: SENDER_MAIL,
            to: SENDER_MAIL,
            subject: `Trinity contact message received`,
            text: createEmailBody(req.body),
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Email error:', error);
                return res.status(500).json({ message: "A network error has occurred, please try again later." });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(201).json({ message: `We have received your mail. We'll get back to you soon!` });
            }
        });
    } catch (error) {
        console.error('Server side error:', error);
        res.status(500).json({ message: 'Server side error' });
    }
}

const register = async (req, res) => {
    try {
        const { fullName, email, phoneNo, rollNo, whyToAttend, department } = req.body;

        const existingName = await Register.findOne({ fullName });
        const existingMail = await Register.findOne({ email });
        const existingPhone = await Register.findOne({ phoneNo });
        const existingRollNo = await Register.findOne({ rollNo });

        if (existingName) {
            return res.status(400).json({ message: 'An user with the specified user name is already registered. Please choose a different user name.' });
        }
        if (existingMail) {
            return res.status(400).json({ message: 'An account with the provided email is already registered.' });
        }
        if (existingPhone) {
            return res.status(400).json({ message: 'An account with the provided Phone Number is already registered.' });
        }
        if (existingRollNo) {
            return res.status(400).json({ message: 'An account with the provided Roll No is already registered.' });
        }

        const newEntry = new Register({
            fullName, email, phoneNo, rollNo, whyToAttend, department
        });

        const savedEntry = await newEntry.save();

        res.status(201).json({ message: 'User registered successfully.' });


    } catch (error) {
        console.error('Server side error:', error);
        res.status(500).json({ message: 'Server side error' });
    }
}

module.exports = {
    contactUs,
    register
}