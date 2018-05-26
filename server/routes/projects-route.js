'use strict';
const router = require('express').Router();
const Project = require('../models/project');

//////////////////// Project API ////////////////////////

// To get all the projects from the database
router.get('/', function (req, res) {
	Project.getProjects(function (err, projects) {
		if (err) {
			throw err;
		}
		res.json(projects);
	});

});

//To get a project details using it's id
router.get('/:_id', function (req, res) {
	Project.getProjectById(req.params._id, function (err, project) {
		if (err) {
			throw err;
		}
		res.json(project);
	});
});

// validate incoming data
function validateData(data) {

	let errors = {};
	if (data.text === '') errors.title = "Ohh! Project can't be empty!!";
	const isValid = Object.keys(errors).length === 0;
	return { errors, isValid };
}

//To add a new project to the database
router.post('/', function (req, res) {
	var project = req.body;
	Project.addProject(project, function (err, project) {
		if (err) {
			throw err;
		}
		res.json(project);
	});
});

//To update a project details by its id
router.put('/:_id', function (req, res) {
	var id = req.params._id;
	var project = req.body;
	Project.updateProject(id, project, {}, function (err, project) {
		if (err) {
			throw err;
		}
		res.json(project);
	});
});

//To delete a project using its id
router.delete('/:_id', function (req, res) {
	var id = req.params._id;
	Project.deleteProject(id, function (err, project) {
		if (err) {
			throw err;
		}
		res.json(project);
	});
});

module.exports = router;
