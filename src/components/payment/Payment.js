import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1';
import $ from 'jquery';

import BookingDetails from '../booking-details/BookingDetails';
import TravelerInfo from '../traveler-info/TravelerInfo';
import ContactInfo from '../contact-info/ContactInfo';
import Insurance from '../insurance/Insurance';
import CreditCard from '../credit-card/CreditCard';

import './Payment.css';

class Payment extends Component {
	constructor(props) {
		super(props);

		this.state = {
			insuranceTotalCharge: 0,
			displayCreditCard: 'block',
			displayMonthlyEstimate: 'none',
			displaPayToday: 'none',
			displayIFrame: 'none',
			approved: false,
			iFrameDisabled: false,
			upLiftLoaded: false,
			virtualCard: {},
			update: true,
		};

		this.insurance = [];
		this.confirmationNum = '';
	}

	componentWillMount() {
		if ($.isEmptyObject(this.props.hotel)) {
			this.props.history.push('/');
		}
	}

	handleSubmit() {
		let error = '';
		let payMonthlyOptionSelected =
			$.isEmptyObject(this.state.virtualCard) === false && this.state.displayIFrame === 'block';
		if (payMonthlyOptionSelected) {
			this.props.sendPaymentInfo(this.state.virtualCard);
			error = this.props.validateInput().join('\n');
		} else {
			error = this.props.validateInput(false).join('\n');
		}

		const totalPrice =
			this.props.hotel.price * this.props.dateDiff +
			this.props.room.roomExtraCharge +
			this.state.insuranceTotalCharge;

		if (totalPrice > 5000) {
			error += `\nYour current total is $${totalPrice}\nTotal price cannot exceed $5000`;
			// * -----------------------------------------
			// * Uplift.Payments.orderError(errorMessage)
			// * -----------------------------------------
		}
		console.log('totalPrice: ', totalPrice);

		if (error.length > 0) {
			alert(`Several errors occurred:\n${error}`);
		} else {
			// TODO: check if the user wants to proceed with a 'pay monthly' option (send a vitualCard info)
			this.confirmationNum = uuidv1().split('-')[0];
			this.props.sendConfirmationNum(this.confirmationNum);

			this.props.changePage(2);
			this.props.history.push('/confirmation');
		}
	}

	sendInsurance(info, insuranceTotalCharge) {
		this.props.sendInsurance(info);
		this.setState({ insuranceTotalCharge });
	}

	sendTraveler(travelerInfo, travelerNum) {
		this.props.sendTraveler(travelerInfo, travelerNum);
		this.setState({ update: !this.state.update });
	}

	sendContactInfo(info) {
		this.props.sendContactInfo(info);
		this.setState({ update: !this.state.update });
	}

	sendPaymentInfo(info) {
		this.props.sendPaymentInfo(info);
	}

	render() {
		return (
			<div>
				<div className="container">
					<div className="traveler-1 col-xs-6">
						<TravelerInfo
							travelerNum={1}
							travelerInfo={this.props.travelerInfo[0]}
							updateInfo={this.sendTraveler.bind(this)}
						/>
						<ContactInfo
							contactInfo={this.props.contactInfo}
							updateInfo={this.sendContactInfo.bind(this)}
						/>
						{this.props.numOfTravelers === 2 ? (
							<div>
								<TravelerInfo
									travelerNum={2}
									travelerInfo={this.props.travelerInfo[1]}
									updateInfo={this.sendTraveler.bind(this)}
								/>
							</div>
						) : (
							''
						)}
						<Insurance
							insurance={this.props.insurance}
							updateInfo={this.sendInsurance.bind(this)}
						/>
						<CreditCard updateInfo={this.sendPaymentInfo.bind(this)} />
					</div>
					<div className="credit-card col-xs-4">
						<BookingDetails
							numOfTravelers={this.props.numOfTravelers}
							hotel={this.props.hotel}
							room={this.props.room}
							dateDeparture={this.props.dateDeparture}
							dateReturn={this.props.dateReturn}
							dateDiff={this.props.dateDiff}
							insuranceTotalCharge={this.state.insuranceTotalCharge}
						/>
						<button className="book-btn" onClick={this.handleSubmit.bind(this)}>
							BOOK
						</button>
					</div>
				</div>
			</div>
		);
	}
}

Payment.propTypes = {
	hotel: PropTypes.object,
	room: PropTypes.object,
	dateDeparture: PropTypes.string,
	dateReturn: PropTypes.string,
	dateDiff: PropTypes.number,
	insuranceTotalCharge: PropTypes.number,
	numOfTravelers: PropTypes.number,
	travelerInfo: PropTypes.array,
	contactInfo: PropTypes.object,
	insurance: PropTypes.array,
};

Payment.defaultProps = {
	numOfTravelers: 1,
	hotel: {},
	room: {},
	dateDeparture: '',
	dateReturn: '',
	dateDiff: 1,
	insuranceTotalCharge: 0,
	travelerInfo: [],
	ContactInfo: {},
	insurance: [],
};

export default Payment;
