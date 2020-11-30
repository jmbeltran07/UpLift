import React, { Component } from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';

import './Details.css';

import UpPricing from '../uplift-components/UpPricing'
import { updateUpNodes } from '../uplift-components/upLiftTools'

class Details extends Component {

	constructor(props) {
		super(props);

		this.state = { priceToDisplay: this.props.hotel.totalPrice + this.props.room.roomExtraCharge };

		this.currRoomExtraCharge = this.props.room.roomExtraCharge;
	}

	componentWillMount() {
		if ($.isEmptyObject(this.props.hotel)) {
			this.props.history.push('/');
		}
	}
	buildTripInfo() {
		return {
			order_amount: this.state.priceToDisplay * 100,
			air_reservations: [
				{
					trip_type: 'roundtrip',
					itinerary: [
						{
							departure_apc: '',
							arrival_apc: '',
							// departure_time: '20210618'
							departure_time: this.props.dateDeparture.replaceAll('-','')
						},
						{
							departure_apc: '',
							arrival_apc: '',
							// departure_time: '20210624'
							departure_time: this.props.dateReturn.replaceAll('-','')
						}
					],
					insurance: []
				}
			]
		}
	}

	componentDidMount() {
		if (this.props.room.name === 'Standard Room') {
			document.getElementById('standardRoom').checked = true;
		} else if (this.props.room.name === 'Premium Suite') {
			document.getElementById('premiumSuite').checked = true;
		} else {
			document.getElementById('presidentSuite').checked = true;
		}
		updateUpNodes({
			buildTripInfo: this.buildTripInfo.bind(this)
		})
	}

	handleRadioBtn(roomName, roomExtraCharge) {

		let room = {
			name: roomName,
			roomExtraCharge
		};
		this.props.sendRoom(room);
		this.currRoomExtraCharge = roomExtraCharge;
		this.handlePriceChange(roomExtraCharge);
	}

	handlePriceChange(charge) {
		this.setState({ priceToDisplay: this.props.hotel.totalPrice + charge }, () => {
			updateUpNodes({
				buildTripInfo: this.buildTripInfo.bind(this)
			})
		});
	}

	handleSubmit() {
		this.props.changePage(1);
		this.props.history.push('/payment');
	}

	getEstimatedExtraChargeStr(price) {
		if (price - this.currRoomExtraCharge < 0) {
			return "-$" + Math.abs(price - this.currRoomExtraCharge);
		}
		return "+$" + (price - this.currRoomExtraCharge);
	}

	getEstimatedExtraChargeNum(price) {
		return price - this.currRoomExtraCharge;
	}

	render() {
		let place = this.props.hotel;

		return (
			<div className="details">
				<br /><br />
				<img src="http://via.placeholder.com/800x300/eee" alt="" />
				<div className="details-container">
					<div>
						<div>
							<h3>{place.name}</h3>
							{place.rating === 1 ? <h2>*</h2> : ""}
							{place.rating === 2 ? <h2>**</h2> : ""}
							{place.rating === 3 ? <h2>***</h2> : ""}
							{place.rating === 4 ? <h2>****</h2> : ""}
							{place.rating === 5 ? <h2>*****</h2> : ""}
						</div>
						<p>{place.location}</p>
						<h5>{this.props.dateDeparture} - {this.props.dateReturn} •
							<span> ${place.price}/night</span>
						</h5>
						<h1>{'$' + this.state.priceToDisplay.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </h1>
						<UpPricing
							priceValue = {this.state.priceToDisplay + '00'}
							/>
						<button onClick={this.handleSubmit.bind(this)}>Continue</button>
					</div>
					<form>
						<div>
							<label>
								<input type="radio" id="standardRoom" name="room" value="standard" onClick={() => this.handleRadioBtn('Standard Room', 0)} />
								Standard Room
								<span> {this.getEstimatedExtraChargeStr(0)}</span>
							</label>
						</div>
						<div>
							<label>
								<input type="radio" id="premiumSuite" name="room" value="premium" onClick={() => this.handleRadioBtn('Premium Suite', 211)} />
								Premium Suite
								<span> {this.getEstimatedExtraChargeStr(211)}</span>
							</label>
						</div>
						<div>
							<label>
								<input type="radio" id="presidentSuite" name="room" value="president" onClick={() => this.handleRadioBtn('President Suite', 561)} />
								President Suite
								<span> {this.getEstimatedExtraChargeStr(561)}</span>
							</label>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

Details.propTypes = {
	dateDeparture: PropTypes.string,
	dateReturn: PropTypes.string,
	dateDiff: PropTypes.number,
	hotel: PropTypes.object,
	room: PropTypes.object
}

Details.defaultProps = {
	dateDeparture: "",
	dateReturn: "",
	dateDiff: 1,
	hotel: {},
	room: {}
}
export default Details;
