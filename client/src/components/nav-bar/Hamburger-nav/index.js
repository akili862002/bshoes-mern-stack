import React, { useState, useRef } from 'react';
import "./index.css";
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { blackNavBarItems } from '../consts';
import Avatar_User from '../../../images/img/user.png';

export default function Hamburger_nav() {    
    let [isOpen, setIsOpen] = useState(false);

    return (
        <div className="hamburger-nav">
            <div className="btn" onClick={() => setIsOpen(true)}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            {isOpen && 
                <div 
                    className="black-diaphragm" 
                    onClick={() => setIsOpen(false)}
                />
            }
            <List_Items 
                isOpen={isOpen} 
                selectiveItems={blackNavBarItems}
                setIsOpen={setIsOpen}
            />
        </div>
    );

}

function List_Items({ isOpen, setIsOpen, selectiveItems }) {
    let boxListItems_ref = useRef();
    useEffect(() => {
        if (isOpen)
            boxListItems_ref.current.classList.add('active');
        else 
        boxListItems_ref.current.classList.remove('active');
    }, [isOpen]);
    let { isAuthenticated, user, isDataReady } = useSelector(state => state.user_auth);

    let nameItems = Object.keys(selectiveItems);
    let Links = selectiveItems;

    return (
        <div className="list-items" ref={boxListItems_ref}>
            { 
                isAuthenticated ? 
                    <User_intro 
                        user={user} 
                        isDataReady={isDataReady} 
                        setIsOpen = {setIsOpen}
                    />
                : (
                    <>
                        <Link to="/user/login"
                            onClick={() => {setIsOpen(false)}}
                        >
                            <h2 className="login-register">Log in</h2>
                        </Link>
                        <Link to="/user/register"
                            onClick={() => {setIsOpen(false)}}
                        >
                            <h2 className="login-register">Register</h2>
                        </Link>
                    </>
                )
            }
            
            

            <div className="divided-line"></div> {/* This is a line to divide 2 group */}
            <h3 className="title">Selection</h3>

            <Link to="/search/search-page" onClick={() => setIsOpen(false)}>Search</Link>
            {nameItems.map((name) => 
                <Link 
                    to={Links[name]} 
                    key={"hamburger-item-" + name}
                    onClick={() => setIsOpen(false)}
                >
                    {name}
                </Link>
            )}
        </div>
    );
}

function User_intro({ user, isDataReady, setIsOpen }) {
    let dispatch = useDispatch();
    let avatar = {
        type_avatar: "",
        url: "",
        data: ""
    }
    let name = "";
    let data = {
        theNumberOfProductInCart: 0,
        theNumberOfProductInWishlist: 0
    }

    if (isDataReady) {
        avatar = user.avatar;
        name = user.name;
        data.theNumberOfProductInCart = user.cart.products.length;
        data.theNumberOfProductInWishlist = user.wishlist.products.length;
    }

    function logOutHandler() {
        dispatch({
            type: "USER_LOG_OUT"
        });
    }

    return (
        < >
            <div className="user-intro">
                <div className="avatar-user">
                    <img src={avatar.type_avatar === "URL" ? avatar.url : Avatar_User}/>
                </div>
                <div className="texts-user">
                    <h3 className="name-user">{name}</h3>
                    <h4>Welcome Here!</h4>
                </div>
            </div>

            <div className="divided-line"></div>
            <div className="list-btn">
                <Link to="/search/search-page" onClick={() => setIsOpen(false)}>Search</Link>
                <Link to="/user/cart" onClick={() => setIsOpen(false)}>My Cart<p>({data.theNumberOfProductInCart})</p></Link>
                <Link to="/user/wishlist" onClick={() => setIsOpen(false)}>My Wishlist<p>({data.theNumberOfProductInWishlist})</p></Link>
                <Link to="/user/profile" onClick={() => setIsOpen(false)}>My Profile</Link>
                <Link to="/user/cart" onClick={() => setIsOpen(false)}>Edit Profile</Link>
                <Link to="/help" onClick={() => setIsOpen(false)}>Help</Link>
                <Link to="/user/login" onClick={() => {logOutHandler(); setIsOpen(false)}}>Sign Out</Link>
            </div>
        </>
    );
}
