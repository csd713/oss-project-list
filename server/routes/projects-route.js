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
		// Make request to GitHub API here and then send response
		// loopover all the repo names and fetch the required details
		// do something else when it is done
		getDataFromGItHub(projects)
			.then((projects) => {
				//console.log(projects);
				res.json(projects);
			});
	});
});

// To get the projects from the database based on pages
router.get('/page/:page_no', function (req, res) {
	let page = {};
	page.number = parseInt(req.params.page_no);

	// keep the size of the page to 10 comments per page by default
	page.size = 10;

	if (page.number < 0 || page.number === 0) {
		return res.json({
			message: "Error",
			error: "Invalid page number. Try positive page number!"
		});
	}

	Project.getProjectsByPage(page, function (err, projects) {
		if (err) {
			return res.json({
				message: "Error en aplicacion",
				error: err
			});
		}
		getDataFromGItHub(projects)
			.then((projects) => {
				res.json(projects);
			});
	});

});

// function to fetch following data from GitHub API
// total-open-issues, language
async function getDataFromGItHub(projects) {
	try {

		const arrayOfIssueCountPromises = projects.map((project) => {
			// return the promise
			const promise = request({
				url: `${gitEndpoint}/repos/${project.owner}/${project.name}?client_id=${keys.gitHub.client_id}&client_secret=${keys.gitHub.client_secret}`,
				method: 'GET',
				headers: {
					'User-Agent': userAgent
				}
			});

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
			project.language = JSON.parse(result[i]).language;
			project.updated_at = JSON.parse(result[i]).updated_at;
			project.description = JSON.parse(result[i]).description;
			temp_projects.push(project);
		}

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
