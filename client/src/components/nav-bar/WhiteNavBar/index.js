import React, {useRef, useState} from 'react';
import "./index.css";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import parse from 'html-react-parser';

import Shoes_image_logo from '../../../images/img/Shoes_logo.png';
import Search_icon from '../../../images/svg/search.svg';

import SignInOrRegister_button from './buttons/log-in-register';
import MyCart_button from './buttons/my_cart';
import MyWishlist_button from './buttons/my_wishlist';
import UserManager_button from './buttons/user_manager';


export default function WhiteNavBar() {
    let { isAuthenticated, isDataReady, user } = useSelector(state => state.user_auth);
    // isAuthenticated = true;

    return (
        <nav className="white-nav-bar-container">
            <Link to="/">
                <div className="logo-container">
                    <img src={Shoes_image_logo} />
                    <h2>BShoes</h2>
                </div>
            </Link>

            <Search_bar />

            <div className="buttons">
                { isAuthenticated ?
                    <ButtonsWithAuth 
                        isDataReady={isDataReady}
                        user = {user}
                    /> 
                    : <ButtonsWithoutAuth />
                }
            </div>
            
        </nav>
    );
}

function ButtonsWithoutAuth() {

    return (
        < >
            <SignInOrRegister_button />
            <MyCart_button cart={[]} isAuthenticated={false}/>
        </>
    );
}

function ButtonsWithAuth({ isDataReady, user }) {

    let cart = [];
    let wishlist = [];

    if (isDataReady) { // when data of user was Loaded
        // updata cart and wishlish
        cart = user.cart;
        wishlist = user.wishlist;
    }

    return (
        < >
            <MyWishlist_button wishlist={wishlist}/>
            <MyCart_button cart={cart} isAuthenticated={true}/>
            <UserManager_button user={user} />
        </>
    );
}

function getAutoCompleteItems(input, data, max_suggested_item) {
    if (input.length == 0)
        return [];

    var listItems = [];
    input = input.toLowerCase();
	for (let i = 0; i < data.length; i++) {
        let trademark = data[i].trademark.replaceAll(' ', '-');
        let text = (data[i].name + ' ' + trademark).toLowerCase();
        let score = 0;
        let words = text.split(' ')

		if ( words.includes(input) ) {
            score += 10;
        }
        
        // check that this input_text is head of text
		if ( input == text.substr(0, input.length) ) {
            score += 5;
        }

        // check that is current input in head of each word of text
        for (let word of words) {
            if ( input == word.substr(0, input.length) ) {
                score += 3;
            }
        }

        data[i].score = score;
        
        if (score > 0)
            listItems.push(data[i]);
    }
    
    listItems.sort((a, b) => b.score - a.score);

    listItems = listItems.slice(0, max_suggested_item);

	return listItems;
}

function Search_bar() {
    let history = useHistory();
    let [suggestions, setSuggestions] = useState([]);
    let [data, setData] = useState([]);
    let [text_search, set_text_search] = useState('');
    let suggestionsContainerRef = useRef();

    function focusHandler() {
        if (suggestions.length > 0)
            suggestionsContainerRef.current.style.display = "block";
        // Fetch list of all data with 
        /* 
            {
                name: String,
                trademark: String,
                id_products: String
            }
        */
        if (data.length == 0) {
            axios.get('/api/public/name-products')
            .then(res => {
                setData(res.data);
            })
            .catch(err => {
                console.error(err);
            })
        }
    }

    function blurHandler() {
        setTimeout(() => {
            suggestionsContainerRef.current.style.display = "none";
        }, 100);
    }

    async function onChangeInputHandler(e) {
        let text_input = e.target.value;
        let list_suggestion = await getAutoCompleteItems(text_input, data, 8);
        setSuggestions(list_suggestion);
        set_text_search(text_input);

        if (list_suggestion.length > 0)
            suggestionsContainerRef.current.style.display = "block";
        else
            suggestionsContainerRef.current.style.display = "none";
    }

    function blurAll(){
        var tmp = document.createElement("input");
        document.body.appendChild(tmp);
        tmp.focus();
        document.body.removeChild(tmp);
    }

    function userPressedEnterHandler(e) {
        if (e.key == 'Enter' && text_search.length > 0) {
            suggestionsContainerRef.current.style.display = "none";
            blurAll();
            history.push('/search/' + text_search);
        }
    }

    return (
        <div className="search-container">
            <img src={Search_icon} />
            <input 
                type="text" 
                placeholder="Search your shoes" 
                spellCheck="false"
                onFocus={focusHandler}
                onBlur={blurHandler}
                onChange={onChangeInputHandler}
                onKeyDown={userPressedEnterHandler}
            />
            <div className="suggestions-container" ref={suggestionsContainerRef}>
                {
                    suggestions.map((item, i) => {
                        let name = item.name;
                        let nameWithLowerCase = name.toLowerCase();
                        let startIndex = nameWithLowerCase.indexOf(text_search);
                        let endIndex  = startIndex + text_search.length;
                        let strongText = name.slice(startIndex, endIndex);

                        name = parse(name.replaceAll(strongText, `<strong>${strongText}</strong>`));

                        return (
                            <Link to={"/products/product-detail/" + item.id_product}
                                key = {'item-of-suggestion-' + i}
                            >
                                <div className="suggestion-item">
                                    <p className="name">{name}</p>
                                    <p className="trademark">{item.trademark}</p>
                                </div>
                            </Link>
                        );
                    })
                }
            </div>
        </div>
    );
}

