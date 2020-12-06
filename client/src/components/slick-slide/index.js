import React, { useRef, useState, useEffect } from 'react';
import "./index.css";

import Next_icon from '../../images/svg/next.svg';

export default function SlickSlide({ children }) {
    if (children.length == 2) {
        if (children[1] !== null)
            children = [...children[0], children[1]];
        else {
            children = children[0];
        }
    }

    let [widthScreen, setWidthScreen] = useState(window.innerWidth); 
    let widthMain = widthScreen;
    if (widthMain >= 1320) {  // Max of width main is 1320px
        widthMain = 1320;
    }
    useEffect(() => { // This is to update widthScreen every time we resize window
        window.addEventListener('resize' ,() => setWidthScreen(window.innerWidth));
    }, []);

    let lengthOfCards = children.length;
    let listSlide_ref = useRef();
    let [currentSlidePosition, setCurrentSlidePosition] = useState({ 
        start: 0, 
        end: lengthOfCards,
        isHeadOfSlide: true,
        isTailOfSlide: false
    });

    let [currentPosX, setCurrentPosX] = useState(0);
    useEffect(() => {
        setCurrentPosX(0);
        setCurrentSlidePosition({
            start:0,
            end: 0,
            isHeadOfSlide: true,
            isTailOfSlide: false
        });
    }, [widthMain]);
    
    // 16.3 is width of scroll, so we need to decrease it to fit with screen
    let widthSlick = widthMain - 8;

    // Constructor of Slick-slide, and variables
    //                         |                       |    |
    //      +-------------+    |    +-------------+    |    +------    
    //      |             |    |    |             |    |    |
    //      |             |    |    |             |    |    |
    //      |    item     |    |    |    item     |    |    |
    //      |             |    |    |             |    |    |
    //      |             |    |    |             |    |    |
    //      +-------------+    |    +-------------+    |    +---------
    //                         |<--> margin_item       |
    //                         |    <----width---->    |    
    //                         |<------totalWidth----->|

    let item = {
        width: 200,
        margin: -999,
        minMargin: 5,
        totalWidth: 0
    }

    let slide_option = {
        numberItemShow: 5,
        numberSlideScroll: 2,
        speed: "0.7s ease"
    }


    // before calculate margin of each item, 
    // we need to check that is current margin <= min-margin or not
    // if not, we don't anything, current margin is ok
    // else we decrease number of item to feed with screen
    while ( item.margin < item.minMargin && slide_option.numberItemShow >= 1) {
        let n = slide_option.numberItemShow;
        // we calculate margin of each item
        // widthSlick = numberItem * ( widthItem + 2 * margin_item )
        item.margin = (widthSlick - item.width*n ) / (2 * n);

        if (item.margin < item.minMargin) {
            slide_option.numberItemShow --;
        }
    }

    // now we have to update total width of item
    item.totalWidth = item.width + 2 * item.margin;

    // we need to update current position of list slide is showing
    // but, just update when it is first time
    // mean that current fist slide position is head of list
    if (currentSlidePosition.start === 0) {
        currentSlidePosition.end = slide_option.numberItemShow
    }


    function nextSlide() {
        let { start, end } = currentSlidePosition;
        let numberSlideScroll = slide_option.numberSlideScroll
        let numberSlideIsShowing = end - start;

        if (numberSlideScroll > numberSlideIsShowing) {
            numberSlideScroll = numberSlideIsShowing;
        }

        // if we click this button, make sure 
        // that end position of list slide won't be out of length
        if (currentSlidePosition.end + numberSlideScroll > lengthOfCards - 1 ) {
            numberSlideScroll = lengthOfCards - end;
        }

        let distanceScroll = numberSlideScroll * item.totalWidth;
        // Scroll it by update new distance for ul component 
        
        
        listSlide_ref.current.style.left = currentPosX;
        
        // Finally, update currentSlidePosition
        start += numberSlideScroll;
        end += numberSlideScroll;
        setCurrentPosX(currentPosX - distanceScroll);
        setCurrentSlidePosition({
            start,
            end,
            isHeadOfSlide: currentSlidePosition.isHeadOfSlide,
            isTailOfSlide: currentSlidePosition.isTailOfSlide
        });
    }

    function prevSlide() {
        let { start, end } = currentSlidePosition;
        let numberSlideScroll = slide_option.numberSlideScroll
        let numberSlideIsShowing = end - start;

        // we should decrease number slide scroll when it 
        // greater number slide is showing in list
        if (numberSlideScroll > numberSlideIsShowing) {
            numberSlideScroll = numberSlideIsShowing;
        } 

        // if we click this button, make sure 
        // that end position of list slide won't be out of length
        if (currentSlidePosition.start - numberSlideScroll < 0) {
            numberSlideScroll = start;
        }

        let distanceScroll = numberSlideScroll * item.totalWidth;
        // Scroll it by update new distance for ul component 
        setCurrentPosX(currentPosX + distanceScroll);
        
        listSlide_ref.current.style.left = currentPosX;

        // Finally, update currentSlidePosition
        start -= numberSlideScroll;
        end -= numberSlideScroll;
        setCurrentSlidePosition({
            start,
            end,
            isHeadOfSlide: currentSlidePosition.isHeadOfSlide,
            isTailOfSlide: currentSlidePosition.isTailOfSlide
        });
    }

    function updateStatusOfSlides() {
        currentSlidePosition.isHeadOfSlide = false;
        currentSlidePosition.isTailOfSlide = false;

        if (currentSlidePosition.start === 0)
            currentSlidePosition.isHeadOfSlide = true;

        if (currentSlidePosition.end >= lengthOfCards)
            currentSlidePosition.isTailOfSlide = true;
    }
    updateStatusOfSlides();

    let nextArrowClass = currentSlidePosition.isTailOfSlide ? "hide" : "";
    let prevArrowClass = currentSlidePosition.isHeadOfSlide ? "hide" : "";

    return (
        <div 
            className="slick-slide" 
            style={{ width:  widthSlick}} 
            key={"slick-slider"}
        >
            <ul 
                ref={listSlide_ref} 
                style={{ left: currentPosX, transition: slide_option.speed }}
                key={"slick-slide-ul"}
            >
                {
                    children.map((child, i) => {
                        let ClassName = "slide slide-" + i;
                        ClassName += child.key === "see-more-btn" ? " see-more-btn" : "";
                        return (
                            <li 
                                className={ClassName}
                                key={'slide-child-' + i}
                                style={{ margin: `0 ${item.margin}px` }}
                            >
                                {child}
                            </li>
                        );
                    })
                }
            </ul>

            <div className={"next-slide control-slide " + nextArrowClass} onClick={nextSlide}>
                <img src={Next_icon} />
            </div>
            <div className={"prev-slide control-slide " + prevArrowClass} onClick={prevSlide}>
                <img src={Next_icon} style={ {transform: "rotate(180deg)"} }/>
            </div>
        </div>
    );
}