import React, { Component } from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';

import './Insurance.css';

class Insurance extends Component {

    constructor(props) {
        super(props);

        this.insurance = this.props.insurance;
    }

    componentDidMount() {
        $('#roomInsurance').on('click', () => this.handleCheckBox('Room Insurance', 10));
        $('#flightInsurance').on('click', () => this.handleCheckBox('Flight Insurance', 21));
        $('#travelerInsurance').on('click', () => this.handleCheckBox('Traveler Insurance', 42));
    }

    handleCheckBox(name, price) {
        for (let i in this.insurance) {
            if (this.insurance[i].types[0] === name) {
                this.insurance.splice(i, 1);
                this.props.updateInfo(this.insurance, this.getInsuranceTotalCharge());
                return ;
            }
        }
        let types = [name];
        this.insurance.push({ types, price });
        this.props.updateInfo(this.insurance, this.getInsuranceTotalCharge());

    }

    getInsuranceTotalCharge() {
        let totalCharge = 0;
        for (let ins of this.insurance) {
            totalCharge += ins.price;
        }
        return totalCharge;
    }

    render() {
        return (
            <div>
                <h3>Insurance</h3>
                <hr />
                <div className="checkbox-container-insurance">
                    <input type="checkbox" id="roomInsurance" />
                    <label htmlFor="roomInsurance">Room Insurance <span>+$10</span></label>
                </div>
                <div className="checkbox-container-insurance">
                    <input type="checkbox" id="flightInsurance" />
                    <label htmlFor="flightInsurance">Flight Insurance <span>+$21</span></label>
                </div>
                <div className="checkbox-container-insurance">
                    <input type="checkbox" id="travelerInsurance" />
                    <label htmlFor="travelerInsurance">Traveler Insurance <span>+$42</span></label>
                </div>
            </div>
        );
    }
}

Insurance.propTypes = {
    insurance: PropTypes.array,
    updateInfo: PropTypes.func
}

Insurance.defaultProps = {
    insurance: [{}],
    updateInfo: () => {}
}

export default Insurance;
