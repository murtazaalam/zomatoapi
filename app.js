var express = require('express');
var app = express();
var dotenv = require('dotenv');
dotenv.config();
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

var mongoUrl = process.env.MongoLiveUrl;
var port = process.env.PORT || 9592;
var db;

//default routing
app.get('/', (req, res) => {
    res.send('This is default route');
})

//list of all city
app.get('/location', (req, res) => {
    db.collection('location').find().toArray((err, result)=>{
        if(err) throw err;
        res.send(result);
    })
})

//list of all mealType
app.get('/mealType', (req, res) => {
    db.collection('mealtype').find().toArray((err, result)=>{
        if(err) throw err;
        res.send(result);
    })
})

/*app.get('/restaurant', (req, res) => {
    db.collection('restaurant').find().toArray((err, result)=>{
        if(err) throw err;
        res.send(result);
    })
})*/

//restaurant wrt restaurant_id
app.get('/restaurant/:id', (req, res) => {
    var id = parseInt(req.params.id);
    db.collection('restaurant').find({"restaurant_id":id}).toArray((err, result)=>{
        if(err) throw err;
        res.send(result);

    })
})
//query param example
//wrt to city_name
//if query params exists give all restaurants wrt state_id
//else give all restaurants
//example(/restaurant?state=3)
app.get('/restaurant', (req, res)=>{
    var query = {}
    if(req.query.state){
        query={state_id:Number(req.query.state)}
        //console.log("query: ", query); visible in  cmd where server is running
    }
    db.collection('restaurant').find(query).toArray((err, result)=>{
        if(err) throw err;
        res.send(result);
    })
})

//list of menu item
app.get('/menu', (req, res) => {
    db.collection('menu').find().toArray((err, result)=>{
        if(err) throw err;
        res.send(result);
    })
})

app.get('/menu/:restid', (req, res)=>{
    db.collection('menu').find({restaurant_id:restid}).toArray((err, result)=>{
        if(err) throw err;
        res.send(result);
    })
})

//list of all order placed
app.get('/orders', (req, res) => {
    db.collection('order').find().toArray((err, result)=>{
        if(err) throw err;
        res.send(result);
    })
})

//connecting to mongodb
MongoClient.connect(mongoUrl, (err, client) => {
    if(err) console.log('error while connecting to mongodb');
    db = client.db('augintern');
    app.listen(port, ()=>{
        console.log(`listening to port ${port}`);
    })
})