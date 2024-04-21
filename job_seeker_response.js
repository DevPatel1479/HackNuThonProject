const express = require("express");
const admin = require('firebase-admin');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const cors = require('cors');
app.use(cors());
app.use(express.json());

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://webapi-88a91-default-rtdb.firebaseio.com'
});

const db = admin.database();

app.post('/api/send_data', (req, res) => {
    const data = req.body;
    console.log('Received data:', data);

    // Store the data in the Firebase Realtime Database
    const ref = db.ref('users');

    if (Object.keys(data).length != 0 && (data["stop"]) !== true) {
        console.log(data);

        ref.push(data);        
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send("Question over");
            }
        });

        // res.send("Question over");     
    }
    else{
        res.send("Not received");
    }

});
server.listen(3030, () => {
    console.log("Server running at ws://localhost:3030/api/send_data");
});
