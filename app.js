const express = require('express');
const app = express();
const randStr = require('randomstring')
const port = process.env.PORT || 3000

const cors = require('cors');

// config db
var admin = require("firebase-admin");
const {getFirestore} = require('firebase-admin/firestore')

var serviceAccount = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jualan-e700a-default-rtdb.firebaseio.com"
});

const db = getFirestore();
const Items = db.collection('items')

// middleware
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cors({
    origin:'*'
}))


// router 

// get all items
app.get('/items',async(req,res) => {
    const response = await Items.get();
    const items = []
    response.forEach(item => items.push(item.data()))

    res.json({
        status : 'berhasil',
        isSuccess : true,
        data:items
    })
})

// get by id
app.get('/items/:id',async(req,res) => {
    const response = await Items.where('id','==',req.params.id).get();
    const items = []
    response.forEach(item => items.push(item.data()))

    res.json({
        status : 'berhasil',
        isSuccess : true,
        data:items
    })
})

// add new item
app.post('/items',async(req,res) => {
    const data = req.body
    data.forEach(item => {
        Items.add(item)
    })
    // await Items.add(req.body);
    res.json({
        msg : 'berhasil menambahkan item',
        status : 'berhasil',
        isSuccess : true 
    })
})

// update item
app.put('/items/:id',async(req,res) => {
    const response = await Items.where('id','==',req.params.id).get();

    response.forEach(item => {
        Items.doc(item.id).update(req.body)
    })

    res.json({
        msg : 'item berhasil diubah',
        status : 'berhasil',
        isSuccess : true 
    })
})

// delete item
app.delete('/items/:id',async(req,res) => {
    const response = await Items.where('id','==',req.params.id).get();

    response.forEach(item => {
        Items.doc(item.id).delete()
    })

    res.json({
        msg : 'item berhasil dihapus',
        status : 'berhasil',
        isSuccess : true 
    })
})

app.listen(port,() => console.log(`server is running on port ${port}`))