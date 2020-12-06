import React from 'react';
import "./index.css";

export default function LoadingPageAnimation({ isLoading }) {
    let status = "";
    if (!isLoading) {
        status = "hide";
    }

    return (
        <div className={"container-loading-page " + status}>
            <div className="container-loader">
                <svg height={100} width={100}>
                    <animate xlinkHref="#ds-point-one" attributeName="fill" repeatCount="indefinite" values="#fff; #000; #000;" dur="2s" begin="0s" keyTimes="0; .5; 1" />
                    <animate xlinkHref="#ds-point-two" attributeName="fill" repeatCount="indefinite" values="#fff; #000; #000;" dur="2s" begin="0.4s" keyTimes="0; .5; 1" />
                    <animate xlinkHref="#ds-point-three" attributeName="fill" repeatCount="indefinite" values="#fff; #000; #000;" dur="2s" begin="0.8s" keyTimes="0; .5; 1" />
                    <animate xlinkHref="#ds-point-four" attributeName="fill" repeatCount="indefinite" values="#fff; #000; #000;" dur="2s" begin="1.2s" keyTimes="0; .5; 1" />
                    <animate xlinkHref="#ds-point-five" attributeName="fill" repeatCount="indefinite" values="#fff; #000; #000;" dur="2s" begin="1.6s" keyTimes="0; .5; 1" />
                    <polygon id="ds-point-one" points="50,0 35,30 50,50 65,30" style={{fill: 'black'}} />
                    <polygon id="ds-point-two" points="50,0 35,30 50,50 65,30" style={{fill: 'black'}} transform="rotate(73 50 50)" />
                    <polygon id="ds-point-three" points="50,0 35,30 50,50 65,30" style={{fill: 'black'}} transform="rotate(145 50 50)" />
                    <polygon id="ds-point-four" points="50,0 35,30 50,50 65,30" style={{fill: 'black'}} transform="rotate(-145 50 50)" />
                    <polygon id="ds-point-five" points="50,0 35,30 50,50 65,30" style={{fill: 'black'}} transform="rotate(-73 50 50)" />
                </svg>
                <p>Please Wait...</p>
            </div>
        </div>
    );
}