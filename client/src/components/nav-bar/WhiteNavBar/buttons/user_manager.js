import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeVietnameseTones } from '../../../../backup';
import User_icon_image from '../../../../images/img/user.png';
import User_icon from '../../../../images/img/user_icon.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

export default function UserManager_button({ user }) {
    let dispatch = useDispatch();

    let data = {
        name: "",
        email: "",
        avatar: {
            type_avatar: "NONE"
        },
        theNumberOfProductInCart: 0,
        theNumberOfProductInWishlist: 0
    }

    if (user) { // if user was loaded
        let { email } = user;
        if (email) {
            // we check that, is this email of google or not
            // if yes, remove "-google_oauth" from current email
            // "-google_oauth" is a path of email to make sure that we won't get wrong email
            //   with email user register
            email = email.replace('-google_oauth', '');
            email = email.replace('facebook-oauth-login-api', '');
        } else {
            // user don't have any email, mean this account is facebook account
            email = '';
        }

        // update user data
        data = {
            name: user.name,
            email: email,
            avatar: user.avatar,
            theNumberOfProductInCart: user.cart.products.length,
            theNumberOfProductInWishlist: user.wishlist.products.length
        };

    }

    function logOutHandler() {
        dispatch({
            type: "USER_LOG_OUT"
        });
    }

    // console.log(data.avatar);

    return (
        <div className="button dropdown">
            <div className="drop-btn">
                {
                    data.avatar.type_avatar === "NONE" ?
                        <img src={User_icon} className="icon"/>
                        : <img src={data.avatar.url} className="avatar-small"/>
                }
                <h4>My Account</h4>
            </div>
            <div className="dropdown-list">
                <User_infor 
                    avatar = { data.avatar }
                    name = { data.name }
                    email = { data.email }
                />
                <div className="line" />

                <Link to="/user/cart" className="drop-item">My Cart<p>({data.theNumberOfProductInCart})</p></Link>
                <Link to="/user/wishlist" className="drop-item">My Wishlist<p>({data.theNumberOfProductInWishlist})</p></Link>
                <Link to="/user/profile" className="drop-item">My Profile</Link>
                <Link to="/user/cart" className="drop-item">Edit Profile</Link>
                <div className="line" />  {/* --------- */}
                <Link to="/help" className="drop-item">Help</Link>
                <Link to="/user/login" className="drop-item" onClick={logOutHandler}>Sign Out</Link>
            </div>
        </div>
    );
}

function User_infor({ avatar, name, email }) {
    let [isAvatarImageLoaded, setIsAvatarImagesLoaded] = useState(false);
    let image;
    if (avatar.type_avatar === "NONE") {
        image = User_icon_image;
    } else {
        image = avatar.url
    }

    return (
        <div className="user-infor">
            <img src={image} 
                onLoad={() => setIsAvatarImagesLoaded(true)}
            />
            { !isAvatarImageLoaded && 
                <Skeleton 
                    circle={true} 
                    width="37px"
                    height="37px"
                />
            }
            <div className="texts">
                <p className="name">{removeVietnameseTones(name)}</p>
                {email !== "" && (<p className="email">{email}</p>)}
            </div>
        </div>
    );
}