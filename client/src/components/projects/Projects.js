import React, { Component } from 'react';
import ProjectRow from './ProjectRow';
import './Projects.css';

class Projects extends Component {
	constructor() {
		super();
		this.state = {
			projects: [],
		};
		this.getProjects = this.getProjects.bind(this);
		this.handlePaginationClick = this.handlePaginationClick.bind(this);
	}

	componentDidMount() {
		this.getProjects(1);
	}

	getProjects(pageNo) {
		fetch(`/api/project/page/${pageNo}`)
			.then(res => res.json())
			.then(projects => this.setState({ projects }, () => console.log('Projects fetched...', projects)));
	}

	handlePaginationClick(pageNo, event) {
		this.getProjects(pageNo);
	}

	render() {
		return (
			<div>
				<div className="shadow p-3 mb-5 bg-white rounded">
					<a href="/">
						<h2 className="text-center">List of OSS Projects</h2>
					</a>
				</div>
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
								<ProjectRow key={project._id} project={project} />
							)}
						</tbody>
					</table>
				</div>
				<div>
					<nav aria-label="...">
						<ul className="pagination">
							<li className="page-item disabled">
								<a className="page-link" tabIndex="-1">Previous</a>
							</li>
							<li className="page-item"><a className="page-link" onClick={(e) => this.handlePaginationClick(1, e)}>1</a></li>
							<li className="page-item active">
								<a className="page-link" onClick={(e) => this.handlePaginationClick(2, e)}>2<span className="sr-only">(current)</span></a>
							</li>
							<li className="page-item"><a className="page-link" onClick={(e) => this.handlePaginationClick(3, e)}>3</a></li>
							<li className="page-item">
								<a className="page-link">Next</a>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		);
	}
}

export default Projects;
