import React from 'react';
import './index.css';
// import images -----
import User_icon from '../../../../../images/svg/white_user.svg';
import Location_icon from '../../../../../images/svg/location.svg';
import Payment_icon from '../../../../../images/svg/payment.svg';

export default function CheckoutProcessBar({ currentStep }) {
    let steps = [
        {
            name: "Login",
            icon: User_icon
        },
        {
            name: "Address",
            icon: Location_icon
        },
        {
            name: "Payment",
            icon: Payment_icon
        }
    ];

    let spacePersent = 100/(steps.length - 1);

    return (
        <div className="checkout-process-bar">
            <div className="lines-process">
                {
                    steps.map((step, i) => {
                        let Class = "line-connect";
                        i += 1;
                        if ( i < currentStep || currentStep === steps.length)
                            Class += " active";

                        if ( i !== steps.length -1 )
                            return (
                                <div className={Class} key={'ln-br-' + i}/>
                            );
                    })
                }

                <div className="steps">
                    {
                        steps.map((step, i) => {
                            let ClassOfEachStep = 'step';
                            let styleOfEachStep = {
                                left: '',
                                transform: 'translateX(-50%)'
                            }

                            styleOfEachStep.left = i * spacePersent + '%';

                            i += 1; // Now we will use 1/2/3 step instead of 0/1/2
                            if (i === currentStep) {
                                ClassOfEachStep += ' selector';
                                styleOfEachStep.transform += ' scale(1.2)';
                            }

                            if (i <= currentStep) {
                                ClassOfEachStep += ' active';
                                styleOfEachStep.background = '#F37990';
                            }

                            return (
                                <div className={ClassOfEachStep} 
                                    key={'step-checkout-' + i}
                                    style={styleOfEachStep}
                                >
                                    <img src={step.icon} className="icon"/>
                                    <h3>{step.name}</h3>
                                </div>
                            );
                        })
                    }
                </div>

            </div>
        </div>
    );
}