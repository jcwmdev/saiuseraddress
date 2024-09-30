const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./model/User');
const Address = require('./model/Address');
const dotEnv = require("dotenv")

const app = express();
const port = 3000;
dotEnv.config()

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() =>{ 
        console.log('MongoDB connected')
    })
    .catch(err =>{
            console.log(err)});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to register user and address
app.post('/register', async (req, res) => {
    const { name, address } = req.body;

    try {
        // Create and save user
        const user = new User({ name });
        const savedUser = await user.save();

        // Create and save address
        const userAddress = new Address({ userId: savedUser._id, address });
        await userAddress.save();

        res.status(201).send('User and address stored successfully');
    } catch (err) {
        res.status(500).send('Error storing data: ' + err.message);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
