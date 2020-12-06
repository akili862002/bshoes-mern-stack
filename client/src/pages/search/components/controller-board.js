import React from 'react';
import RateStar from '../../../components/rate-star';
import { CONST_FILTER_TARGET as CONST } from '../consts';

import Boots_icon from '../../../images/img/boots.png';
import Sneakers_icon from '../../../images/img/sneakers.png';
import Sport_icon from '../../../images/img/sport.png';
import CheckBox_Empty_icon from '../../../images/img/checkbox-empty.png';
import CheckBox_Checked_icon from '../../../images/img/checkbox-checked.png';

export default function Controller_Board({ filter_target, switchFilterTarget }) {

    function classOfItem(target) {
        if (filter_target[target])
            return "item select";
        return "item";
    }

    function CheckBox({ target }) {
        return (
            <div className="check-box item" onClick={() => switchFilterTarget(target)}>
                <img 
                    src={filter_target[target] ? CheckBox_Checked_icon : CheckBox_Empty_icon} 
                    className="checkbox icon"
                />
                <div className="name">{target}</div>
            </div>
        );
    }

    return (
        <div className="controller-board">
            <div className="box-title black-bg-theme">Shoes</div>
            <div className="box-title grey-bg-theme">Filter By</div>

            <div className="selection-box rate">
                <div className="small-title">Rate</div>
                <div className="items">

                    <div className={'rate-star-select ' + classOfItem(CONST.FIVE_STARS)}
                        onClick={() => switchFilterTarget(CONST.FIVE_STARS)}
                    >
                        <RateStar numberStar={5} sizeEachStar={16} />
                        <div className="name">{'& up'}</div>
                    </div>

                    <div className={'rate-star-select ' + classOfItem(CONST.FOUR_STARS)}
                        onClick={() => switchFilterTarget(CONST.FOUR_STARS)}
                    >
                        <RateStar numberStar={4} sizeEachStar={16} />
                        <div className="name">{'& up'}</div>
                    </div>

                    <div className={'rate-star-select ' + classOfItem(CONST.THREE_STARS)}
                        onClick={() => switchFilterTarget(CONST.THREE_STARS)}
                    >
                        <RateStar numberStar={3} sizeEachStar={16} />
                        <div className="name">{'& up'}</div>
                    </div>
                    
                </div>
            </div>

            <div className="line" />

            <div className="selection-box _type-shoes">
                <div className="small-title">Type Shoes</div>
                <div className="items">
                    <div className={classOfItem(CONST.BOOTS)}
                        onClick={() => switchFilterTarget(CONST.BOOTS)}
                    >
                        <img src={Boots_icon} className="icon shoes-img"/>
                        <div className="name">Boots</div>
                    </div>
                    <div className={classOfItem(CONST.SNEAKERS)}
                        onClick={() => switchFilterTarget(CONST.SNEAKERS)}
                    >
                        <img src={Sneakers_icon} className="icon shoes-img"/>
                        <div className="name">Sneakers</div>
                    </div>
                    <div className={classOfItem(CONST.SPORT)}
                        onClick={() => switchFilterTarget(CONST.SPORT)}
                    >
                        <img src={Sport_icon} className="icon shoes-img"/>
                        <div className="name">Sport</div>
                    </div>
                </div>
            </div>

            <div className="line" />

            <div className="selection-box _color">
                <div className="small-title">Color</div>
                <div className="items">
                    <div className={classOfItem(CONST.GREY)}
                        onClick={() => switchFilterTarget(CONST.GREY)}
                    >
                        <div className="color-box _grey"></div>
                        <div className="name">Grey</div>
                    </div>
                    <div className={classOfItem(CONST.WHITE)}
                        onClick={() => switchFilterTarget(CONST.WHITE)}
                    >
                        <div className="color-box _white"></div>
                        <div className="name">White</div>
                    </div>
                    <div className={classOfItem(CONST.BLACK)}
                        onClick={() => switchFilterTarget(CONST.BLACK)}
                    >
                        <div className="color-box _black"></div>
                        <div className="name">Black</div>
                    </div>
                </div>
            </div>

            <div className="line" />

            <div className="selection-box _price">
                <div className="small-title">Price</div>
                <div className="items">
                    <CheckBox target = {CONST.PRICE_UNDER_100} />
                    <CheckBox target = {CONST.PRICE_FROM_100_TO_200} />
                    <CheckBox target = {CONST.PRICE_FROM_200_TO_400} />
                    <CheckBox target = {CONST.PRICE_FROM_400_TO_800} />
                    <CheckBox target = {CONST.PRICE_FROM_800_TO_1000} />
                    <CheckBox target = {CONST.PRICE_ABOVE_1000} />
                </div>
            </div>
        </div>
    );
}