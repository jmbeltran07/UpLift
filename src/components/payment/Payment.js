import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1';
import $ from 'jquery';

import BookingDetails from '../booking-details/BookingDetails';
import TravelerInfo from '../traveler-info/TravelerInfo';
import ContactInfo from '../contact-info/ContactInfo';
import Insurance from '../insurance/Insurance';
import CreditCard from '../credit-card/CreditCard';
import UpCheckout from '../uplift-components/UpCheckout'

import './Payment.css';
import { updateUpNodes, sendErrorToUplift, confirm } from '../uplift-components/upLiftTools';

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
			totalPrice: this.props.hotel.price * this.props.dateDiff +
						this.props.room.roomExtraCharge,
			upLiftState: 'OFFER_AVAILABLE',
			enabledSelector: "fullpayment",
			tokenAvailable: false
		};

		this.insurance = [];
		this.confirmationNum = '';
	}

	buildTripInfo() {
		if(!this.props.hotel || !this.props.travelerInfo){
			return {}
		}

		// build travelers
		const travelers = this.props.travelerInfo.map((traveler, i) => {
			return {
				id: i,
				first_name: traveler.first_name,
				last_name: traveler.last_name,
				date_of_birth: traveler.date_of_birth
			}
		}).filter(traveler => traveler.first_name !== "" && traveler.last_name !== "" && traveler.date_of_birth !== "")

		// build insurance
		const insurance = this.props.insurance.map(insurance => {
			return {
				types: [
					"cancellation"
				],
				price: insurance.price
			}
		})

		return {
			travelers: travelers,
			order_amount: this.state.totalPrice * 100,
			air_reservations: [
				{
					trip_type: 'roundtrip',
					itinerary: [
						{
							departure_apc: 'JFK',
							arrival_apc: 'CUN',
							departure_time: this.props.dateDeparture.replaceAll('-','')
						},
						{
							departure_apc: 'CUN',
							arrival_apc: 'JFK',
							departure_time: this.props.dateReturn.replaceAll('-','')
						}
					],
					insurance: []
				}
			],
			hotel_reservations: [
				{
					number_of_rooms: 1,
					address: {
						city: this.props.hotel.location.split(",")[0].replaceAll(" "),
						region: this.props.hotel.location.split(",")[1].replaceAll(" "),
						country: this.props.hotel.location.split(",")[2].replaceAll(" ")
					},
					insurance: insurance,
					hotel_name: this.props.hotel.name,
					price: this.props.hotel.price
				}
			],
			billing_contact: {
				postal_code: this.props.contactInfo.postal_code,
				email: this.props.contactInfo.email,
				first_name: this.props.travelerInfo[0].first_name || "",
				last_name: this.props.travelerInfo[0].last_name || "",
				phone: this.props.contactInfo.phone,
				street_address: this.props.contactInfo.street_address,
				city: this.props.contactInfo.city,
				region: this.props.contactInfo.region,
				country: this.props.contactInfo.country
			}
		}
	}

	myOnChangeCallback(response) {
		var statusHandlers = {
		  OFFER_AVAILABLE: function () {
			
			// 1. show payment selectors
			// 2. show monthly pricing node in the selector
			// 3. hide "NOT AVAILABLE" node in the selector
			// 4. enable Pay Monthly selector
			// 5. disable Purchase/Book button
			if(this.state.upLiftState !== "OFFER_AVAILABLE"){
				console.log("OFFER_AVAILABLE")
				this.setState({
					upLiftState: "OFFER_AVAILABLE"
				})
			}
			window.Uplift.Payments.select();
		  }.bind(this),
		  TOKEN_AVAILABLE: function () {
			// 1. show payment selectors
			// 2. enable Pay Monthly selector
			// 3. enable Purchase/Book button
			if(!this.state.tokenAvailable){
				console.log("TOKEN_AVAILABLE")
				this.setState({
					tokenAvailable: true
				})
			}
		  }.bind(this),
		  TOKEN_RETRIEVED: function () {
			// retrieve and utilize the token:
			console.log("TOKEN_RETRIEVED")
			var token = response.token;
			this.setState({
				virtualCard: {
					cardNum: token.card_number,
					expDate: `${token.expiration_month}-${token.expiration_year}`,
					secCode: token.card_ccv
				},
				displayIFrame: "block"
			}, this.handleSubmit)
		  }.bind(this),
		  OFFER_UNAVAILABLE: function () {
			// A Pay Monthly offer is not available for this tripInfo
			// 1. show payment selectors
			// 2. show "NOT AVAILABLE" node in the selector
			// 3. hide monthly pricing node in the selector
			// 4. disable Pay Monthly selector
			// 5. change payment option selection, if Pay Monthly option is selected
			if(this.state.upLiftState !== "OFFER_UNAVAILABLE"){
				console.log("OFFER_UNAVAILABLE")
				this.setState({
					upLiftState: "OFFER_UNAVAILABLE"
				})
			}
			
		  }.bind(this),
		  SERVICE_UNAVAILABLE: function () {
			// Uplift API is not available
			// do not show payment selectors	
			if(this.state.upLiftState !== "SERVICE_UNAVAILABLE"){
				console.log("SERVICE_UNAVAILABLE")
				this.setState({
					upLiftState: "SERVICE_UNAVAILABLE"
				})
			}
		  }.bind(this)
		};
		statusHandlers[response.status]();
	}

	componentWillMount() {
		if ($.isEmptyObject(this.props.hotel)) {
			this.props.history.push('/');
		}
	}

	componentDidMount() {
		updateUpNodes({
			buildTripInfo: this.buildTripInfo.bind(this),
			newOnChangeCallBack: this.myOnChangeCallback.bind(this),
			newCheckout: true
		})
	}

	upLiftBook() {
		if(this.state.enabledSelector === "fullpayment"){
			this.handleSubmit()
		} else {
			window.Uplift.Payments.getToken();
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
			sendErrorToUplift(error, "AmountExceeded")
		}
		console.log('totalPrice: ', totalPrice);

		if (error.length > 0) {
			alert(`Several errors occurred:\n${error}`);
		} else {
			// TODO: check if the user wants to proceed with a 'pay monthly' option (send a vitualCard info)
			this.confirmationNum = uuidv1().split('-')[0];
			this.props.sendConfirmationNum(this.confirmationNum);
			if(payMonthlyOptionSelected){
				confirm(this.confirmationNum)
			}
			this.props.changePage(2);
			this.props.history.push('/confirmation');
		}
	}

	sendInsurance(info, insuranceTotalCharge) {
		this.props.sendInsurance(info);
		this.setState({
			 insuranceTotalCharge: insuranceTotalCharge,
			 totalPrice: this.props.hotel.price * this.props.dateDiff +
			 this.props.room.roomExtraCharge + insuranceTotalCharge
		}, () => {
			updateUpNodes({
				buildTripInfo: this.buildTripInfo.bind(this)
			})
		});
	}

	sendTraveler(travelerInfo, travelerNum) {
		this.props.sendTraveler(travelerInfo, travelerNum);
		this.setState({ update: !this.state.update }, () => {
			updateUpNodes({
				buildTripInfo: this.buildTripInfo.bind(this)
			})
		});
	}

	sendContactInfo(info) {
		this.props.sendContactInfo(info);
		this.setState({ update: !this.state.update }, () => {
			updateUpNodes({
				buildTripInfo: this.buildTripInfo.bind(this)
			})
		});
	}

	sendEnabledSelector(info) {
		this.setState({
			enabledSelector: info
		})
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
						<UpCheckout	
								key={this.state.upLiftState}
								priceValue = {this.state.totalPrice.toString()}
								sendEnabledSelector = {this.sendEnabledSelector.bind(this)}
								upLiftState={this.state.upLiftState}>
							<CreditCard updateInfo={this.sendPaymentInfo.bind(this)} />
						</UpCheckout>
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
							hideUpNodes={this.state.upLiftState === "SERVICE_UNAVAILABLE" || this.state.upLiftState === "OFFER_UNAVAILABLE"}
						/>
						<button className={`book-btn ${this.state.enabledSelector !== "fullpayment" && !this.state.tokenAvailable ? 'book-button-disabled' : ''}`} onClick={this.upLiftBook.bind(this)} disabled={this.state.enabledSelector !== "fullpayment" && !this.state.tokenAvailable}>
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
