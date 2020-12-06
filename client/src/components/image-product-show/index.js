import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import './index.css';
import Image_skeleton from '../../images/img/slick-slide-img-skeleton.jpg';
import Shoes_loading_icon from '../../images/img/shoes_loading_icon.png';
import LoadingAnimation from '../../components/loading-animation';


export default function ImageProductShow({ children, width, isShowLoadingAnimation = false }) {
    let Carousel_option = {
        width: width,
        showThumbs: true,
        showStatus: false,
        showIndicators: false,
        infiniteLoop: true
    }
    
    return (
        <div className="image-product-show">
            {
                (children.length == 0 || isShowLoadingAnimation) && 
                    (
                        <div className="skeleton-img">
                            <img src={Image_skeleton}/>
                            <img src={Shoes_loading_icon} className="shoes-loading-animation"/>
                        </div>
                    )
            }
            <Carousel {...Carousel_option}>
                {children}
            </Carousel>
        </div>
    );
}