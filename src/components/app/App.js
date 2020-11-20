 import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import CreditCardUtils from 'creditcardutils';

import HeaderNavigation from '../header-navigation/HeaderNavigation';
import Details from '../details/Details';
import DateRange from '../dateRange/DateRange';
import Payment from '../payment/Payment';
import Confirmation from '../confirmation/Confirmation';

import './App.css';

class App extends Component {

	constructor() {
		super();

		this.state = { pageNum: 0 };

		this.dateDeparture = "";
		this.dateReturn = "";
		this.hotel = {};
		this.numOfTravelers = 1;
		this.room = {
			name: "Standard Room",
			roomExtraCharge: 0
		};
		this.dateDiff = 1;
		this.travelerInfo = [
			{
				first_name: '',
				last_name: '',
				middle_name: '',
				date_of_birth: ''
			}, {
				first_name: '',
				last_name: '',
				middle_name: '',
				date_of_birth: ''
			}
		];
		this.contactInfo = {
			street_address: '',
			country: '',
			city: '',
			region: '',
			postal_code: '',
			email: '',
			phone: ''
		};
		this.paymentInfo = {
			cardNum: '',
			expDate: '',
			secCode: 0
		};
		this.confirmationCode = '';
		this.insurance = [];
		this.error = [];
	}

	getDates(dateDeparture, dateReturn, dateDiff) {
		this.dateDeparture = dateDeparture;
		this.dateReturn = dateReturn;
		this.dateDiff = dateDiff;
	}

	getHotel(hotel) {
		this.hotel = hotel;
	}

	getRoom(room) {
		this.room = room;
	}

	getTraveler(travelerInfo, traveler) {
		this.travelerInfo[traveler - 1] = travelerInfo;
	}

	getContactInfo(info) {
		this.contactInfo = info;
	}

	getPaymentInfo(info) {
		this.paymentInfo = info;
	}

	getConfirmationNumber(num) {
		this.confirmationCode = num;
	}

	getNumOfTravelers(num) {
		this.numOfTravelers = num;
	}

	getInsuranceInfo(insurance) {
		this.insurance = insurance;
	}

	validateInfo(payMonthlyOptionSelected=true) {
		this.error = [];

		this.validateTraveler(1);
		this.numOfTravelers === 2 ? this.validateTraveler(2) : "";
		this.validateContactInfo();
		(payMonthlyOptionSelected === false) ?
			this.validatePaymentMethod() : "";

		return this.error;
	}

	validateTraveler(traveler) {
		let info = this.travelerInfo[traveler - 1];

		if (info.first_name === "" || info.last_name === "" || info.date_of_birth === "") {
			this.error.push(`Traveler ${traveler} info is not complete.`);
			return ;
		}
	}

	validateContactInfo() {
		if (this.contactInfo.street_address === "" || this.contactInfo.city === "" ||
				this.contactInfo.region === "" || this.contactInfo.country === "" ||
				this.contactInfo.postal_code === "" || this.contactInfo.email === "" ||
				this.contactInfo.phone === "") {
			this.error.push(`Contact information is not complete.`);
			return ;
		}
	}

	validatePaymentMethod() {
		if (this.paymentInfo.cardNum === "" || this.paymentInfo.expDate === "" ||
				this.paymentInfo.secCode === "") {
			this.error.push(`Credit card information is not valid.`);
			return ;
		}

		let cardNum = CreditCardUtils.formatCardNumber(this.paymentInfo.cardNum);
		let expDate = this.paymentInfo.expDate.split('-');

		/** Remove Later **/
		// if (this.paymentInfo.cardNum === "4111111111111111" && this.paymentInfo.expDate === "12-2018" && this.paymentInfo.secCode === "123") return;

		if (CreditCardUtils.validateCardNumber(cardNum) === false ||
			CreditCardUtils.validateCardExpiry(expDate[1], expDate[0]) === false ||
			CreditCardUtils.validateCardCVC(this.paymentInfo.secCode) === false) {
				this.error.push(`Credit card information is not valid.`);
				return ;
		}
	}

	changePage(pageNum) {
		this.setState({ pageNum: pageNum + 1 });
	}

	render() {
		return (
			<div className="app">
				<BrowserRouter>
					<div>
						<HeaderNavigation pageNum={this.state.pageNum} />
						<Route exact path='/' component={(props) =>
							<DateRange {...props}
								sendDateRange={this.getDates.bind(this)}
								sendHotel={this.getHotel.bind(this)}
								sendNumOfTravelers={this.getNumOfTravelers.bind(this)}
								changePage={this.changePage.bind(this)}
								dateDeparture={this.dateDeparture}
								dateReturn={this.dateReturn}
								numOfTravelers={this.numOfTravelers}/>}
						/>
						<Route exact path='/details' component={(props) =>
							<Details {...props}
								sendRoom={this.getRoom.bind(this)}
								changePage={this.changePage.bind(this)}
								dateDeparture={this.dateDeparture}
								dateReturn={this.dateReturn}
								dateDiff={this.dateDiff}
								hotel={this.hotel}
								room={this.room}/>}
						/>
						<Route exact path="/payment" component={(props) =>
							<Payment {...props}
								sendTraveler={this.getTraveler.bind(this)}
								sendContactInfo={this.getContactInfo.bind(this)}
								sendPaymentInfo={this.getPaymentInfo.bind(this)}
								changePage={this.changePage.bind(this)}
								numOfTravelers={this.numOfTravelers}
								hotel={this.hotel}
								room={this.room}
								dateDeparture={this.dateDeparture}
								dateReturn={this.dateReturn}
								dateDiff={this.dateDiff}
								sendInsurance={this.getInsuranceInfo.bind(this)}
								travelerInfo={this.travelerInfo}
								contactInfo={this.contactInfo}
								insurance={this.insurance}
								validateInput={this.validateInfo.bind(this)}
								sendConfirmationNum={this.getConfirmationNumber.bind(this)} />}
						/>
						<Route exact path="/confirmation" component={(props) =>
							<Confirmation {...props}
								confirmationNum={this.confirmationCode} />}
						/>
					</div>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;
