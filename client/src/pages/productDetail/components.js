import React, { useRef, useState } from 'react';
import { update_products_in_cart_of_user } from '../../redux-handle/actions/user/process_data';
import { getIndexOfItemInArrayHaveSameSubObj, removeVietnameseTones } from '../../backup';
import RateStar from '../../components/rate-star';
import StarSelector from '../../components/star-selector';
import TextareaAutosize from 'react-textarea-autosize';
import { useSelector } from 'react-redux';

import Secure_icon from '../../images/svg/commitment/secure.svg';
import Truck_icon from '../../images/svg/commitment/delivery-truck.svg';
import Returning_icon from '../../images/svg/commitment/returning.svg';
import Inc_icon from '../../images/svg/inc.svg';
import Dec_icon from '../../images/svg/dec.svg';
import User_icon from '../../images/img/user.png';

export function ListSizeSelection({ 
    sizes, 
    sizeSelection ,
    setSizeSelection, 
    id_product, 
    isThisProductInCart, 
    dispatch, 
    products }) {

    return (
        <div className="list-size">
            {
                sizes.map((size) => {
                    let ClassName = 'item';
                    if (size === sizeSelection) {
                        ClassName += ' select'
                    }

                    function selectSizeHandler() {
                        if (!isThisProductInCart) {
                            let newSize = size;
                            setSizeSelection(newSize);
                            // console.log('set size: ',  size);
                        } else if (size !== sizeSelection) {
                            let index = getIndexOfItemInArrayHaveSameSubObj(
                                { id_product },
                                products
                            );
                            products[index].size = size;
                            update_products_in_cart_of_user(products, dispatch);
                        }
                    }

                    return (
                        <div 
                            className={ClassName}
                            onClick={selectSizeHandler}
                            key={'size-item-' + size}
                        >
                            {size}
                        </div>
                    );
                })
            }
        </div>
    );
}

export function NumberProductSelection({   
    products, 
    dispatch, 
    number, 
    setNumberSelection, 
    isThisProductInCart, 
    id_product }) {

    function increaseNumberProductHandler() {
        if (isThisProductInCart) {
            let index = getIndexOfItemInArrayHaveSameSubObj({ id_product }, products);
            products[index].number += 1;
            update_products_in_cart_of_user(products, dispatch);
        } else {
            setNumberSelection(number + 1);
        }
    }
    function decreaseNumberProductHandler() {
        if (number > 1) {
            if (isThisProductInCart) {
                let index = getIndexOfItemInArrayHaveSameSubObj({ id_product }, products);
                products[index].number -= 1;
                update_products_in_cart_of_user(products, dispatch);
            } else {
                setNumberSelection(number - 1);
            }
        }
    }

    return (
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
    );
}


export function Commitments() {
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

export function BigTitle({name}) {
    return (
        <div className="big-title">
            <div className="line"></div>
            <div className="title">{name}</div>
        </div>
    );
}

export function DataSheetTable({ dataSheet }) {
    return (
        <div className="data-sheet-container" >
            <h3 className="title">Data Sheet</h3>
            <table width="100%">
                <tbody>
                    {
                        dataSheet.map((item, i) => (
                                <tr key={'item-table-datasheet-i-' + i}>
                                    <td className="name">{item.name}</td>
                                    <td className="property">{item.property}</td>
                                </tr>
                            )
                        )
                    }
                </tbody>
            </table>
        </div>
    );
}

export function RatingShow({ rate }) {
    let { star, NumberPeopleRate } = rate;
    star = star.toFixed(1);
    
    return (
        <div className="rating-show">
            <h1>{star}</h1>
            <RateStar numberStar={star} sizeEachStar="22px"/>
            <p className="number-rating">{NumberPeopleRate + ' ratings'}</p>
        </div>
    );
}

let rateStatus = {
    '1': 'Really Bad',
    '2': 'Bad',
    '3': 'Quite Good',
    '4': 'Good',
    '5': 'Really Good'
}

function get_mm_dd_yy(date) {
    let d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function UserInfor({ name, date, avatar }) {
    name = removeVietnameseTones(name);
    return (
        <div className="user-infor">
            <img src={avatar || User_icon} className="avatar"/>
            <div className="texts">
                <div className="name">{name}</div>
                <div className="date">{'Commented in ' + get_mm_dd_yy(date)}</div>
            </div>
        </div>
    );
}

export function CommentsShow({ reviews, addCommentToData, isAuthenticated, history }) {
    let [isOpenWriteReview, setIsOpenWriteReview] = useState(false);
    return (
        <div className="reviews-show">
            <div className="title">Comments</div>
            <div className="reviews">
                {
                    reviews.map((review, i) => {
                        let { user, comment, rate, date } = review;

                        return (
                            <div className="review-item" key={'comment-ii - ' + i}>
                                <UserInfor 
                                    name={user.name}
                                    date={date}
                                    avatar={user.avatar}
                                />
                                <RateStar numberStar={rate} sizeEachStar="12px"/>
                                <div className="rate-status">{rateStatus[rate.toString()]}</div>
                                <div className="comment">{comment}</div>
                            </div>
                        );
                    })
                }
                { reviews.length == [] && (
                    <p className="empty-notice">Don't have any comment for this product!</p>
                ) }

                
                {  
                    isOpenWriteReview ? 
                        <WriteReviewBoard 
                            setIsOpenWriteReview={setIsOpenWriteReview}
                            addCommentToData={addCommentToData}
                        /> 
                    :
                        (
                            <button className="write-your-review" 
                                onClick={() => {
                                    if (isAuthenticated) {
                                        setIsOpenWriteReview(true);
                                    } else {
                                        history.push('/user/login');
                                    }
                                }}
                            >
                                Write your review
                            </button>
                        )
                }
            </div>
        </div>
    );
}

function WriteReviewBoard({ setIsOpenWriteReview, addCommentToData }) {
    let [starSelect, setStarSelect] = useState(0);
    let comment_ref = useRef();
    let user = useSelector(state => state.user_auth.user);
    let [errorAlert, setErrorAlert] = useState({
        target: '',
        message: ''
    })

    function submitCommentHandler() {
        let comment = comment_ref.current.value;
        let field = {
            user: {
                name: user.name,
                avatar: user.avatar.url ? user.avatar.url : ""
            },
            comment: comment,
            rate: starSelect,
            date: Date.now()
        }

        if (field.rate <= 0) {
            return setErrorAlert({
                target: 'star-selector',
                message: 'Please rate your star!'
            })
        } else {
            setErrorAlert({
                target: '',
                message: ''
            })
        }

        addCommentToData(field);
        setIsOpenWriteReview(false);
    }

    return (
        <div className="write-review-board">
            <div className="title">Write your comment</div>
            <div className="quality-selector">
                <div className="small-title">Quality</div>
                <StarSelector 
                    setStarSelect={setStarSelect} 
                    starSelect = {starSelect}
                    height="20px"
                />
            </div>
            {
                errorAlert.target == 'star-selector' && 
                    (<h4 className="error-alert">{errorAlert.message}</h4>)
            }
            <div className="write-comment">
                <div className="small-title">Your comment</div>
                <TextareaAutosize 
                    placeholder="Write your comment here..."
                    ref={comment_ref}
                />
            </div>
            <div className="buttons">
                <button className="send primary-btn"
                    onClick={submitCommentHandler}
                >
                    Send
                </button>
                <button 
                    className="cancle" 
                    onClick={() => setIsOpenWriteReview(false)}
                >
                    Cancle
                </button>
            </div>
        </div>
    );
}