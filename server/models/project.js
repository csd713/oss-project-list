'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Project schema

const projectSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	owner: {
		type: String,
		required: true
	},
	gitHubLink: {
		type: String,
		required: true
	}
});

//this object can be accessed outside
const Project = mongoose.model('Project', projectSchema);
module.exports = Project;

//Function to get projects
module.exports.getProjects = function (callback, limit) {
	Project.find(callback).limit(limit);
}

//Function to get Project by ID
module.exports.getProjectById = function (id, callback) {
	Project.findById(id, callback);
}

//Function to add a Project
module.exports.addProject = function (project, callback) {
	Project.create(project, callback);
}

//Function to update Project
module.exports.updateProject = function (id, project, options, callback) {
	var query = {
		_id: id
	};
	var update = {
		name: project.name,
		owner: project.owner,
		gitHubLink: project.gitHubLink
	}
	Project.findOneAndUpdate(query, update, options, callback);
}

//Function to delete a Project
module.exports.deleteProject = function (id, callback) {
	var query = {
		_id: id
	};
	Project.remove(query, callback);
}

//Function to get projects using pagination
module.exports.getProjectsByPage = function (page, callback) {
	let query = {};
	query.skip = page.size * (page.number - 1);
	query.limit = page.size;

	// count function is async - so find after getting the count
	Project.count({}, function (err, count) {
		if (err) {
			return callback('Error in DB - No documents', null);
		}

		let totalPages = Math.ceil(count / page.size);

		if (page.number > totalPages) {
			return callback(`Invalid page number. Try a page number between 1 - ${totalPages}.`, null);
		}

		Project.find({}, {}, query, callback);
	})
}