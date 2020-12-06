import React, { useState } from 'react';
import './index.css';
import EmptyStar_icon from '../../images/svg/strokeStar.svg';
import FillStar_icon from '../../images/svg/fillStart.svg';

export default function StarSeletor({ setStarSelect, starSelect, height }) {
    let [currentStarHover, setCurrentStarHover] = useState(-1);
    let typeOfEachStar = new Array(5).fill(false);
    // true means this item is fill star
    // false means this item is empty star
    typeOfEachStar = typeOfEachStar.map((type, i) => 
        i <= currentStarHover ? true : false
    )

    function mouseLeaveHandler() {
        // starSelect in [1 --> 5]
        if (starSelect <= 0) {
            setCurrentStarHover(-1);
        } else if (currentStarHover !== starSelect -1) {
            setCurrentStarHover(starSelect - 1);
        }
    }
    
    return (
        <div className="star-selector" onMouseLeave={mouseLeaveHandler}>
            {
                typeOfEachStar.map((isFillStar, i) => 
                    <img 
                        key={'start-img-k-i-' + i}
                        src={isFillStar ?  FillStar_icon : EmptyStar_icon} 
                        style={{height}}
                        onMouseEnter={() => setCurrentStarHover(i)}
                        onClick={() => setStarSelect(i + 1)}
                    />
                )
            }
        </div>
    );
}