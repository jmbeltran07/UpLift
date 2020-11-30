import React, { Component } from 'react';
import PropTypes from 'prop-types';

import UpPricing from '../uplift-components/UpPricing'
import './UpLift.css';


function selectPayMonthly() {
  window.Uplift.Payments.select();
}

function deselectPayMonthly(paymentMethod) {
  window.Uplift.Payments.deselect(paymentMethod);
}

class UpCheckout extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedPaymentMethod: "fullpayment",
      upLiftState: this.props.upLiftState
    };

    this.paymentMethodOnChange = this.paymentMethodOnChange.bind(this)
  }

  paymentMethodOnChange(event) {
    this.setState({
      selectedPaymentMethod: event.target.id,
    }, () => {
      if (this.state.selectedPaymentMethod === 'monthlypayment') {
        this.props.sendEnabledSelector("monthlypayment")
        selectPayMonthly()
      } else {
        this.props.sendEnabledSelector("fullpayment")
        deselectPayMonthly("fullpayment")
      }
    })
  }

  render() {
    return (
      <div>
        <div className="selectors-container" style={{ display: `${this.props.upLiftState === 'SERVICE_UNAVAILABLE' ? 'none' : 'block'}` }}>
          <ul className="row" style={{ padding: "0px" }}>
            <div className={`col-md-6 selector ${this.state.selectedPaymentMethod === 'fullpayment' ? "selected" : ""}`}>
              <li className="col-md-6" style={{ listStyle: "none", width: "100%"}}>
                <label htmlFor="fullpayment">
                  <div className="radio">
                    <input type="radio" defaultChecked name="paymentType" id="fullpayment" onChange={this.paymentMethodOnChange} />
                    <span className="radio-label">Pay in full</span>
                  </div>
                  <div className="price">
                    <span className="price_fullpayment">
                      $
                                <span data-price-full="true">
                        {this.props.priceValue}
                      </span>
                                  USD
                              </span>
                  </div>
                </label>
              </li>
            </div>
            <div className={`col-md-6 selector ${this.state.selectedPaymentMethod === 'monthlypayment' ? "selected" : ""}`}>
              <li className="col-md-6" style={{ listStyle: "none", width: "100%"}}>
                <label htmlFor="monthlypayment">
                  <div className="radio">
                    <input type="radio" name="paymentType" id="monthlypayment" onChange={this.paymentMethodOnChange} disabled={this.state.upLiftState === "OFFER_UNAVAILABLE"} />
                    <span className="radio-label" style={{ color: "#4C5B6D" }}>Pay Monthly</span>
                  </div>
                  <img alt="UpLift logo" className="upLift-button-image" src="https://ovago.com/images/uplift.svg" />
                  <div className="price">
                    {this.state.upLiftState === "OFFER_AVAILABLE" && <UpPricing
                      priceValue={this.props.priceValue + '00'}
                      priceType="total"
                      priceModel="total"
                      taxesIncluded="true"
                      selectorPrice = {true}
                    />}
                  </div>

                  <div data-up-error="" style={{ display: this.state.upLiftState === "OFFER_UNAVAILABLE" ? "block" : "none" }}>
                    NOT AVAILABLE
                    <span data-up-tooltip="" />
                  </div>
                </label>
              </li>
            </div>
          </ul>
        </div>
        <div>
          {this.state.selectedPaymentMethod === "fullpayment" && this.props.children}
        </div>
        <div>
          {<div id="up-pay-monthly-container" src="" style={{ display: this.state.selectedPaymentMethod === "monthlypayment" ? "block" : "none" }} />}
        </div>
      </div>
    )
  }
}

UpCheckout.propTypes = {
  priceValue: PropTypes.string,
  priceType: PropTypes.string,
  priceModel: PropTypes.string,
  comparisonType: PropTypes.string,
  taxesIncluded: PropTypes.string,
}

UpCheckout.defaultProps = {
  priceValue: '000',
  priceType: 'departure_option',
  priceModel: 'total',
  comparisonType: 'preferred_selection',
  taxesIncluded: 'true',
}

export default UpCheckout;
