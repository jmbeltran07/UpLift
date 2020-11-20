import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './HeaderNavigation.css';

class HeaderNavigation extends Component {

	render() {
		let pageNum = this.props.pageNum;

		return (
			<div>
				<div className="navigation-logo">
					<h2 style={{color: '#00838F'}}>Quest<span style={{color: "#BDBDBD"}}>Air</span></h2>
				</div>
				<div className="navigation-links">
					<Link className="navigation-link" to="/">Select dates and hotel</Link>
					{pageNum > 0 ?
						<div>
							<i className="fa fa-long-arrow-right"></i>
							<Link className="navigation-link" to="/details">Select room</Link>
						</div> : ""
					}
					{pageNum > 1 ?
						<div>
							<i className="fa fa-long-arrow-right"></i>
							<Link className="navigation-link" to="/payment">Traveler and Payment information</Link>
						</div> : ""
					}
					{pageNum > 2 ?
						<div>
							<i className="fa fa-long-arrow-right"></i>
							<Link className="navigation-link" to="/confirmation">Confirmation</Link>
						</div> : ""
					}
				</div>
			</div>
		);
	}
}

HeaderNavigation.propTypes = {
	pageNum: PropTypes.number,
};

HeaderNavigation.defaultProps = {
	pageNum: 0
};

export default HeaderNavigation;
