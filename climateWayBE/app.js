var ObjectId = require('mongodb').ObjectID;
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var collection;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

MongoClient.connect("mongodb://127.0.0.1:9001/clway", function(err, db) {
    if (!!err) {
        console.log('Error on MongoDb connection');
    } else {
        console.log('MongoDb is Connected');
    }
    collection = db.collection('records');
});

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST", "PUT");
    next();
});

// Definir a route principal
app.get('/', function(req, res) {
    res.send('Welcome to API');
});
//{"createdAt" : { $gte : new ISODate("2012-01-12T20:15:31Z") }}
// Definir um endpoint da API
app.post('/weatherData', function(req, res, next) {
    var responseData = {};
    var records = [];
    collection.find({
        "ts": {
            $gte: new Date(req.body.date+"T00:00:00.000Z"),
            $lte: new Date(req.body.date+"T23:59:59.000Z")
        },
        "sensor_code": parseInt(req.body.sensor_code),
        "device_code": 213981004
    }).toArray(function(err, results) {
        responseData.payload = results;
        res.contentType('application/json');
        res.send(JSON.stringify(responseData));
    });
});

// Aplicação disponível em http://127.0.0.1:9000/
app.listen(9000);
