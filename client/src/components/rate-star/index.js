import React from 'react';
import "./index.css";

import EmptyStar_icon from '../../images/img/empty-star.png';
import FullStar_icon from '../../images/img/full-star.png';
import HalfStar_icon from '../../images/img/half-star.png';

function INT(num) {
	// num = num_int + num_float
	// 0.3 <= num_float <= 0.75 --> num = num_int + 0.5
	// 0.75 => num = num_int + 1
    let num_int = Number.parseInt(num);
    let num_float = num - num_int;

    if (0.3 <= num_float && num_float <= 0.75)
    	return num_int + 0.5;
    if (num_float >= 0.75)
    	return num_int + 1;
    return num_int;
}

export default function RateStar({ numberStar, sizeEachStar, ...rest}) {
    
    let count = INT(numberStar);

    let listStar = new Array(5).fill(EmptyStar_icon);

    for (let i = 0; i < 5; i++) {
        if (count > 0) {
            if (count >= 1) 
                listStar[i] = FullStar_icon;
            else 
                listStar[i] = HalfStar_icon;
        }

        count -= 1;
    }

    let Class = "rate-stars-line ";
    if (rest.className) {
        Class += rest.className; 
        delete rest.className;
    }

    return (
        <div className={Class} style={{ height: sizeEachStar }} {...rest}>
            {
                listStar.map( (star_icon, i) => {
                    return (
                        <img 
                            src={star_icon} 
                            key={"star-" + i}
                            style={{
                                height: sizeEachStar,
                                width: sizeEachStar
                            }}
                        />
                    );
                })
            }
        </div>  
    );
}