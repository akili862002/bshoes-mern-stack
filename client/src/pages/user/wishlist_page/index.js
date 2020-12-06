import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import "./index.css";
import Footer from '../../../components/Footer';
import NavBarSelections from '../../../components/nav-bar/NavBarSelection';
import { load_wishlist_user } from '../../../redux-handle/actions/user/load_data';
import { move_product_from_wishlist_to_cart } from '../../../redux-handle/actions/user/process_data';
import Skeleton from 'react-loading-skeleton';
import RateStar from '../../../components/rate-star';
import CircleLoading from '../../../components/circle-loading';
import DirCurrentPageBar from '../../../components/dir-current-page-bar';
import { ReactComponent as Heart_icon } from '../../../images/svg/heart.svg';
import { ReactComponent as Cart_icon } from '../../../images/svg/cart.svg';
import Empty_icon from '../../../images/img/empty.png';

export default function WishlistPage() {
    // Always make scroll in top of page
    useEffect(() => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 200);
    }, []);
    
    let dispatch = useDispatch();
    let history = useHistory();
    let [data, setData] = useState([]);
    let [isDataLoaded, setIsDataLoaded] = useState(false);
    let { user, isAuthenticated, loading } = useSelector(state => state.user_auth);
    // console.log("User_data change --")
    
    // Force user login if they haven't logged in
    if (!isAuthenticated && !loading) {
        history.push('/user/login');
    }

    let isDataInWishlistLoaded = false;
    if (user && user.wishlist.data.length == user.wishlist.products.length) {
        data = user.wishlist.data;
        isDataInWishlistLoaded = true;
    }

    useEffect(() => {
        // console.log("User--", user);
        if (user) {
            // console.log('Data set: ', user.wishlist.data);
            setData([...user.wishlist.data]);
            if (user.wishlist.data.length !== user.wishlist.products.length) {
                // console.log('command loading-cart!');
                load_wishlist_user(dispatch);
            }
        }
    }, [user, isDataInWishlistLoaded]);

    // console.log(data);

    return (
        <React.Fragment >
            <NavBarSelections />
            <DirCurrentPageBar 
                dir={[
                    { site: "Home", link: "/" },
                    { site: "User", link: "/user/profile" },
                    { site: "Wishlist", link: "#" }
                ]}
                titlePage={{
                    name: `My Wishlist (${data.length})`,
                    Icon: Heart_icon
                }}
            />
        
            <div className="wishlist-page main">
                { !isDataInWishlistLoaded && <CircleLoading /> }
                { 
                    user && user.wishlist.products.length == 0 && (
                        <div className="empty-alert">
                            <img src={Empty_icon}/>
                            <h3>Your Wishlist Is Empty!</h3>
                        </div>
                    ) 
                }
                {
                    data.map((product, index) => 
                        <Product 
                            key={'product-item-k-' + product.name}
                            product={product}
                            index={index}
                            dispatch={dispatch}
                        />
                    )
                }
            </div>
            
            <Footer />
        </React.Fragment>
    );
}

function Product({ product, index, dispatch }) {
    let [isImageLoaded, setIsImageLoaded] = useState(false);
    let { id_product, images, rate, cost, name } = product;
    let image_url = "";
    if (images) {
        image_url = images.smallSize[0].url.replace("URL: ", "");
    }
    
    function onClickToAddWishlistHandler(e) {
        e.preventDefault();
        move_product_from_wishlist_to_cart(index, dispatch);
    }

    return (
        <Link to={"/products/product-detail/" + id_product}>
            <div className="card">
                <div className="image">
                    { 
                        images.smallSize.length > 0 && 
                            <img
                                src={image_url}
                                onLoad = {() => setIsImageLoaded(true)}
                            />
                    }
                    { (!isImageLoaded) && <Skeleton width="200px" height="150px"/> }
                </div>
                <div className="informations">
                    {
                        rate.star ? (
                            <div className="rate-status">
                                <RateStar 
                                    numberStar={rate.star}
                                    sizeEachStar={15}
                                />
                            </div>
                        ) 
                        : <Skeleton height="15px"/>
                    }
                    <div className="name">{name || <Skeleton />}</div>
                    <div className="cost">
                        <div className="current-cost">{ cost.currentCost ? ('$' + cost.currentCost) : <Skeleton width="100px"/>}</div>
                        <div className="real-cost">{cost.discountPersent > 0 && '$' + cost.realCost}</div>
                        <div className="discount-persent">{cost.discountPersent > 0 && `-${(cost.discountPersent*100).toFixed(0)}%`}</div>
                    </div>
                </div>
                <div className="buttons">
                    <button className="add-to-wishlist"
                        onClick={onClickToAddWishlistHandler}
                    >
                        <Cart_icon className="icon"/>
                        <p>Add To Cart</p>
                    </button>
                </div>
            </div>
        </Link>
    );
}