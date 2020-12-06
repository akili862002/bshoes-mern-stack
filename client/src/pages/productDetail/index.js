import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './index.css';
import ImageProductShow from '../../components/image-product-show';
import MiniDirCurrentPageBar from '../../components/dir-current-page-bar/mini';
import RateStar from '../../components/rate-star';
import { getIndexOfItemInArrayHaveSameSubObj } from '../../backup';
import { 
    add_a_product_to_cart,
    add_a_product_to_wishlist,
    user_reviews_a_product
} from '../../redux-handle/actions/user/process_data';
import SlickSlideComponent from '../../pages/home/components/SlickSlide';
import NavBarSelection from '../../components/nav-bar/NavBarSelection';
import Footer from '../../components/Footer';
import {
    ListSizeSelection,
    NumberProductSelection,
    Commitments,
    BigTitle,
    DataSheetTable,
    RatingShow,
    CommentsShow
} from './components';
import Skeleton from 'react-loading-skeleton';

import { ReactComponent as Cart_icon } from '../../images/svg/cart.svg';
import Price_icon from '../../images/svg/price-tag.svg';

import Heart_icon from '../../images/svg/heart.svg';

let dataSchema = {
    images: {
        normalSize: []
    },
    rate: {
        star: 0,
        NumberPeopleRate: 0
    },
    cost: {
        currentCost: null,
        discountPersent: null,
        realCost: null
    },
    information: {
        trademark: null,
        condition: null,
        dataSheet: [],
        describe: null
    },
    numberProductInStock: 0,
    options: {
        sizes: [],
        color: ""
    },
    reviews: []
}

