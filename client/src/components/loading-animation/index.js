import React from 'react';
import './index.css';

export default function LoadingAnimation() {
    return (
        <div className="lds-ellipsis loading-animation-rect">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}
