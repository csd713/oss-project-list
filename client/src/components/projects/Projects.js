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
				<div className="container-fluid table-responsive">
					<table className="table table-hover">
						<thead>
							<tr className="d-flex">
								<th scope="col" className="col-2">Project Name</th>
								<th scope="col" className="col-4">Description</th>
								<th scope="col" className="col-2">Language</th>
								<th scope="col" className="col-1">Open Issues</th>
								<th scope="col" className="col-1">Owner</th>
								<th scope="col" className="col-2">Last Active</th>
							</tr>
						</thead>
						<tbody>
							{this.state.projects.map(project =>
								<tr className="d-flex" key={project._id}>
									<td className="col-2"><a href={project.gitHubLink}>{project.name}</a></td>
									<td className="col-4">{project.description}</td>
									<td className="col-2">{project.language}</td>
									<td className="col-1">{project.open_issues_count}</td>
									<td className="col-1">{project.owner}</td>
									<td className="col-2">{project.updated_at}</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

export default Projects;