export default function ProductDetailPage({ match }) {

    let history = useHistory();
    let dispatch = useDispatch();
    let id_product = match.params.id_product;
    let { user, isAuthenticated } = useSelector(state => state.user_auth);
    let [data, setData] = useState(dataSchema);
    let [sizeSelection, setSizeSelection] = useState(null);
    let [numberSelection, setNumberSelection] = useState(1);

    let indexOfProductInCart = null;
    let isThisProductInCart = false;

    if (user) {
        if ( data && (sizeSelection == null) ) {
            sizeSelection = data.options.sizes[0];
        }

        indexOfProductInCart = getIndexOfItemInArrayHaveSameSubObj(
            { id_product: data.id_product },
            user.cart.products
        );

        // If products in cart have  product like this
        if (indexOfProductInCart !== null) {
            isThisProductInCart = true;
            sizeSelection = user.cart.products[indexOfProductInCart].size;
            numberSelection = user.cart.products[indexOfProductInCart].number;
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        setData({...dataSchema});
 
        axios.get('/api/products/product-detail/' + id_product)
            .then((res) => {
                setData(res.data);
                setSizeSelection(res.data.options.sizes[0]);
                // console.log('[FETCH-DATA] --> SUCCESS');
                // console.log('[FETCH-DATA] Print -- \n', res.data);
            })
            .catch((err) => {
                console.error('[FETCH-DATA] --> FAIL');
                try {
                    console.error(err.response.data.error);
                } catch {
                    console.error(err);
                }
            });
    }, [id_product]);

    let ClassNames = {
        addToCartBtn: 'add-to-cart-btn',
        addToWishlistBtn: 'add-to-wishlist-btn'
    }

    ClassNames.addToCartBtn += isThisProductInCart ? ' disable' : '';

    function addProductToCartHandler(e) {
        if (!isAuthenticated) {
            history.push('/user/login')
            return;
        }

        let product = {
            id_product: id_product,
            size: sizeSelection,
            number: numberSelection
        }
        add_a_product_to_cart(product, dispatch);
    }

    function addProductToWishlistHandler() {
        let product = {
            id_product: id_product,
            size: sizeSelection,
            number: numberSelection
        }
        let index = getIndexOfItemInArrayHaveSameSubObj(
            { id_product },
            user.wishlist.products
        )

        if (index == null)
            add_a_product_to_wishlist(product, dispatch);
    }

    function addCommentToData(field) {
        data.reviews.unshift(field);
        // calculate star 
        let { star, NumberPeopleRate } = data.rate;
        // console.log(data.rate);
        let sumRateStar = NumberPeopleRate * star;
        let newStar = (sumRateStar + field.rate) / (NumberPeopleRate + 1);

        // Update
        data.rate.star = newStar;
        data.rate.NumberPeopleRate += 1;

        setData({...data});
        user_reviews_a_product(field, id_product);
    }
    
    return (
        <React.Fragment>
            <NavBarSelection 
                activeItem="Shoes"
            />
            <div className="product-detail-page main">
                <MiniDirCurrentPageBar 
                    dir={[
                        { site: 'Home', link: '/' },
                        { site: 'Products', link: '/products' }, 
                        { site: 'Product-detail', link: '#' }, 
                        { site: data.name, link: '#' }
                    ]}
                />

                <div className="product-show">

                    <Carousel_Slide_With_Images_Of_Product 
                        listImage = {data.images.normalSize}
                    />

                    <div className="main-content">
                        <h2 className="name">{data.name || <Skeleton />}</h2>
                        <div className="rate">
                            <RateStar 
                                numberStar={data.rate.star}
                                sizeEachStar="18px"
                            />
                            <h4 className="number-people-review">{data.rate.NumberPeopleRate + " review (s)"} </h4>
                        </div>
                        <h3 className="item"><strong>Trademark:</strong>{data.information.trademark || <Skeleton width="100px"/>}</h3>
                        <h3 className="item"><strong>Condition:</strong>{data.information.condition ||  <Skeleton width="100px"/>}</h3>
                        <h3 className="item">
                            <strong>Available In Stock:</strong>
                            <div className="red-text">
                                {data.numberProductInStock ? `${data.numberProductInStock} Items` : <Skeleton width="100px"/>}
                            </div>
                        </h3>

                        <h5 className="describe">{data.information.describe ||  <Skeleton count={4}/>}</h5>

                        <div className="line"></div>

                        <div className="size-selector">
                            <h3 className="item"><strong>Size:</strong></h3>
                            <ListSizeSelection 
                                sizes = {data.options.sizes}
                                sizeSelection = {sizeSelection}
                                setSizeSelection={setSizeSelection}
                                id_product = {id_product}
                                isThisProductInCart = {isThisProductInCart}
                                products = {user ? user.cart.products : []}
                                dispatch = {dispatch}
                            />
                            {data.options.sizes.length == 0 && <Skeleton width="200px" height="40px"/>}
                        </div>

                        <h3 className="item"><strong>Color:</strong>{data.options.color || <Skeleton width="100px"/>}</h3>

                        <div className="cost-container">
                            <div className="cost">
                                {
                                    data.cost.currentCost ? (
                                        < >
                                            <img src={Price_icon} className="icon"/>
                                            <p className="current-cost">{'$' + data.cost.currentCost}</p>
                                            <p className="real-cost">
                                                {data.cost.discountPersent > 0 && '$' + data.cost.realCost}
                                            </p>
                                        </>
                                    )
                                    : <Skeleton width="200px" height="20px"/>
                                }
                            </div>
                            {
                                data.cost.discountPersent > 0 && 
                                    (<div className="discount-box">
                                        {'Save ' + data.cost.discountPersent * 100 + '%'}
                                    </div>)
                            }
                        </div>

                        <div className="buttons-container">
                            <NumberProductSelection 
                                number={numberSelection}
                                setNumberSelection={setNumberSelection}
                                dispatch = {dispatch}
                                products = {user ? user.cart.products : []}
                                isThisProductInCart = {isThisProductInCart}
                                id_product = {id_product}
                            />

                            <div className={ClassNames.addToCartBtn} onClick={addProductToCartHandler}>
                                <Cart_icon className="icon"/>
                                <h3>ADD TO CART</h3>
                            </div>

                            <div className={ClassNames.addToWishlistBtn} onClick={addProductToWishlistHandler}>
                                <img src={Heart_icon} className="icon"/>
                            </div>
                        </div>

                        <Commitments />
                    </div>
                </div>

                <div className="product-details-desc">
                    <BigTitle name="Product Details"/>
                    <h4 className="item"><strong>Trademark:</strong>{data.information.trademark}</h4>
                    <h4 className="item"><strong>Condition:</strong>{data.information.condition}</h4>
                    <h4 className="item">
                        <strong>Available In Stock:</strong>
                        <div className="red-text">
                            {' ' + data.numberProductInStock + ' Items'}
                        </div>
                    </h4>
                    <DataSheetTable 
                        dataSheet = {data.information.dataSheet}
                    />
                </div>

                <div className="you-might-also-like">
                    <BigTitle name={"Products of " + data.information.trademark} />
                    {
                        data.information.trademark && (
                            <SlickSlideComponent 
                                api_link_req = {"/api/products/get-products-of-trademark/" + data.information.trademark}
                                isTitleShowed = {false}
                                isSeeMoreCardAlwaysShowed={true}
                                link_to_see_more_button={'/search/' + data.information.trademark.replace(/ /g, '-')}
                            />
                        )
                    }
                </div>

                <div className="costomer-reviews">
                    <BigTitle name = "Customer Reviews" />
                    <div className="board">
                        <RatingShow 
                            rate = {data.rate}
                        />
                        <CommentsShow 
                            reviews={data.reviews} 
                            addCommentToData={addCommentToData}
                            isAuthenticated={isAuthenticated}
                            history={history}
                        />
                    </div>
                </div>

                
            </div>
            <Footer />
        </React.Fragment>
    );
}

function Carousel_Slide_With_Images_Of_Product({ listImage }) {
    let [isFirstImageLoaded, setIsFirstImageLoaded] = useState(false);

    return (
        <ImageProductShow 
            width="100%" 
            isShowLoadingAnimation = {!isFirstImageLoaded}
        >
            {
                listImage.map((image, i) => {
                    let image_url = image.url.replace("URL:", '');
                    return (
                        <div className="item" key={'img-i' + image.id_image}>
                            <img 
                                src={image_url}
                                onLoad = {() => setIsFirstImageLoaded(true)}
                            />
                        </div>
                    );
                })
            }
        </ImageProductShow>
    );
}