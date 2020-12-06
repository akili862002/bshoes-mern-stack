import React, { useState } from 'react';
import Heart_icon from '../../../../images/img/heart_icon.png';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { load_wishlist_user } from '../../../../redux-handle/actions/user/load_data';
import Skeleton from 'react-loading-skeleton';

export default function MyWishlist_button({ wishlist }) {
    let dispatch = useDispatch();
    let loading = true;

    let numberProduct = 0;
    let data = []
    
    if (wishlist.products){
        numberProduct = wishlist.products.length;
        data = wishlist.data;

        if (wishlist.data.length === numberProduct) {
            loading = false;
        }
    }

    if (numberProduct !== data.length) {
        data = new Array(numberProduct)
                    .fill({
                        image_preview: null,
                        name: null,
                        cost: null,
                        id_product: null,
                        trademark: null,
                        cost: {
                            currentCost: null,
                            realCost: null
                        }
                    });
    }

    async function updateDataOfProductsInWishlist() {
        if (data.length !== numberProduct || loading) {
            // console.log('[WISHLIST] Loading data...')
            await load_wishlist_user(dispatch);
        }
    }

    return (
        <div className="button dropdown"
            onMouseEnter={updateDataOfProductsInWishlist}
        >

            <div className="static-button" >
                <img src={Heart_icon} className="icon"/>
                <h4>My Wishlist</h4>
                { numberProduct > 0 && (<span className="dot"><p>{numberProduct}</p></span>) }
            </div>

            <div className="dropdown-list wishlist-drop-list">

                {
                    data.map( (product, i) => 
                        <Product_item 
                            key={"product-item-in-wishlist-" + i}
                            product={product}
                            isFinalItemInData = { (i == data.length - 1) }
                        />
                    )
                }

                {numberProduct == 0 && <EmptyAlert/>}

            </div>

        </div>
    );
}

function Product_item({ product, isFinalItemInData }) {
    let [isImageLoaded, setIsImageLoaded] = useState(false);
    let { images, name, cost, id_product, trademark } = product;
    let { currentCost, realCost } = cost;

    let image_url = "";
    if (images)
        image_url = images.smallSize[0].url.replace("URL:", "");
    return (
        <Link to={'/products/product-detail/' + id_product} >
            <div className="show-product-item" >
                <div className="image">
                    <img
                        src={image_url} 
                        onLoad={() => setIsImageLoaded(true)}
                    />
                    {!isImageLoaded && <Skeleton height="80px" width="80px"/>}
                </div>
                <div className="texts">
                    <div className="name">{name || <Skeleton />}</div>
                    <div className="trademark">{trademark || <Skeleton />}</div>
                    <div className="cost with-discount" style={{display: currentCost ? "flex" : "block"}}>
                        <p className="current-cost">{currentCost ? '$' + currentCost : <Skeleton height={14}/>}</p>
                        { realCost && (<p className="real-cost">{'$' + realCost}</p>) }
                    </div>
                </div>
            </div>
            { !isFinalItemInData && <Divided_line width="100%" margin="0"/> }
        </Link>
    );
}

function Divided_line({ width, margin }) {
    let style = {
        width: width,
        height: "0.5px",
        background: "rgb(225, 225, 225)",
        margin: margin
    }

    return <div className="line-divide" style={style}></div>;
}

function EmptyAlert() {
    return (
        <div className="empty-alert">
            <h3>Your wishlist is empty</h3>
            <Link to="/"><h5>Go to shopping</h5></Link>
        </div>
    );
}