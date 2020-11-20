import React, { Component } from 'react';
import uuidv1 from 'uuid/v1';
import PropTypes from 'prop-types';

import HeaderNavigation from '../header-navigation/HeaderNavigation';

import './Confirmation.css';

class Confirmation extends Component {

	componentWillMount() {
		if (this.props.confirmationNum === "") {
			this.props.history.push('/');
		}
	}

	render() {
		return (
			<div className="confirmation">
				<div className="confirmation-thanks">
					<h1>Thanks for your order!</h1>
					<h5>Your confimation number is </h5>
					<h3>{this.props.confirmationNum}</h3>
				</div>
			</div>
		);
	}
}

Confirmation.propTypes = {
	confirmationNum: PropTypes.string,
};

Confirmation.defaultProps = {
	confirmationNum: ''
};

export default Confirmation;
