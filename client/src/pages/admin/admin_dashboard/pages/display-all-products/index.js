import React, {useState, useRef} from 'react';
import axios from 'axios';
import './index.css';
import RateStar from '../../../../../components/rate-star';
import Skeleton from 'react-loading-skeleton';
import { storage, firebase } from "../../../../../firebase";

import Copy_icon from '../../../../../images/img/copy.png';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

// CONSTS
let ASCENDING = 'Ascending';
let DESCENDING = 'Descending';
let DATE = 'Date';
let COST = 'Cost';
let DISCOUNT = 'Discount';
let STAR = 'Star';
let PEOPLE_RATE = 'People rate';
let GREETER_3_STAR = 'Greeter 3 star';
let GREETER_4_STAR = 'Greeter 4 star';
let MEN = 'Men';
let WOMEN = 'Women';

export default function AdminDisplayAllProductPage() {
    /* 
        To get all data from server we gonna need many Turn
        🔹 First Turn:
            we will get all id products from public database

        🔹 Second Turn: 
            we will load all information of each id product, 
            then render all item, show for user

        🔹 Third Turn:
            We get id_image of each product, then load preview-image-small-size of them
            if any image loaded, we will display it for admin view

        (+) Data structure
        {
            id_product: "",
            name: "",
            rate: {
                star: 3,
                NumberPeopleRate: 134
            },
            cost: {
                realCost: 145,
                discountPersent: 0.1,
                currentCost: 130.5
            },
            previewImage: IMG_1
        },...
    */
    let alert_ref = useRef();
    let [data, setData] = useState([]);
    let [dataDisplay, setDataDisplay] = useState([]);
    let { isDataReady } = useSelector(state => state.admin_auth);


    useEffect(() => {
        // First get all id_products, name, rate, images.preview.smallSize, cost
        let config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        let body = JSON.stringify({
            keys: [
                "id_product",
                "name",
                "rate",
                "images",
                "cost",
                "tags"
            ]
        });

        if (isDataReady)
            axios.post('/api/products/get-all-product-with-keys', body, config)
                .then( (res) => {
                    setData(res.data);
                })
                .catch((err) => {
                    console.error(err);
                })

    }, [isDataReady]);

    // Next step. When we got all data of products, we need to load all preview-image
    // useEffect(() => {
    //     if (data.length > 0) {
    //         for (let i = 0; i < data.length; i++) {

    //             let url_image = data[i].images.smallSize[0].url;


    //             let config = {
    //                 headers: {
    //                     "Access-Control-Allow-Headers": "Content-Type, Authorization",
    //                     "Access-Control-Allow-Origin": "*",
    //                     "Content-Type": "application/json",
    //                     "Access-Control-Allow-Credentials": "true"
    //                 }
    //             };

    //             let url = "https://firebasestorage.googleapis.com/v0/b/bshoes-2.appspot.com/o/002-fix.jpg?alt=media&token=bb87c3b5-556a-4034-a7b7-1446847b7a36"
                
    //             axios.get(url, config)
    //             .then((res) => {
    //                 let base64 = Buffer.from(res.data, 'binary').toString('base64');
    //                 data[i].previewImage = {
    //                     contentType: "image/jpeg",
    //                     base64: base64
    //                 }
    //                 setData([...data]);
    //             })
    //             .catch((err) => {
    //                 console.error(err);
    //             })

            // }
        // }
    // }, [data.length]);

    useEffect(() => {
        setDataDisplay(data);
    }, [data])

    let [sortType, setSortType] = useState('');  
    // option: 'ascending' || 'descending'
    let [sortTarget, setSortTarget] = useState('');  
    // target: 'date' || 'cost' || 'star' || 'people-rate'

    let [filterTarget, setFilterTarget] = useState('');  
    // target: GREETER_3_STAR || GREETER_4_STAR || MEN || WOMEN

    let [alertMessege, setAlertMessege] = useState('');

    // Sort/Filter when admin select a option
    useEffect(() => {

        // Filter --------------------
        // copy object
        let dataResult = JSON.parse(JSON.stringify(data));

        switch (filterTarget) {
            case GREETER_3_STAR: 
                dataResult = data.filter((product) => product.rate.star >= 3);
                break;

            case GREETER_4_STAR: 
                dataResult = data.filter((product) => product.rate.star >= 4);
                break;

            case MEN: 
                dataResult = data.filter((product) => {
                    let tags = product.tags;
                    if (tags.includes('women') || tags.includes('woman'))
                        return false;
                    return true;
                });
                break;

            case WOMEN: 
                dataResult = data.filter((product) => {
                    let tags = product.tags;
                    if (tags.includes('women') || tags.includes('woman'))
                        return true;
                    return false;
                });
        }

        // Sort --------------------
        switch (sortTarget) {

            case COST: 
                if (sortType === ASCENDING){
                    console.log('sort ...');
                    dataResult = dataResult.sort((a,b) => (a.cost.currentCost - b.cost.currentCost));}
                else if (sortType === DESCENDING)
                    dataResult = dataResult.sort((a,b) => (b.cost.currentCost - a.cost.currentCost));
                break;

            case DISCOUNT: 
                if (sortType === ASCENDING){
                    console.log('sort ...');
                    dataResult = dataResult.sort((a,b) => (a.cost.discountPersent - b.cost.discountPersent));}
                else if (sortType === DESCENDING)
                    dataResult = dataResult.sort((a,b) => (b.cost.discountPersent - a.cost.discountPersent));
                break;

            case STAR: 
                if (sortType === ASCENDING)
                    dataResult = dataResult.sort((a,b) => (a.rate.star - b.rate.star));
                else if (sortType === DESCENDING)
                    dataResult = dataResult.sort((a,b) => (b.rate.star - a.rate.star));
                break;

            case PEOPLE_RATE: 
                if (sortType === ASCENDING)
                    dataResult = dataResult.sort((a,b) => (a.rate.NumberPeopleRate - b.rate.NumberPeopleRate));
                else if (sortType === DESCENDING)
                    dataResult = dataResult.sort((a,b) => (b.rate.NumberPeopleRate - a.rate.NumberPeopleRate));
        }


        setDataDisplay(dataResult);

    }, [sortType, sortTarget, filterTarget])

    function isCheckedSortType(option) {
        if (sortType === option)
            return true;
        return false;
    }

    function isCheckedSortTarget(target) {
        if (sortTarget === target)
            return true;
        return false;
    }

    function isCheckedFilterTarget(target) {
        if (filterTarget === target)
            return true;
        return false;
    }


    function Sort_type_checkbox({ typeSort }) {
        return (
            <div className="checkbox item">
                <input type="checkbox" checked={isCheckedSortType(typeSort)} id={typeSort} className="circle"
                    onClick={() => setSortType(typeSort)}
                />
                <label htmlFor={typeSort}>{typeSort}</label>
            </div>
        );
    }
    function Sort_target_checkbox({ target }) {
        return (
            <div className="checkbox item">
                <input type="checkbox" id={target}
                    checked={isCheckedSortTarget(target)} 
                    onClick={() => {setSortTarget(target)}}
                />
                <label htmlFor={target}>{target}</label>
            </div>
        );
    }
    function Filter_target_checkbox({ target }) {
        return (
            <div className="checkbox item">
                <input type="checkbox" id={target}
                    checked={isCheckedFilterTarget(target)} 
                    onClick={() => {setFilterTarget(target)}}
                />
                <label htmlFor={target}>{target}</label>
            </div>
        );
    }

    let closeAlert;
    function Alert(msg, time=1000, type="normal") {
        alert_ref.current.classList.remove('open');
        setAlertMessege(msg);
        alert_ref.current.classList.add('open');
        clearTimeout(closeAlert);

        closeAlert = setTimeout(() => {
            alert_ref.current.classList.remove('open');
        }, time);
    }

    return (
        <div className="display-all-products-page main">
            <div className="position-page">
                <h3>Home | Dashboard | All-products</h3>
            </div>
            
            <div className="options">
                <div className="sort-by-checkboxs">
                    <div className="title">Sort By</div>
                    <div className="items">
                        <div className="types-sort">
                            <Sort_type_checkbox typeSort={ASCENDING}/>
                            <Sort_type_checkbox typeSort={DESCENDING}/>
                        </div>

                        <div className="line"/>

                        <div className="targets-sort">
                            <Sort_target_checkbox target={COST} />
                            <Sort_target_checkbox target={DISCOUNT} />
                            <Sort_target_checkbox target={STAR} />
                            <Sort_target_checkbox target={PEOPLE_RATE} />
                            <Sort_target_checkbox target={DATE} />
                        </div>
                    </div>
                </div>

                <div className="filter-by-checkboxs">
                    <div className="title">Filter By</div>
                    <div className="items">
                        <Filter_target_checkbox target={GREETER_3_STAR}/>
                        <Filter_target_checkbox target={GREETER_4_STAR}/>
                        <Filter_target_checkbox target={MEN}/>
                        <Filter_target_checkbox target={WOMEN}/>
                    </div>
                </div>

            </div>

            <div className="products-list">
                <div className="title">Products ({data.length})</div>
                <div className="line" />
                {
                    dataDisplay.map((product, i) => {
                        let {id_product, previewImage, name, cost, rate, images} = product;

                        function copy_id_product() {
                            var textField = document.createElement('textarea');
                            textField.innerText = id_product;
                            document.body.appendChild(textField);
                            textField.select();
                            document.execCommand('copy');
                            textField.remove();

                            Alert('Copied');
                        }

                        let url = "";
                        if (images) {
                            // url = JSON.stringify(images.smallSize[0].url).replace("URL: ", "");
                            url = images.smallSize[0].url.replace("URL:", '');
                        }

                        return (
                            <div className="product" key={'db-doq' + i}>
                                <div className="image">
                                    {/* {
                                        previewImage ? 
                                            <img src={`data:${previewImage.image.contentType};base64,${previewImage.image.base64}`}  alt=""/>
                                        :   <Skeleton width="100px" height="100px"/>
                                    } */}
                                    <img src={url} 
                                        onLoad={() => console.log('loading...')}
                                    />
                                </div>

                                <div className="information">
                                    <p className="name">{name}</p>
                                    <div className="rate">
                                        <RateStar 
                                            numberStar={rate.star} 
                                            sizeEachStar="12px"
                                        />
                                        <h4>({rate.NumberPeopleRate})</h4>
                                    </div>
                                    <div className="cost">
                                        <p className="current-cost">${cost.currentCost}</p>
                                        <p className="real-cost">{cost.discountPersent > 0 && '$' + cost.realCost}</p>
                                        <p className="discount">{cost.discountPersent > 0 && `(-${cost.discountPersent*100}%)`}</p>
                                    </div>

                                    <div className="id-product">
                                        ID: <p className="id-product" onClick={copy_id_product}>{id_product}</p>
                                        <img src={Copy_icon} className="icon" onClick={copy_id_product}/>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>

            <div className="alert" ref={alert_ref}>{alertMessege}</div>
        </div>
    )
}

