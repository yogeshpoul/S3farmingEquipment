const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors=require("cors");
const { S3Client, PutObjectCommand,GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.DATABASE_STRING);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// AWS S3 client setup
const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// User model
const User = mongoose.model('User', {
    username: String,
    email: String,
    password: String,
});

// Equipment model
const Equipment = mongoose.model('Equipment', {
    userId: mongoose.Schema.Types.ObjectId,
    equipmentName: String,
    pricing: Number,
    photoKey: String, // Array of S3 photo URLs
});

// Signup endpoint
app.post('/signup', async (req, res) => {
    // const { username, email, password } = req.body;
    const username=req.body.username;
    const email=req.body.email;
    const password=req.body.password;
    console.log(req.username);
    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ username, email, password });
        console.log(user);
        await user.save();
        res.status(201).send('User created successfully');
    } catch (error) {
        res.status(500).send('Error creating user');
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send('User not found');
    }
    // const validPassword = await bcrypt.compare(password, user.password);
    if (!password) {
        return res.status(401).send('Invalid password');
    }
    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
    res.send({ token });
});

// Equipment registration endpoint
app.post('/equipment', async (req, res) => {
    const { equipmentName, pricing, photoKey } = req.body;
    const equipment = new Equipment({ equipmentName, pricing, photoKey });
    try {
        await equipment.save();
        res.status(201).send('Equipment registered successfully');
    } catch (error) {
        res.status(500).send('Error registering equipment');
    }
});

// Photo upload endpoint
app.post('/upload-photo', async (req, res) => {
    const type=req.body.type;
    const equipmentName=req.body.equipmentName;

    const email = "yogesh@gmail.com";//temporary hard coded
    // const filename="myfile"//temporary hard coded
    const photoKey=`uploads/${email+equipmentName}.jpg`;

    // console.log(filename,"and req body",req.body)
    // const ContentType=req.body
    const command = new PutObjectCommand({
        Bucket: "nodejsprivate",
        Key: photoKey,
        ContentType: type,
    });
    try {
        const url = await getSignedUrl(s3Client, command);
        // axios.put(image)
        res.send({ url,photoKey });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading photo');
    }
});

// List all equipment endpoint
app.get('/equipment', async (req, res) => {
    try {
        const equipment = await Equipment.find();
        const equipmentWithUrls = await Promise.all(equipment.map(async (item) => {
            const photoUrl = await getObjectUrl(item.photoKey);
            return {
                ...item.toObject(),
                objectUrl: photoUrl
            };
        }));
        res.send(equipmentWithUrls);
    } catch (error) {
        res.status(500).send('Error fetching equipment');
    }
});

async function getObjectUrl(key){
    const command = new GetObjectCommand({
        Bucket: "nodejsprivate",
        Key: key,
    });
    const url = await getSignedUrl(s3Client, command);
    return url;
}

// List user's equipment endpoint
app.get('/user/:userId/equipment', async (req, res) => {
    const userId = req.params.userId;
    try {
        const userEquipment = await Equipment.find({ userId });
        res.send(userEquipment);
    } catch (error) {
        res.status(500).send('Error fetching user equipment');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
