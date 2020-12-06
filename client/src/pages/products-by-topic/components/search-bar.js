import React, {useState, useRef} from 'react';
import '../styles/search_bar.css';
import axios from 'axios';
import Search_icon from '../../../images/svg/search.svg';
import { useHistory, Link } from 'react-router-dom';
import parse from 'html-react-parser';
import { useEffect } from 'react';

export default function Search_bar() {
    let [widthScreen, setWidthScreen] = useState(window.innerWidth);
    useEffect(() => {
        window.addEventListener('resize', () => {
            setWidthScreen(window.innerWidth);
        })
    }, []);

    let history = useHistory();
    let [suggestions, setSuggestions] = useState([]);
    let [data, setData] = useState([]);
    let [text_search, set_text_search] = useState('');
    let suggestionsContainerRef = useRef();

    if (widthScreen > 740)
        return null;

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
            if (suggestionsContainerRef.current)
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

    function userPressedEnterHandler(e) {
        if (e.key == 'Enter' && text_search.length > 0) {
            suggestionsContainerRef.current.style.display = "none";
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
