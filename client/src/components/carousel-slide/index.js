import React, { useEffect } from 'react';
import "./index.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import Image_skeleton from '../../images/img/image_skeleton.jpg';
import LoadingAnimation from '../../components/loading-animation';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

let Carousel_option = {
    autoPlay: true,
    stopOnHover: true,
    showIndicators: true,
    infiniteLoop: true,
    interval: 6000,
    swiping: true,
    showStatus: false,
    showThumbs: false,
    centerMode: false
}

export default function BiggestCarouselSlide() {
    /* Data structure  --- =>>
    data = [
        {
            image_url: <Base64 string data encode>,
            tagName: String,
            title:   String,
            button: {
                name: String,
                link: String
            }
        },
        ...
    ]
    */

    // Set inital data with loading animation
    let [data, setData] = useState([]);
    let [isDataLoaded, setIsDataLoaded] = useState(false);
    let widthOfSlide = window.innerWidth > 1350 ? 1340 : window.innerWidth - 10;
 
   // get data from server
    useEffect(() => {
        axios.get('/api/public/carousel-slide-images')
            .then((res) => {
                setData(res.data);
                setIsDataLoaded(true);
                // console.log("Loaded carousel data...")
            })
            .catch((err) => {
                console.error(err);
            })
    }, []);
    
    return (
        <div className="biggest-carousel-slide">
            {
                !isDataLoaded && (
                    <div className="img-loading-skeleton">
                        <img src={Image_skeleton}/>
                        <LoadingAnimation />
                    </div>
                )
            }
            <Carousel {...Carousel_option}>
                {
                    data.map((item, i) => 
                        <Slide 
                            key={"item-slide-i-" + i}
                            item={item}
                            i={i}
                            widthOfSlide={widthOfSlide}
                        />
                    )
                }
            </Carousel>
        </div>
    );
}

function Slide({ item, i, widthOfSlide }) {
    let {tagName, title, button, image_url} = item;
    image_url = image_url.replace("URL:", "");
    let [imageStyle, setImageStyle] = useState({
        width: "100%",
        height: widthOfSlide * 700 / 1350 + "px"
    })

    return (
        <div key={'content-of-carousel-' + tagName}>
            <LazyLoadImage 
                effect="blur"
                src={image_url}
                alt={title}
                key={tagName}
                width= {imageStyle.width}
                height={imageStyle.height}
                beforeLoad={() => {
                    imageStyle.height = "100%";
                    setImageStyle({...imageStyle})
                }}
            />

            <div className="infor">
                <h5 className="tag-name">{tagName}</h5>
                <h2 className="title">{title}</h2>
                <Link to={button.link}><button>{button.name}</button></Link>
            </div>
        </div>
    );
}