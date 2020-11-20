import React, { Component } from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';

import './TravelerInfo.css';

class TravelerInfo extends Component {

	constructor(props) {
		super(props);

		this.traveler = this.props.travelerInfo;
	}

	componentDidMount() {
		$('#first_name' + this.props.travelerNum).on('change', () => this.handleChange('first_name'));
		$('#middle_name' + this.props.travelerNum).on('change', () => this.handleChange('middle_name'));
		$('#last_name' + this.props.travelerNum).on('change', () => this.handleChange('last_name'));
		$('#date_of_birth' + this.props.travelerNum).on('change', () => this.handleChange('date_of_birth'));
	}

	handleChange(id) {
		this.traveler.id = this.props.travelerNum - 1;
		if (id === 'date_of_birth') {
			let dob = $('#' + id + this.props.travelerNum).val();
			dob = dob.substring(5, 10) + '/' + dob.substring(0, 4);
			dob = dob.replace('-', '/');
			console.log(dob);
			this.traveler[id] = dob;
		} else {
			this.traveler[id] = $('#' + id + this.props.travelerNum).val();
		}
		this.props.updateInfo(this.traveler, this.props.travelerNum);
	}

	render() {
		let dob = this.props.travelerInfo.date_of_birth;
		dob = dob.substring(0, 5) + '-' + dob.substring(6, 10);
		return (
			<div>
				<h3>Traveler {this.props.travelerNum}</h3>
				<hr />
				<div className="row">
					<div className="col-xs-6" id="traveler firstName">
						<label htmlFor={"first_name" + this.props.travelerNum}>First Name:</label>
						<input id={"first_name" + this.props.travelerNum} type="text" defaultValue={this.props.travelerInfo.first_name} />
					</div>
					<div className="col-xs-6">
						<label htmlFor={"middle_name" + this.props.travelerNum}>Middle Name (optional):</label>
						<input id={"middle_name" + this.props.travelerNum} type="text" defaultValue={this.props.travelerInfo.middle_name} />
					</div>
					</div>
				<div className="row">
					<div className="col-xs-6">
						<label htmlFor={"last_name" + this.props.travelerNum} id="traveler lastName">Last Name:</label>
						<input id={"last_name" + this.props.travelerNum} type="text" defaultValue={this.props.travelerInfo.last_name} />
					</div>
					<div className="col-xs-6">
						<label htmlFor={"date_of_birth" + this.props.travelerNum} id="traveler date_of_birth">Date of Birth:</label>
						<input id={"date_of_birth" + this.props.travelerNum} type="date" defaultValue={dob} />
					</div>
					</div>
			</div>
		);
	}
}

TravelerInfo.propTypes = {
	travelerNum: PropTypes.number,
	travelerInfo: PropTypes.object,
	updateInfo: PropTypes.func
}

TravelerInfo.defaultProps = {
	travelerNum: 1,
	travelerInfo: {
		first_name: '',
		last_name: '',
		middle_name: '',
		date_of_birth: ''
	},
	updateInfo: () => {}
}

export default TravelerInfo;
