import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Places.css';

import UpPricing from '../uplift-components/UpPricing'
import { updateUpNodes } from '../uplift-components/upLiftTools'

class Places extends Component {

	constructor(props) {
		super(props);

		this.UpLift;
	}

	handleClick(place) {
		this.props.placeSelected(place);
	}

	getFormattedPrice(price) {
		return '$' + price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	}

	componentDidMount() {
		updateUpNodes()
	}

	render() {
		let places = this.props.places;

		return (
			<div className="places">
				{places.length === 0 ?
					<div>
						No hotels found.
					</div> :
					<div>
						{places.map((place, i) =>
							<div key={i} className="place-container">
								<img src="http://via.placeholder.com/200x200/eee" alt="" />
								<div>
									<h3>{place.name}</h3>
									<p>{place.location}</p>
									{place.rating === 1 ? <h2>*</h2> : ""}
									{place.rating === 2 ? <h2>**</h2> : ""}
									{place.rating === 3 ? <h2>***</h2> : ""}
									{place.rating === 4 ? <h2>****</h2> : ""}
									{place.rating === 5 ? <h2>*****</h2> : ""}
									<h5>{this.getFormattedPrice(place.price)}/night</h5>
									<h1>{this.getFormattedPrice(place.totalPrice)}</h1>
									<UpPricing
										priceValue = {place.totalPrice + '00'}
										priceType = 'departure_option'
										priceModel = 'total'
										comparisonType = 'preferred_selection'
										taxesIncluded = 'true'
										/>
								</div>
								<button onClick={() => this.handleClick(place)}>Select</button>
							</div>
						)}
					</div>
				}
			</div>
		);
	}
}

Places.propTypes = {
	places: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string,
		location: PropTypes.string,
		rating: PropTypes.number,
		price: PropTypes.number,
		totalPrice: PropTypes.number,
		room: PropTypes.string,
		roomExtraCharge: PropTypes.number
	})),
	dateDeparture: PropTypes.string,
	dateReturn: PropTypes.string
}

Places.defaultProps = {
	places: [],
	dateDeparture: '',
	dateReturn: ''
}

export default Places;
