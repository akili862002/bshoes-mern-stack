import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { load_cart_user } from '../../../redux-handle/actions/user/load_data';
import "./index.css";
import DirCurrentPageBar from '../../../components/dir-current-page-bar';
import Skeleton from 'react-loading-skeleton';

import {
        update_products_in_cart_of_user,
        remove_product_out_of_cart,
        move_product_from_cart_to_wishlist 
} from '../../../redux-handle/actions/user/process_data';

import Footer from '../../../components/Footer';

import {ReactComponent as Cart_icon} from '../../../images/svg/cart.svg';
import Price_icon from '../../../images/svg/price-tag.svg';
import Inc_icon from '../../../images/svg/inc.svg';
import Dec_icon from '../../../images/svg/dec.svg';
import Truck_icon from '../../../images/svg/commitment/delivery-truck.svg';
import Returning_icon from '../../../images/svg/commitment/returning.svg';
import Secure_icon from '../../../images/svg/commitment/secure.svg';
import Trash_icon from '../../../images/svg/trash.svg';
import Heart_icon from '../../../images/svg/heart.svg';
import NavBarSelection from '../../../components/nav-bar/NavBarSelection';
import Empty_cart_img from '../../../images/img/empty-cart.png';
import CircleLoading from '../../../components/circle-loading';

export default function UserShoppingCartPage() {
    // Always make scroll in top of page
    useEffect(() => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 200);
    }, []);

    let dispatch = useDispatch();
    let { user, isDataReady } = useSelector(state => state.user_auth);
    let [isDataLoaded, setIsDataLoaded] = useState(false);

    let [products, setProducts] = useState([]);
    let [data, setData] = useState([]);
    let numberProduct = 0;

    if (isDataReady) {
        products = user.cart.products;
        numberProduct = products.length;
        data = user.cart.data;
    }

    // if data wasn't loaded before, we will use skereton and async loading
    if (numberProduct !== data.length) {
        load_cart_user(dispatch);
        isDataLoaded = true;
        data = new Array(numberProduct)
                    .fill({
                        image_preview: null,
                        name: null,
                        cost: null,
                        id_product: null,
                        trademark: null,
                        cost: {
                            currentCost: null,
                            realCost: null,
                            discountPersent: null
                        }
                    });
    }

    // console.log(isDataLoaded)
    let total = {
        currentCost: 0,
        realCost: 0,
        discountPersent: 0
    };
    if (data.length > 0) {
        for(let i = 0; i < data.length; i++) {
            total.currentCost += data[i].cost.currentCost * products[i].number;
            total.realCost += data[i].cost.realCost * products[i].number;
        }
    }
    if (total.realCost !== 0)
        total.discountPersent = Number( (100 -total.currentCost/total.realCost*100).toFixed(2) );

    let CheckoutButtonClass = 'checkout';
    if (numberProduct == 0) {
        CheckoutButtonClass += ' disable'
    }

    return (
        <React.Fragment >

            <NavBarSelection />
            <DirCurrentPageBar 
                dir={[
                    {site: 'Home', link: '/'},
                    {site: 'User', link: '/user/profile'},
                    {site: 'Cart', link: '/user/cart'}
                ]}
                titlePage={{ Icon: Cart_icon, name:`Shopping Cart (${numberProduct})`}}
            />

            <div className="shopping-cart-page main">


                <div className="field">

                    <div className="list-products cards">
                        { isDataLoaded && <CircleLoading />}

                        { ( products.length == 0 && isDataReady) && (
                            <div className="empty-cart-alert">
                                <img src={Empty_cart_img} />
                                <h3>Your cart is empty!</h3>
                            </div>
                        )}

                        {
                            data.map((product, i) => 
                                <Product_item 
                                    key={'asdas231-i-' + i}
                                    product = {product}
                                    products = {products}
                                    index = {i}
                                    dispatch={dispatch}
                                />
                            )
                        }
                    </div>

                    <div className="total-cost">
                        <h4 className="title">Total:</h4>
                        <h1 className="total-current-number">${total.currentCost}</h1>
                        <h5 className="total-real-number">${total.realCost}</h5>
                        <h4 className="total-persent">{total.discountPersent}% off</h4>
                        <h4 className="ship-cost">Free shipping!</h4>
                        <button className={CheckoutButtonClass}>
                            <Link to="/user/cart/checkout/process/address">
                                Proceed To Checkout
                            </Link>
                        </button>

                        <Commitments />
                    </div>
                </div>
            </div>

            <Footer />

        </React.Fragment>
    );
}

