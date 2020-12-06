import React, { useState, useRef } from 'react';
import './index.css';
import CheckoutProcessBar from '../conponents/checkout-process-bar';
import Tick_icon from '../../../../images/svg/check.svg';
import TextareaAutosize from 'react-textarea-autosize';
import { useDispatch, useSelector } from 'react-redux';
import { 
    user_adds_a_new_address, 
    user_edits_address 
} from '../../../../redux-handle/actions/user/process_data';
import { removeVietnameseTones } from '../../../../backup';
import { Link } from 'react-router-dom';
import { update_products_in_cart_of_user } from '../../../../redux-handle/actions/user/process_data';

export default function FillAddressInCheckoutProcess() {
    let { isDataReady, user } = useSelector(state => state.user_auth);
    let dispatch = useDispatch();

    let data = [];

    if (isDataReady)
        data = user.addressList;

    let [indexSelector, setIndexSelector] = useState(0);
    if (data.length == 1) 
        indexSelector = 0;

    let [isOpenAddressEditor, setIsOpenAddressEditor] = useState(false);
    let [indexInListAddressOfUser, setIndexInListAddressOfUser] = useState(-1);
    let [isNewField, setIsNewField] = useState(null);

    function openEditor(index) {
        setIndexInListAddressOfUser(index);
        setIsOpenAddressEditor(true);
        setIsNewField(false);
    }

    return (
        <div className="fill-adress-in-checkout-process main">
            <CheckoutProcessBar currentStep={2} />

            <div className="line"></div>

            <div className="address-choosen-container">
                <h3 className="title">Choose your address below:</h3>
                <div className="address-list">
                    { data.length == 0 && (
                            <div className="alert-empty">You haven't had any address now!</div>
                        )
                    }

                    {
                        data.map((item, i) => {
                            let { name, location, phone } = item;
                            let Class = "address-item";
                            if ( i == indexSelector )
                                Class += " selector";

                            function selectAddressHandler(e) {
                                setIndexSelector(i);
                            }

                            function userClickPaymentHandler() {
                                // Clear cart of user --
                                update_products_in_cart_of_user([], dispatch);
                            }
                            
                            return (
                                <div className={Class} onClick={selectAddressHandler} key={'ad-ls-i-' + i}>
                                    <p className="name s-strong">{name}</p>
                                    <p className="address">Address: {location}</p>
                                    <p className="phone">Phone number: {phone}</p>

                                    { (i == indexSelector) && (
                                        < >
                                            <div className="buttons">
                                                <Link to="/user/cart/checkout/process/payment">
                                                    <button className="primary-btn"
                                                        onClick={userClickPaymentHandler}
                                                    >Use this address</button>
                                                </Link>
                                                <button
                                                    onClick={() => {openEditor(i)}}
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                            <div className="tick-box">
                                                <img src={Tick_icon} className="icon"/>
                                            </div>
                                        </>                                        
                                    ) }
                                </div>
                            );
                        })
                    }

                    { !isOpenAddressEditor ? 
                        (
                            <button className="add-new address-item" 
                                onClick={() => {
                                    setIsOpenAddressEditor(true);
                                    setIsNewField(true);
                                }}
                            >
                                Add new address
                            </button>
                        ) : (
                            < AddressEditor 
                                isNewField = {isNewField}
                                indexInListAddressOfUser={indexInListAddressOfUser}
                                setIsOpenAddressEditor={setIsOpenAddressEditor}
                            />
                        )
                    }

                </div>
            </div>

        </div>
    );
}

function AddressEditor({isNewField, indexInListAddressOfUser, setIsOpenAddressEditor}) {
    let dispatch = useDispatch();
    // field structure: 
    let field = {
        name: "",
        location: "",
        phone: ""
    }

    let inputRefs = {
        name: useRef(),
        location: useRef(),
        phone: useRef()
    }

    let [err, setErr] = useState({
        target: '',
        message: ''
    });

    if( !isNewField ) {
        field = useSelector(state => state.user_auth.user.addressList[indexInListAddressOfUser]);
        isNewField = false;
    }

    let { name, location, phone } = field;
    
    function saveFieldHandler() {
        field = {
            name: inputRefs.name.current.value,
            location: inputRefs.location.current.value,
            phone: inputRefs.phone.current.value
        }
        field.name = removeVietnameseTones(field.name);
            
        // Check error
        if ( isEmpty(field.name) )
        return setErr({
            target: 'name',
            message: 'Please fill your full name!'
        })
        if ( isEmpty(field.location) )
            return setErr({
                target: 'address',
                message: 'Please fill your full address!'
            })
        if ( isEmpty(field.phone) || !isValidPhoneNumber(field.phone) )
            return setErr({
                target: 'phone',
                message: 'Please enter a valid phone number!'
            })
        // if we don't have any error. just set error is empty!
        setErr({
            target: '',
            message: ''
        })

        // Action redux--
        if (isNewField) {
            user_adds_a_new_address(field, dispatch);
        } else {
            user_edits_address(indexInListAddressOfUser, field, dispatch);
        }

        setIsOpenAddressEditor(false);

        // console.log('[Address - submit]- ', field);
        // action - redux
    }

    return (
        < >
            <div className="dark-slide"
                onClick={() => {setIsOpenAddressEditor(false)}}
            ></div>

            <div className="address-editor">
                <div className="inputs">

                    <div className="input">
                        <div className="title">Name</div>
                        <input type="text" 
                            defaultValue={name} 
                            spellCheck="false" 
                            placeholder="Enter your name"
                            ref = {inputRefs.name}
                        />
                    </div>
                    { err.target == 'name' && <ErrorAlert message={err.message}/>}
                    <div className="input">
                        <div className="title">Address</div>
                        <TextareaAutosize 
                            type="text" 
                            defaultValue={location} 
                            spellCheck="false" 
                            placeholder="Enter your address..."
                            ref = {inputRefs.location}
                        />
                    </div>
                    { err.target == 'address' && <ErrorAlert message={err.message}/>}
                    <div className="input">
                        <div className="title">Phone</div>
                        <input 
                            type="text" 
                            defaultValue={phone} 
                            spellCheck="false" 
                            placeholder="Enter your phone number"
                            ref = {inputRefs.phone}
                        />
                    </div>
                    { err.target == 'phone' && <ErrorAlert message={err.message}/>}
                    
                </div>

                <div className="buttons">
                    <button className=" gray-btn"
                        onClick={() => setIsOpenAddressEditor(false)}
                    >
                        Cancel
                    </button>
                    <button className="primary-btn" onClick={saveFieldHandler}>Save</button>
                </div>
            </div>
        </>
    );
}

function ErrorAlert({ message }) {
    return (
        <div className="error-msg">{message}</div>
    );
}

function isEmpty(text) {
    if (text.length > 0)
        return false;
    return true;
}

function isValidPhoneNumber(phone)
{   
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if ( phone.match(phoneno) ) {
        return true;
    } else {
        return false;
    }
}
