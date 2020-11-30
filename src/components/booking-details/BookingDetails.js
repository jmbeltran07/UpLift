import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './BookingDetails.css';

import UpPricing from '../uplift-components/UpPricing'
import { updateUpNodes } from '../uplift-components/upLiftTools'

class BookingDetails extends Component {

	constructor(props) {
		super(props);

		this.hotelPrice = this.props.hotel.price * this.props.dateDiff + this.props.room.roomExtraCharge;
		this.insurance = this.props.insuranceTotalCharge;
		this.totalPrice = this.hotelPrice + this.insurance;

        this.state = { update: false };
	}

    componentDidUpdate(prevProps) {
        if (prevProps.insuranceTotalCharge !== this.props.insuranceTotalCharge) {
            this.insurance = this.props.insuranceTotalCharge;
            this.totalPrice = this.hotelPrice + this.insurance;
			this.setState({ update: !this.state.update }, () => {
				updateUpNodes()
			});
        } 
	}

	getFormattedPrice(price) {
		return '$' + price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	}

	render() {
		return (
			<div className="booking">
				<h4>Itinerary</h4>
				<hr />
				<br />
				<h3>{this.props.hotel.name}</h3>
				<br />
				{this.props.hotel.rating === 1 ? <h2>*</h2> : ""}
				{this.props.hotel.rating === 2 ? <h2>**</h2> : ""}
				{this.props.hotel.rating === 3 ? <h2>***</h2> : ""}
				{this.props.hotel.rating === 4 ? <h2>****</h2> : ""}
				{this.props.hotel.rating === 5 ? <h2>*****</h2> : ""}
				<br />
				<p>{this.props.hotel.location}</p>
				<br />
				<h5>
					{this.props.dateDiff} night(s) • {this.props.numOfTravelers} Traveler(s)
				</h5>
				<br />
				<h4>{this.props.dateDeparture} - {this.props.dateReturn}</h4>
				<br />
				<h5>
					{this.props.room.name}
				</h5>
				<br />
				<h4>Total</h4>
				<hr />
				<div>
					<h4>Hotel</h4>
					<h4>{this.getFormattedPrice(this.hotelPrice)}</h4>
				</div>
				<div>
					<h4>Insurance</h4>
					<h4>{this.getFormattedPrice(this.insurance)}</h4>
				</div>
				<br />
				<div>
					<h3 style={{color: 'black'}}>Total</h3>
					<h3 style={{color: 'black', textAlign: 'right'}}>
						{this.getFormattedPrice(this.totalPrice)}
						{!this.props.hideUpNodes && <UpPricing
							priceValue = {this.totalPrice + '00'}
						/>}
					</h3>
				</div>
				<br />
			</div>
		);
	}
}

BookingDetails.propTypes = {
	numOfTravelers: PropTypes.number,
	hotel: PropTypes.object,
	room: PropTypes.object,
	dateDeparture: PropTypes.string,
	dateReturn: PropTypes.string,
	dateDiff: PropTypes.number,
	insuranceTotalCharge: PropTypes.number
};

BookingDetails.defaultProps = {
	sendTraveler: () => {},
	sendContactInfo: () => {},
	sendPaymentInfo: () => {},
	numOfTravelers: 1,
	hotel: {},
	room: {},
	dateDeparture: '',
	dateReturn: '',
	dateDiff: 1,
	insuranceTotalCharge: 0
};

export default BookingDetails;
