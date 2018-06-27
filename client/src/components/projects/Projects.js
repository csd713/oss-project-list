import React, { Component } from 'react';
import './Projects.css';

class Projects extends Component {
	constructor() {
		super();
		this.state = {
			projects: []
		};
	}

	componentDidMount() {
		fetch('/api/project')
			.then(res => res.json())
			.then(projects => this.setState({ projects }, () => console.log('Projects fetched...', projects)));
	}


	render() {
		return (
			<div>
				<h2>List of OSS Projects</h2>
				<ul>
					{this.state.projects.map(project =>
						<li key={project._id}><a href={project.gitHubLink}>{project.name}</a> | Owner: {project.owner} | count: {project.open_issues_count}</li>
					)}
				</ul>
			</div>
		);
	}
}

export default Projects;