function Product_item({ product, products, index, dispatch }) {
    let [isImageLoaded, setIsImageLoaded] = useState(false);
    let { images, trademark, name, cost, color } = product;
    let { number, size, id_product } = products[index];
    let total_cost = cost.currentCost*number;

    let image_url = '';
    if (images)
        image_url = images.smallSize[0].url.replace("URL:", '');


    function increaseNumberProductHandler() {
        products[index].number += 1;
        update_products_in_cart_of_user(products, dispatch);
    }
    function decreaseNumberProductHandler() {
        if (number > 1) {
            products[index].number -= 1;
            update_products_in_cart_of_user(products, dispatch);
        }
    }

    async function removeProductOutOfCartHandler() {
        await remove_product_out_of_cart(index, dispatch);
    }

    async function moveToWishlistHandler() {
        await move_product_from_cart_to_wishlist(index, dispatch);
    }

    return (
        <div className="card" key={'product-s-i-' + index}>

            <div className="image">
                <img 
                    src={image_url}
                    onLoad={() => setIsImageLoaded(true)}
                />
                { !isImageLoaded && <Skeleton width="100px" height="100px"/> }
            </div>

            {/* -------- AREA INFORS ----- */}
            <div className="area-infors">
                <Link to={'/products/product-detail/' + id_product}>
                    <div className="product-infor">
                        <p className="name">{name || <Skeleton />}</p>
                        <p className="trademark">{trademark || <Skeleton/>}</p>
                        <p className="size option">Size: <strong>{size || <Skeleton />}</strong></p>
                        <p className="color option">Color: <strong>{color || <Skeleton />}</strong></p>
                    </div>
                </Link>
            </div>
            
            {/* -------- AREA BUTTONS ----- */}
            <div className="area-buttons">
                <div className="number-selector">
                    <div className="number">{number}</div>
                    <div className="buttons">
                        <div className="increase btn" onClick={increaseNumberProductHandler}>
                        <img src={Inc_icon} className="icon"/>
                        </div>
                        <div className="decrease btn" onClick={decreaseNumberProductHandler}>
                            <img src={Dec_icon} className="icon"/>
                        </div>
                    </div>
                </div>
                <div className="functional-btn">
                    <div className="remove-btn btn" onClick={removeProductOutOfCartHandler}>
                        <h4>Remove</h4>
                        <img src={Trash_icon} className="icon"/>
                    </div>
                    <div className="move-to-wishlist-btn btn" onClick={moveToWishlistHandler}>
                        <h4>Move to wishlist</h4>
                        <img src={Heart_icon} className="icon"/>
                    </div>
                </div>
            </div>

            {/* -------- AREA COST ----- */}
            <div className="area-cost">
                <div className="current-cost">
                    <img src={Price_icon} className="icon"/>
                    <h4>${total_cost}</h4>
                </div>
                {
                    cost.discountPersent > 0 && 
                    (
                        <div className="real-cost-and-discount">
                            <p className="real-cost">${cost.realCost*products[index].number}</p>
                            <span>|</span>
                            <p className="discount">{`-${cost.discountPersent*100}%`}</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

function Commitments() {
    let commitments = [
        {
            icon: Secure_icon,
            desc: "Security policy (edit with Customer reassurance module)"
        },
        {
            icon: Truck_icon,
            desc: "Delivery policy (edit with Customer reassurance module)"
        },
        {
            icon: Returning_icon,
            desc: "Return policy (edit with Customer reassurance module)"
        }
    ]
    return (
        <div className="commitments">
            {
                commitments.map((item, i) => 
                    <div className="item" key={'commitemme-i-' + i}>
                        <img src={item.icon} className="icon"/>
                        <h6>{item.desc}</h6>
                    </div>
                )
            }
        </div>
    );
}