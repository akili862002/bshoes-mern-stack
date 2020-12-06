import React, { useState, useEffect } from 'react';
import { CONST_SORT_TARGET } from '../consts';
import CircleLoading from '../../../components/circle-loading';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';

import GridDisplay_icon from '../../../images/img/grid-display.png';
import ListDisplay_icon from '../../../images/img/list-display.png';
import Drop_icon from '../../../images/svg/dec.svg';
import RateStar from '../../../components/rate-star';
import Search_fail_icon from '../../../images/img/search_fail.png';
import { ReactComponent as Next_arrow_icon } from '../../../images/svg/next.svg';
import { LazyLoadImage  } from 'react-lazy-load-image-component';

export default function Products_Display(
    {
        data,
        search_text,
        sort_target,
        switchSortTarget,
        displayMethod,
        switchDisplayMethod,
        isLoadingSearchResult,
        currentPage,
        totalPage,
        switchPageSelection,
        numberProductFound
    }
) {

    return (
        <div className="products-display-board">
            {
                search_text !== "search-page" ? (
                    <React.Fragment>
                        <div className="big-title">Search Result</div>
                        <Product_Option_Nav 
                            numberProduct={numberProductFound}
                            search_text={search_text}
                            sort_target={sort_target}
                            switchSortTarget={switchSortTarget}
                            displayMethod={displayMethod}
                            switchDisplayMethod={switchDisplayMethod}
                        />
                        <div className="line"></div>

                        <Products 
                            data={data}
                            displayMethod={displayMethod}
                            isLoadingSearchResult={isLoadingSearchResult}
                            currentPage = {currentPage}
                            totalPage = {totalPage}
                            switchPageSelection = {switchPageSelection}
                        />
                    </React.Fragment>
                ) : (
                    <div className="big-title">Search your shoes</div>
                )
            }
        </div>
    );
}

function Product_Option_Nav(
    { 
        numberProduct, 
        search_text, 
        sort_target, 
        switchSortTarget, 
        displayMethod, 
        switchDisplayMethod 
    }
) {
    if (search_text.length > 20) {
        search_text = search_text.slice(0, 20) + '...';
    }

    function Display_Method({ icon, method }) {
        let ClassName = displayMethod[method] ? "icon active" : "icon";

        return (
            <img 
                src={icon} 
                className = {ClassName}
                onClick={() => switchDisplayMethod(method)}
            />
        );
    }

    return (
        <div className="nav-product-option">
            <div className="search-result">{`${numberProduct} items for "${search_text}"`}</div>  
            
            <div className="right-area">
                <Sort_Selection 
                    sort_target = {sort_target}
                    switchSortTarget = {switchSortTarget}
                />

                <div className="type-display">
                    <Display_Method 
                        icon = {GridDisplay_icon}
                        method = {'grid'}
                    />
                    <Display_Method 
                        icon = {ListDisplay_icon}
                        method = {'list'}
                    />
                </div>
            </div>
        
        </div>
    )
}

