const express = require('express');
const app = express();

const port = process.env.PORT || 3000

const cors = require('cors');

var admin = require("firebase-admin");
const {getFirestore} = require('firebase-admin/firestore')

var serviceAccount = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jualan-e700a-default-rtdb.firebaseio.com"
});

const db = getFirestore();
const User = db.collection('user')

app.use(express.json());
app.use(cors({
    origin:'*'
}))

app.get('/',async(req,res) => {
    const response = await User.get();
    const users = [];
    response.forEach(user => {
        users.push(user.data())
    });

    res.json(users)
})

app.listen(port,() => console.log(`server is running on port ${port}`))