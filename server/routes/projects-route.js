'use strict';
const router = require('express').Router();
const Project = require('../models/project');
const request = require('request-promise');
const keys = require('../gitCredentials');

const gitEndpoint = 'https://api.github.com';
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.56 Safari/536.5';

//////////////////// Project API ////////////////////////

// To get all the projects from the database
router.get('/', function (req, res) {
	Project.getProjects(function (err, projects) {
		if (err) {
			throw err;
		}

		// TODO - paginate to only 10 repos at a time


		// TODO - make request to GitHub API here and then send response
		// loopover all the repo names and fetch the required details
		// do something else when it is done
		// console.log(projects);
		getOpenIssuesCount(projects)
			.then((projects) => {
				//console.log(projects);
				res.json(projects);
			});

	});

});

// function to fetch total open issues from GitHub API

async function getOpenIssuesCount(projects) {
	try {

		const arrayOfIssueCountPromises = projects.map((project) => {
			// return promise
			const promise = request({
				url: `${gitEndpoint}/repos/${project.owner}/${project.name}?client_id=${keys.gitHub.client_id}&client_secret=${keys.gitHub.client_secret}`,
				method: 'GET',
				headers: {
					'User-Agent': userAgent
				}
			});
			// let count = JSON.parse(promise).open_issues_count;
			// console.log(promise);
			return promise;
		});

		// response array
		const result = await Promise.all(arrayOfIssueCountPromises);

		// append this to existing json
		let temp_projects = [];
		for (let i = 0; i < result.length; i++) {

			let project = {};
			project._id = projects[i]._id;
			project.name = projects[i].name;
			project.owner = projects[i].owner;
			project.gitHubLink = projects[i].gitHubLink;
			project.open_issues_count = JSON.parse(result[i]).open_issues_count;
			temp_projects.push(project);
		}

		// console.log(temp_projects[0]);
		// console.log('End of loop');
		return temp_projects;
	} catch (e) {
		console.log(e.message);
	}
}


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
