var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var categories = JSON.parse(fs.readFileSync('_musicData.json'));
var artists = JSON.parse(fs.readFileSync('_energetic_artistBox.json'));

app.use('/', express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// app.get('/energetic_artistBox.json', function(req, res) {
// 	res.setHeader('Content-Type', 'application/json');
// 	res.send(JSON.stringify(artists));
// 	console.log('test');
// });

app.post('/energetic_artistBox.json', function(req, res) {
	console.log('post: ' + JSON.stringify(req.body));
	artists.push(req.body);
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(artists));
});

app.get('/musicData.json', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(categories));
});

app.listen(4000);