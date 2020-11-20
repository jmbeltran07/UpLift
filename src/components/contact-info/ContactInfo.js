import React, { Component } from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';

import './ContactInfo.css';

class ContactInfo extends Component {

	constructor(props) {
		super(props);

		this.contactInfo = this.props.contactInfo;
	}

	componentDidMount() {
		$('#street_address').on('change', () => this.handleChange('street_address'));
		$('#city').on('change', () => this.handleChange('city'));
		$('#region').on('change', () => this.handleChange('region'));
		$('#country').on('change', () => this.handleChange('country'));
		$('#postal_code').on('change', () => this.handleChange('postal_code'));
		$('#email').on('change', () => this.handleChange('email'));
		$('#phone').on('change', () => this.handleChange('phone'));
	}

	handleChange(id) {
		this.contactInfo[id] = $('#' + id).val();
		this.props.updateInfo(this.contactInfo);
	}

	getState() {
		return (
			<select id="region">
				<option value=""></option>
				<option value="AL">AL</option>
				<option value="AK">AK</option>
				<option value="AR">AR</option>
				<option value="AZ">AZ</option>
				<option value="CA">CA</option>
				<option value="CO">CO</option>
				<option value="CT">CT</option>
				<option value="DC">DC</option>
				<option value="DE">DE</option>
				<option value="FL">FL</option>
				<option value="GA">GA</option>
				<option value="HI">HI</option>
				<option value="IA">IA</option>
				<option value="ID">ID</option>
				<option value="IL">IL</option>
				<option value="IN">IN</option>
				<option value="KS">KS</option>
				<option value="KY">KY</option>
				<option value="LA">LA</option>
				<option value="MA">MA</option>
				<option value="MD">MD</option>
				<option value="ME">ME</option>
				<option value="MI">MI</option>
				<option value="MN">MN</option>
				<option value="MO">MO</option>
				<option value="MS">MS</option>
				<option value="MT">MT</option>
				<option value="NC">NC</option>
				<option value="NE">NE</option>
				<option value="NH">NH</option>
				<option value="NJ">NJ</option>
				<option value="NM">NM</option>
				<option value="NV">NV</option>
				<option value="NY">NY</option>
				<option value="ND">ND</option>
				<option value="OH">OH</option>
				<option value="OK">OK</option>
				<option value="OR">OR</option>
				<option value="PA">PA</option>
				<option value="RI">RI</option>
				<option value="SC">SC</option>
				<option value="SD">SD</option>
				<option value="TN">TN</option>
				<option value="TX">TX</option>
				<option value="UT">UT</option>
				<option value="VT">VT</option>
				<option value="VA">VA</option>
				<option value="WA">WA</option>
				<option value="WI">WI</option>
				<option value="WV">WV</option>
				<option value="WY">WY</option>
			</select>
		);
	}

	render() {
		return (
			<div>
				<div className="row">
					<div className="col-xs-12">
						<label htmlFor="street_address">Address:</label>
						<input id="street_address" type="text" defaultValue={this.props.contactInfo.street_address} />
					</div>
				</div>
				<div className="row">
					<div className="col-xs-6">
						<label htmlFor="city">City:</label>
						<input id="city" type="text" defaultValue={this.props.contactInfo.city} />
					</div>
					<div className="col-xs-6">
						<label htmlFor="region">State:</label>
						{this.getState()}
					</div>
				</div>
				<div className="row">
					<div className="col-xs-6">
						<label htmlFor="country">Country:</label>
						<input id="country" type="text" defaultValue={this.props.contactInfo.country} />
					</div>
					<div className="col-xs-6">
						<label htmlFor="postal_code">Zip:</label>
						<input id="postal_code" type="text" defaultValue={this.props.contactInfo.postal_code} />
					</div>
				</div>
				<div className="row">
					<div className="col-xs-6">
						<label htmlFor="email">Email:</label>
						<input id="email" type="text" defaultValue={this.props.contactInfo.email} />
					</div>
					<div className="col-xs-6">
						<label htmlFor="phone">Phone (XXX-XXX-XXXX):</label>
						<input id="phone" type="text" defaultValue={this.props.contactInfo.phone} />
					</div>
				</div>
			</div>
		);
	}
}

ContactInfo.propTypes = {
	contactInfo: PropTypes.object,
	updateInfo: PropTypes.func
}

ContactInfo.defaultProps = {
	contactInfo: {},
	updateInfo: () => {}
}

export default ContactInfo;
