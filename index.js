const express = require('express');
const cors = require('cors');
const BodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const app = express();

app.use(cors());
app.use(BodyParser.json())

const uri = process.env.DB_PATH;
let client = new MongoClient(uri, {useNewUrlParser : true ,  useUnifiedTopology: true });



// Get
app.get('/' , (req,res) => res.send("<h1><center>Welcome to Doctors Portal Backend Server</center></h1>"))

// Get all Appointments 
app.get('/appointments', (req, res) => {
    client = new MongoClient(uri, {useNewUrlParser : true,  useUnifiedTopology: true });
    client.connect(conErr => {
        const collection = client.db('doctorsPortal').collection('appointments');
        collection.find().toArray((err , documents) => {
            err ? res.status(500).send(err) : res.send(documents)
        })
    })
    client.close();

})

// Get all Booked Appointments 
app.get('/bookedAppointments', (req, res) => {
    client = new MongoClient(uri, {useNewUrlParser : true,  useUnifiedTopology: true });
    client.connect(conErr => {
        const collection = client.db('doctorsPortal').collection('bookedAppointments');
        collection.find().toArray((err , documents) => {
            err ? res.status(500).send(err) : res.send(documents)
        })
    })
    client.close();

})

//Post 
// Updating Booking Status
app.post('/updateBookingStatus', (req, res) => {
    const ap = req.body;
    console.log(ap);
    client = new MongoClient(uri, {useNewUrlParser : true,  useUnifiedTopology: true });

    client.connect(err => {
        const collection = client.db('doctorsPortal').collection('bookedAppointments');
        collection.updateOne(
            { _id:ObjectId(ap.id) }, 
            {
            $set: {  "status" : ap.status },
            },
          (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result);
                console.log(result);
            }
            client.close();
        })
    });
})

// Updating Prescription Status
app.post('/updatePrescription', (req, res) => {
    const ap = req.body;
    console.log(ap);
    client = new MongoClient(uri, {useNewUrlParser : true,  useUnifiedTopology: true });

    client.connect(err => {
        const collection = client.db('doctorsPortal').collection('bookedAppointments');
        collection.updateOne(
            { _id:ObjectId(ap.id) }, 
            {
            $set: {  "prescription" : ap.prescription },
            },
          (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result);
                console.log(result);
            }
            client.close();
        })
    });
})

//Route to insert Appointment Data at once
app.post('/insertAppointment' , (req,res) => {
    const data = req.body;
    console.log(data);
    client = new MongoClient(uri, {useNewUrlParser : true,  useUnifiedTopology: true });
    client.connect(conErr => {
        console.log(conErr);
        const collection = client.db('doctorsPortal').collection('appointments');
        collection.insertOne(data, (err , result) => {
            err ? res.status(500).send({message : err}) : res.send(result.ops[0])
            console.log(err);
        })
    client.close();

    })
})

const port = process.env.PORT || 3201;
app.listen(port, err => err ? console.log("Failed to Listen on Port" , port) : console.log("Listening for Port" , port));