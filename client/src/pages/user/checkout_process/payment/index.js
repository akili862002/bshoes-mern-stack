import React, { useState, useRef } from 'react';
import './index.css';
import { useHistory } from 'react-router-dom';
import CheckoutProcessBar from '../conponents/checkout-process-bar';
import SuccessfulPurchase_img from '../../../../images/svg/successful_purchase.svg';

export default function PaymentInCheckoutProcess() {

    return (
        <div className="payment-in-checkout-process main">
            <CheckoutProcessBar currentStep={3} />

            <div className="line"></div>
        
            <div className="thank-you-user-container">
                <img src={SuccessfulPurchase_img} alt=""/>
                <h2>Thank you for payment. Have good day!</h2>
            </div>
            
        </div>
    );
}