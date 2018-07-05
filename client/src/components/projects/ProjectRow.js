import React from 'react';

function ProjectRow(props) {

	return (
		<tr className="d-flex">
			<td className="col-2"><a href={props.project.gitHubLink}>{props.project.name}</a></td>
			<td className="col-4">{props.project.description}</td>
			<td className="col-2">{props.project.language}</td>
			<td className="col-1">{props.project.open_issues_count}</td>
			<td className="col-1">{props.project.owner}</td>
			<td className="col-2">{props.project.updated_at}</td>
		</tr>
	);

}

export default ProjectRow;