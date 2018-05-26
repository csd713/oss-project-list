'use strict';
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const projectsRoute = require('./routes/projects-route');

//Using dot env to laod environment variables
dotenv.load();

const app = express();
app.use(bodyParser.json());

//PROJECTSTORE_MLAB_URL - MongoDb url from Mlab
const MONGODB_URL = process.env.COMMENTSTORE_MLAB_URL || 'mongodb://localhost/projectstore';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URL, () => {
	console.log('Connected to MongoDB :)');
});

app.get('/', function (req, res) {
	res.send('go to /api/project');
});

app.use('/api/project', projectsRoute);

app.use((req, res) => {
	res.status(404).json({
		errors: {
			global: "Still working on it.. please try again later"
		}
	})
})

app.listen(PORT, () => {
	console.log('Listening on port ' + PORT);
});