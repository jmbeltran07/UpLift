import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Places from '../places/Places';
import './DateRange.css';

import data from '../../places';

import { updateUpNodes } from '../uplift-components/upLiftTools'

class DateRange extends Component {

	constructor(props) {
		super(props);

		this.state = {
			data,
			display: false,
		 };
		this.stars = [];
		this.dateDiff = 0;

		this.dateDeparture = this.props.dateDeparture;
		this.dateReturn = this.props.dateReturn
		this.numOfTravelers = this.props.numOfTravelers
	}

	componentWillMount() {
		if (this.dateDeparture !== "" && this.dateReturn !== "") {
			this.getPlaces();
		}
	}

	getToday() {
		let currDate = new Date();
		let dd = currDate.getDate();
		let mm = currDate.getMonth() + 1;
		let yyyy = currDate.getFullYear();

		dd = (dd < 10) ? `0${dd}` : dd;
		mm = (mm < 10) ? `0${mm}` : mm;

		return `${yyyy}-${mm}-${dd}`;
	}

	parseDate(dateStr) {
		let dateArr = dateStr.split('-');
		return new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
	}

	handleCheckBox(stars) {
		if (stars !== 0) {
			let ind = this.stars.indexOf(stars);

			(ind >= 0) ? this.stars.splice(ind, 1) : this.stars.push(stars);
		}

		let places = [];
		places = (this.stars.length === 0) ? data : data.filter(el => this.stars.indexOf(el.rating) >= 0);
		places.map(place => place.totalPrice = place.price * this.dateDiff);
		this.setState({ data: places });

	}

	handleSubmit() {
		this.dateDeparture = document.getElementById('departureDate').value;
		this.dateReturn = document.getElementById('returnDate').value;

		this.getPlaces();
		updateUpNodes({
			buildTripInfo: this.buildTripInfo.bind(this)
		})
	}

	handleSelection(place) {
		this.props.sendHotel(place);
		this.props.changePage(0);
		this.props.history.push('/details');
	}

	handleTraveler(traveler) {
		this.props.sendNumOfTravelers(traveler);
		this.numOfTravelers = traveler

		if (traveler === 1) {
			document.getElementById('btn-1').className = 'btn-active';
			document.getElementById('btn-2').className = 'btn-passive';
		} else {
			document.getElementById('btn-2').className = 'btn-active';
			document.getElementById('btn-1').className = 'btn-passive';
		}
	}

	getPlaces() {
		let day = 1000*60*60*24;

		if (this.dateReturn  === "" || this.dateDeparture === "") return ;

		this.dateDiff = Math.round(Math.abs((this.parseDate(this.dateReturn) - this.parseDate(this.dateDeparture))/(day)));
		if (this.dateDiff <= 0) {
			alert('Please enter valid dates!');
			this.setState({ display: false });
		} else {
			this.handleCheckBox(0);
			this.props.sendDateRange(this.dateDeparture, this.dateReturn, this.dateDiff);
			this.setState({ display: true });
		}
	}

	buildTripInfo() {
		const travelers = []
		for(let i = 0; i < this.numOfTravelers; i++) {
			travelers.push({id: i})
		}
		return {
			order_amount: 99900, // always send minor units (integer)
			travelers: travelers,
			air_reservations: [
				{
					trip_type: 'roundtrip',
					itinerary: [
						{
							departure_apc: '',
							arrival_apc: '',
							// departure_time: '20210618'
							departure_time: this.dateDeparture.replaceAll('-','')
						},
						{
							departure_apc: '',
							arrival_apc: '',
							// departure_time: '20210624'
							departure_time: this.dateReturn.replaceAll('-','')
						}
					],
					insurance: []
				}
			]
		}
	}

	render() {
		let today = this.getToday();

		return (
			<div className="dateRange">
				<div className="dateRange-welcome">
					<h1 style={{color: '#9E9E9E', fontWeight: 200, fontSize: 50}}>Welcome to
						<span style={{color: '#00838F', fontWeight: 600}}> Quest</span>
						<span style={{color: '#BDBDBD', fontWeight: 600}}>Air</span><span>!</span>
					</h1>
					<h3 style={{fontWeight: 200}}>Select departure and return dates</h3>
					<br />
				</div>
				<div className="datePicker">
					<div className="field">
						<label>Depatrute Date:</label>
						<input type="date" id="departureDate" min={today} defaultValue={this.dateDeparture} />
					</div>
					<div className="field">
						<label>Return Date:</label>
						<input type="date" id="returnDate" min={today} defaultValue={this.dateReturn} />
					</div>
					<div className="field">
						<label># of Travelers:</label>
						<div>
							<button id="btn-1" className='btn-active' onClick={() => this.handleTraveler(1)}>1</button>
							<button id="btn-2" className='btn-passive' onClick={() => this.handleTraveler(2)}>2</button>
						</div>
					</div>
					<button onClick={this.handleSubmit.bind(this)}>Search</button>
				</div>
				{this.state.display === true ?
					<div>
						<div className="checkboxes">
							<div className="checkbox-container">
								<input type="checkbox" id="fiveStars" onClick={() => this.handleCheckBox(5)} />
								<label>*****</label>
							</div>
							<div className="checkbox-container">
								<input type="checkbox" id="fourStars" onClick={() => this.handleCheckBox(4)} />
								<label>****</label>
							</div>
							<div className="checkbox-container">
								<input type="checkbox" id="threeStars" onClick={() => this.handleCheckBox(3)} />
								<label>***</label>
							</div>
							<div className="checkbox-container">
								<input type="checkbox" id="twoStars" onClick={() => this.handleCheckBox(2)} />
								<label>**</label>
							</div>
							<div className="checkbox-container">
								<input type="checkbox" id="oneStar" onClick={() => this.handleCheckBox(1)} />
								<label>*</label>
							</div>
							<br />
						</div>
						<Places
							places={this.state.data}
							placeSelected={this.handleSelection.bind(this)}
							dateDeparture={this.dateDeparture}
							dateReturn={this.dateReturn}/>
					</div>
				: ""}
			</div>
		);
	}
}

DateRange.propTypes = {
	sendDateRange: PropTypes.func,
	sendHotel: PropTypes.func,
	sendNumOfTravelers: PropTypes.func,
	dateDeparture: PropTypes.string,
	dateReturn: PropTypes.string,
	numOfTravelers: PropTypes.number
}

DateRange.defaultProps = {
	sendDateRange: () => {},
	sendHotel: () => {},
	sendNumOfTravelers: () => {},
	dateDeparture: "",
	dateReturn: "",
	numOfTravelers: 1
}

export default DateRange;
