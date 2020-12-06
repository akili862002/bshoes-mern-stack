import React from 'react';
import Cart_icon from '../../../../images/img/cart.png';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { load_cart_user } from '../../../../redux-handle/actions/user/load_data';
import Skeleton from 'react-loading-skeleton';
import { useState } from 'react';

export default function MyCart_button({ cart, isAuthenticated }) {
    let dispatch = useDispatch();
    let history = useHistory();

    let loading = true;
    if (!isAuthenticated) 
        loading = false;

    let numberProduct = 0;
    let data = [];
    let products = [];

    if (cart.products){
        numberProduct = cart.products.length;
        data = cart.data;
        products = cart.products;
        if (cart.data.length === numberProduct) {
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
    
    let total = 0;
    for (let i = 0; i < data.length; i++) {
        total += data[i].cost.currentCost * products[i].number;
    }
    total = Number(total.toFixed(2));

    async function updateDataOfProductsInCart() {
        if (data.length !== numberProduct || loading) {
            // console.log('[CART] Loading data...')
            await load_cart_user(dispatch);
        }

        // By the way. we need to redirect user to cart page if
        // they are on mobile
        let widthScreen = window.innerWidth;
        if (widthScreen <= 740)
            history.push('/user/cart')
    }

    return (
        <div className="button float-btn dropdown"
            onMouseEnter={updateDataOfProductsInCart}
            onClick={updateDataOfProductsInCart}
        >
            <div className="static-button" 
                
            >
                <img src={Cart_icon} className="icon"/>
                <h4>My Cart</h4>
                { numberProduct > 0 && (<span className="dot"><p>{numberProduct}</p></span>) }
            </div>

            <div className="dropdown-list cart-dropdown">
                {numberProduct == 0 && <EmptyAlert/>}

                {
                    data.map( (product, i) => 
                        <Product_item 
                            key = {"product-item-in-cart-" + i}
                            product = {product}
                            products = {products}
                            index = {i}
                        />
                    )
                }
                
                <h3 className="total">Total: ${total}</h3>
                <Link to="/user/cart"><button>Go To Cart</button></Link>
            </div>

        </div>
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
        < >
            <div className="empty-alert">
                <h3>Your cart is empty</h3>
                <Link to="/"><h5>Go to shopping</h5></Link>
            </div>
            <Divided_line width="100%"/>
        </>
    );
}

function Product_item({ product, products, index }) {
    let [isImageLoaded, setIsImageLoaded] = useState(false);
    let { images, name, cost, id_product, trademark } = product;
    let { currentCost, realCost } = cost;
    let number = products[index].number;

    let image_url = "";
    if (images)
        image_url = images.smallSize[0].url.replace("URL:", "");

    return (
        <React.Fragment>
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
                        <div 
                            className={realCost !== currentCost ? "cost with-discount" : "cost without-discount"} 
                            style={{display: currentCost ? "flex" : "block"}}
                        >
                            <p className="current-cost">{currentCost ? '$' + currentCost : <Skeleton height={14}/>}</p>
                            { realCost && (<p className="real-cost">{'$' + realCost}</p>) }
                        </div>
                    </div>

                    { (number > 1) && <div className="number-product">{`(${number})`}</div>}
                </div>
                <Divided_line width="100%" margin="0"/>
            </Link>
        </React.Fragment >
    );
}