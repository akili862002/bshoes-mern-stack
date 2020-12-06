import React, { useState, useEffect } from 'react';
import './styles/controller-board.css';
import './styles/products-display.css';
import axios from 'axios';
import MiniDirCurrentPageBar from '../../components/dir-current-page-bar/mini';
import NavBarSelection from '../../components/nav-bar/NavBarSelection';
import Footer from '../../components/Footer';
import Search_bar from './components/search-bar';

import Controller_Board from './components/controller-board';
import Products_Display from './components/products-display';
import {
    initial_filter_target_field,
    initial_search_target_field,
    filter_group
} from './consts';

export default function SearchPage({ match }) {
    let search_text = match.params.search_text;

    let [data, setData] = useState([]);
    let [isDataLoaded, setIsDataLoaded] = useState(false);
    let [currentPage, setCurrentPage] = useState(0);
    let [totalPage, setTotalPage] = useState(0);
    let [numberProductFound, setNumberProductFound] = useState(0);

    let [filter_target, set_filter_target] = useState(initial_filter_target_field);
    let [sort_target, set_sort_target] = useState(initial_search_target_field);
    let [displayMethod, setDisplayMethod] = useState({
        list: false,
        grid: true
    });
    
    useEffect(() => {
        // If user search another text, we need to reset all options and data to inital
        if (isDataLoaded) {
            setData([]);
            setIsDataLoaded(false);
            set_filter_target({...initial_filter_target_field});
            set_sort_target({...initial_search_target_field});
            setCurrentPage(0);
            setTotalPage(0);
        }
    }, [search_text]);

    // Filter_target change ---
    useEffect(() => {
        // // scroll to top whenever we select something

        setData([]);
        setIsDataLoaded(false);
        setNumberProductFound(0);

        // Get all filter targets are selecting
        let targets = [];
        for (let target of Object.keys(filter_target)){
            if (filter_target[target])
                targets.push(target);
        }
        for (let target of Object.keys(sort_target)){
            if (sort_target[target])
                targets.push(target);
        }
        // console.log(targets);

        let config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        let body = JSON.stringify({
            filterAndSortTargets: targets,
            currentPage: currentPage
        })

        axios.post('/api/products/search-detail/' + search_text, body, config)
            .then((res) => {
                // console.log('Data loaded!')
                // console.log(res.data);

                setData(res.data.dataOfCurrentPage);
                setIsDataLoaded(true);
                setTotalPage(res.data.totalPage);
                setNumberProductFound(res.data.totalProductFound);

                window.scrollTo(0, 0);
            })
            .catch(err => {
                setIsDataLoaded(true);
                try {
                    console.error(err.response.data);
                    console.error(err);
                } catch (error) {
                    console.error(err);
                }
            })
    }, [filter_target, sort_target, currentPage, search_text]);

    function switchFilterTarget(target) {
        let groups = ['star', 'color', 'typeShoes', 'price'];
        
        for (let group of groups) {
            if (filter_group[group].includes(target)) {
                for (let key of filter_group[group]) {
                    if (key !== target)
                        filter_target[key] = false;
                }
            }
        }
        
        filter_target[target] = !filter_target[target];
        set_filter_target({...filter_target});
    }

    function switchSortTarget(target) {
        for (let key of Object.keys(sort_target)) {
            sort_target[key] = false;
        }
        sort_target[target] = true;
        set_sort_target({...sort_target});
    }

    function switchDisplayMethod(method) {
        displayMethod = {
            list: false,
            grid: false
        }
        displayMethod[method] = true;
        setDisplayMethod(displayMethod);
    }

    function switchPageSelection(index) {
        setCurrentPage(index);
    }

    return (
        <React.Fragment >
            <NavBarSelection activeItem="Shoes"/>
            <div className="search-page main">
                <Search_bar />

                <MiniDirCurrentPageBar 
                    dir={[
                        { site: "Home", link: "/" },
                        { site: "Search", link: "#" },
                        { site: "Result", link: "#" }
                    ]}
                />

                <div className="main-board">
                    <Controller_Board 
                        filter_target={filter_target}
                        switchFilterTarget={switchFilterTarget}
                    />

                    <Products_Display 
                        data={data}
                        search_text={search_text}
                        sort_target={sort_target}
                        switchSortTarget={switchSortTarget}
                        displayMethod={displayMethod}
                        switchDisplayMethod={switchDisplayMethod}
                        isLoadingSearchResult = {!isDataLoaded}
                        currentPage = {currentPage}
                        totalPage = {totalPage}
                        switchPageSelection = {switchPageSelection}
                        numberProductFound={numberProductFound}
                    />
                </div>

            </div>
            <Footer />

        </React.Fragment>
    );
}