function Sort_Selection({ sort_target, switchSortTarget, displayMethod }) {
    let [isOpen, setIsOpen] = useState(false);
    
    let currentTypeSort = '';
    for (let key of Object.keys(sort_target)) {
        if (sort_target[key]) {
            currentTypeSort = key; 
        }
    }

    let ClassNames = {
        dropButton: isOpen ? "drop-button active" : "drop-button",
        listDropItems: isOpen ? "list-drop-items active" : "list-drop-items"
    }

    return (
        <div className="sort-selection">
            <h4>Sort by: </h4>
            <div className={ClassNames.dropButton}>
                <div className="current-type-sort"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <p>{currentTypeSort}</p>
                    <img src={Drop_icon} />
                </div>

                <div className={ClassNames.listDropItems}>
                    {
                        Object.keys(sort_target).map( (sort_type, i) => {
                            if (sort_type == currentTypeSort)
                                return null;

                            function onClickHandler() {
                                switchSortTarget(sort_type);
                                setIsOpen(false);
                            }

                            return (
                                <div 
                                    className="drop-item" 
                                    key={'sort-item-iii-' + i}
                                    onClick={onClickHandler}
                                >
                                    { sort_type }
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}

function Products(
    { 
        data, 
        displayMethod, 
        isLoadingSearchResult,
        currentPage,
        totalPage,
        switchPageSelection
}) {
    let ClassNames = {
        listCardOfProducts: 'list-card-of-products'
    }
    if (displayMethod.grid) {
        ClassNames.listCardOfProducts += ' gird-display';
    } else if (displayMethod.list) {
        ClassNames.listCardOfProducts += ' list-display';
    }

    return (
        <div className={ClassNames.listCardOfProducts}>
            {isLoadingSearchResult && <CircleLoading />}
            {(!isLoadingSearchResult && data.length == 0) && <SearchFail />}
            {
                displayMethod.grid && data.map( (product, i) => {
                    let elementKey = product.id_product ? product.id_product : i;
                    return (
                        <Product_In_Grid_Display_Method 
                            product={product}
                            key={'product-card-id-grid-mode-' + elementKey}
                            isLoadingSearchResult = {isLoadingSearchResult}
                        />
                    )
                })
            }
            {
                displayMethod.list && data.map((product, i) => {
                    let elementKey = product.id_product ? product.id_product : i;
                    return (
                        <Product_In_List_Display_Method 
                            product={product}
                            key={'product-card-id-list-mode' + elementKey}
                            isLoadingSearchResult = {isLoadingSearchResult}
                        />
                    )
                })
            }
            <Page_selection 
                currentPage = {currentPage}
                totalPage = {totalPage}
                switchPageSelection = {switchPageSelection}
            />
        </div>
    );
}

function Page_selection({ currentPage, totalPage, switchPageSelection }) {
    let pageIndexs = [currentPage];
    let numberButton = 5;
    let count = 1;
    let i = currentPage - 1;
    let j = currentPage + 1;

    while (true) {
        if (i >= 0) {
            pageIndexs.unshift(i);
            i -= 1;
            count += 1;
        }
        if (j < totalPage) {
            pageIndexs.push(j);
            j += 1;
            count += 1;
        }

        if (count == numberButton)
            break;
        if (i < 0 && j > totalPage - 1) 
            break;
    }

    return (
        <div className="page-index-selection">
            { 
                (currentPage > 0) && 
                    (
                        <div className="previos-page arrow"
                            onClick={() => switchPageSelection(currentPage - 1)}
                        >
                            <Next_arrow_icon className="icon previos-arrow"/>
                        </div> 
                    )
            }
            {
                pageIndexs.map((index) => {
                    let ClassName = (index == currentPage) ? "page-btn select btn" : "page-btn btn";

                    return(
                        <div 
                            className={ClassName} 
                            key={'page-select-' + index}
                            onClick={() => switchPageSelection(index)}
                        >
                            {index + 1}
                        </div>
                    );
                })
            }
            { 
                (currentPage < totalPage - 1) && 
                (
                    <div className="next-page arrow"
                        onClick={() => switchPageSelection(currentPage + 1)}
                    >
                        <Next_arrow_icon className="icon next-arrow"/>
                    </div> 
                )
            
            }
        </div>
    );
}

function Product_In_Grid_Display_Method({ product, isLoadingSearchResult}) {
    let { cost, images, name, rate, id_product } = product;
    let image_url = "";
    if (images.smallSize.length > 0)
        image_url = images.smallSize[0].url.replace("URL: ", "");
    
    return (
        <Link to={"/products/product-detail/" + id_product}>
            <div className="card">
                <div className="image">
                    { 
                        !isLoadingSearchResult &&
                            <LazyLoadImage
                                src={image_url}
                                alt={"Image of " + name}
                                effect="blur"
                                // width="100%"
                                // height="100%"
                            />
                    }
                </div>
                <div className="informations">
                    {
                        rate.star ? (
                            <div className="rate-status">
                                <RateStar 
                                    numberStar={rate.star}
                                    sizeEachStar={15}
                                />
                                <p className="number-people-rate">{`(${rate.NumberPeopleRate})`}</p>
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
            </div>
        </Link>
    );
}

function Product_In_List_Display_Method({ product, isLoadingSearchResult }) {
    let [isImageLoaded, setIsImageLoaded] = useState(false);
    let { cost, images, name, information, rate, id_product } = product;
    let image_url = "";
    if (images.smallSize.length > 0)
        image_url = images.smallSize[0].url.replace("URL: ", "");

    return (
        <Link to={"/products/product-detail/" + id_product}>
            <div className="card">
                <div className="image">
                    { 
                        !isLoadingSearchResult &&
                            <LazyLoadImage
                                src={image_url}
                                alt={"Image of " + name}
                                effect="blur"
                                // width="100%"
                                // height="100%"
                            />
                    }
                </div>
                <div className="informations">
                    <div className="name">{name || <Skeleton />}</div>
                    <div className="trademark">{information.trademark || <Skeleton />}</div>
                    <div className="rate-status">
                        {
                            rate.star ? (
                                <div className="rate-status">
                                    <RateStar 
                                        numberStar={rate.star}
                                        sizeEachStar={15}
                                    />
                                    <p className="number-people-rate">{`(${rate.NumberPeopleRate})`}</p>
                                </div>
                            ) 
                            : <Skeleton height="15px" width="100px"/>
                        }
                    </div>
                    <div className="cost">
                        <div className="current-cost">{ cost.currentCost && ('$' + cost.currentCost) }</div>
                        <div className="real-cost">{cost.discountPersent > 0 && '$' + cost.realCost}</div>
                        <div className="discount-persent">{cost.discountPersent > 0 && `-${(cost.discountPersent*100).toFixed(0)}%`}</div>
                    </div>
                    <div className="describe">
                        {information.describe || <Skeleton count={3}/>}
                    </div>
                </div>
            </div>
        </Link>
    );
}

function SearchFail() {
    return (
        <div className="search-fail-alert">
            <img src={Search_fail_icon} alt=""/>
            <h4>Sorry, We cannot find any product with your search text or filter options!</h4>
        </div>
    );
}