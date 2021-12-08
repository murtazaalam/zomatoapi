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

app.get('/filter/:mealId', (req, res) => {
    var id = parseInt(req.params.mealId);
    var query = {'mealTypes.mealtype_id':id};
    var sort = {cost:1};
    // var skip = 0;
    // var limit = 1000000000;
    if(req.query.sortKey){
        var sortKey = req.query.sortKey;
        if(sortKey>1 || sortKey<-1 || sortKey == 0){
            sortKey = 1;
        }
        sort = {cost: Number(sortKey)}
    }
    if(req.query.lcost && req.query.hcost){
        var lcost = Number(req.query.lcost);
        var hcost = Number(req.query.hcost);
    }
    if(req.query.cuisine && req.query.lcost && req.query.hcost){
        query = {$and:[{cost:{$gt:lcost, $lt:hcost}}],
                    'cuisines.cuisine_id':Number(req.query.cuisine),
                    'mealTypes.mealtype_id':id}
    }
    else if(req.query.cuisine){
        query = {'mealTypes.mealtype_id':id, 'cuisines.cuisine_id':Number(req.query.cuisine)}
        //query = {'mealTypes.mealtype_id':id, 'cuisines.cuisine_id': {$in:[2,5]}} it will give cuisine id between 2 and 5
    }
    else if(req.query.lcost && req.query.hcost){
        
        query = {$and:[{cost:{$gt:lcost, $lt:hcost}}], 'mealTypes.mealtype_id':id}
    }
    db.collection('restaurant').find(query).sort(sort).toArray((err, result) => {
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
    var restid = Number(req.params.restid);
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