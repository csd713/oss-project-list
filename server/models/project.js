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

//Function to get projectSchema
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