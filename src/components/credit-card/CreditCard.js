import React, { Component } from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';

import './CreditCard.css';

class CreditCard extends Component {
	constructor(props) {
		super(props);

		this.cardInfo = {
			cardNum: '',
			expDate: '',
			secCode: 0
		};
	}

	componentDidMount() {
		$('#cardNum').on('change', () => this.handleChange('cardNum'));
		$('#expDate').on('change', () => this.handleChange('expDate'));
		$('#secCode').on('change', () => this.handleChange('secCode'));
	}

	handleChange(id) {
		this.cardInfo[id] = document.getElementById(id).value;
		this.props.updateInfo(this.cardInfo);
	}

	render() {
		return (
			<div>
				<h3>Credit Card Information</h3>
				<hr />
				<div className="row">
					<div className="col-xs-12">
						<label htmlFor="cardNum">Card Number:</label>
						<input id="cardNum" type="text" />
					</div>
				</div>
				<div className="row">
					<div className="col-xs-6">
						<label htmlFor="expDate">Exp. Date:</label>
						<input id="expDate" type="month" />
					</div>
					<div className="col-xs-6">
						<label htmlFor="secCode">CCV:</label>
						<input id="secCode" type="text" />
					</div>
				</div>
			</div>
		);
	}
}

CreditCard.propTypes = {
	updateInfo: PropTypes.func
};

CreditCard.defaultProps = {
	updateInfo: () => {}
}

export default CreditCard;
