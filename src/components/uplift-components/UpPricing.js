import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './UpLift.css';

class UpPricing extends Component {

  render() {

    return (
      <span className="upPriceNode"
        style={{ display: "none" }}
        data-up-price-value={this.props.priceValue}
        data-up-price-type={this.props.priceType}
        data-up-price-model={this.props.priceModel}
        data-up-comparison-type={this.props.comparisonType}
        data-up-taxes-included={this.props.taxesIncluded}
      >
        or from
        <span className={`upPrice ${this.props.selectorPrice ? 'price': ''}`}>
          $
          <span data-up-from-currency-unit-major=""></span>/mo
          <span data-up-tooltip="">
            <svg className="svg-info-icon" width="13px" height="13px" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg"><g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g transform="translate(-374.000000, -430.000000)" fill="#7C8594"><g transform="translate(220.000000, 50.000000)"><g transform="translate(67.000000, 135.000000)"><g transform="translate(87.000000, 245.000000)"><path d="M6.00000018,1.2096774 C8.63070795,1.2096774 10.790323,3.34037305 10.790323,6.00000018 C10.790323,8.64556682 8.64776239,10.790323 6.00000018,10.790323 C3.35547587,10.790323 1.2096774,8.6488269 1.2096774,6.00000018 C1.2096774,3.35638515 3.35206055,1.2096774 6.00000018,1.2096774 L6.00000018,1.2096774 Z M6,0.5 C2.96264718,0.5 0.5,2.96353427 0.5,6 C0.5,9.03823992 2.96264718,11.5 6,11.5 C9.03735282,11.5 11.5,9.03823992 11.5,6 C11.5,2.96353427 9.03735282,0.5 6,0.5 Z M5.20161298,8.12903243 L5.46774203,8.12903243 L5.46774203,5.46774215 L5.20161298,5.46774215 C5.05464321,5.46774215 4.93548393,5.34858288 4.93548393,5.20161313 L4.93548393,5.02419377 C4.93548393,4.87722402 5.05464321,4.75806475 5.20161298,4.75806475 L6.26612917,4.75806475 C6.41309893,4.75806475 6.53225821,4.87722402 6.53225821,5.02419377 L6.53225821,8.12903243 L6.79838726,8.12903243 C6.94535703,8.12903243 7.06451631,8.2481917 7.06451631,8.39516145 L7.06451631,8.5725808 C7.06451631,8.71955056 6.94535703,8.83870983 6.79838726,8.83870983 L5.20161298,8.83870983 C5.05464321,8.83870983 4.93548393,8.71955056 4.93548393,8.5725808 L4.93548393,8.39516145 C4.93548393,8.2481917 5.05464321,8.12903243 5.20161298,8.12903243 Z M6.00000018,2.80645156 C5.60805866,2.80645156 5.29032278,3.12418744 5.29032278,3.51612896 C5.29032278,3.90807048 5.60805866,4.22580636 6.00000018,4.22580636 C6.3919417,4.22580636 6.70967758,3.90807048 6.70967758,3.51612896 C6.70967758,3.12418744 6.3919417,2.80645156 6.00000018,2.80645156 Z"></path></g></g></g></g></g></svg>
          </span>
        </span>
      </span>
    )
  }
}

UpPricing.propTypes = {
  priceValue: PropTypes.string,
  priceType: PropTypes.string,
  priceModel: PropTypes.string,
  comparisonType: PropTypes.string,
  taxesIncluded: PropTypes.string,
}

UpPricing.defaultProps = {
  priceValue: '000',
  priceType: 'departure_option',
  priceModel: 'total',
  comparisonType: 'preferred_selection',
  taxesIncluded: 'true',
}

export default UpPricing;
