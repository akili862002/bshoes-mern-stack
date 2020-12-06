import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./index.css";
import DirCurrentPageBar from '../../components/dir-current-page-bar';
import {ReactComponent as Trademark_icon} from '../../images/svg/trademark.svg';
import NavBarSelection from '../../components/nav-bar/NavBarSelection';
import { getIndexOfItemInArrayHaveSameSubObj } from '../../backup';
import { Link } from 'react-router-dom';
import CircleLoading from '../../components/circle-loading';
import Footer from '../../components/Footer';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function TrademarksPage() {
    let [trademarks, setTrademarks] = useState([]);
    let [data, setData] = useState([]);
    let [isDataLoaded, setIsDataLoaded] = useState(false);

    // First step, load all trademarks and list id_products of each trademark
    useEffect(() => {
        
        axios.get("/api/public/trademarks")
            .then(res => {
                // console.log(res.data);
                setTrademarks(res.data);

                // filter data to prepare for display
                for (let i = 0; i < res.data.length; i ++) {
                    let item = res.data[i];
                    let obj = { 
                        trademark: item.trademark,
                        numberProducts: item.id_products.length,
                        products: []
                    }
                    // we will push maximum 3 product to participate for this trademark
                    for (let j = 0; j < 3; j ++) {
                        if (j < item.id_products.length)
                            obj.products.push({ 
                                id_product: item.id_products[j]
                            })
                        else {
                            break;
                        }
                    }

                    data.push(obj);
                }

                // console.log('data: ', data);

                setData([...data]);
            })
            .catch(err => {
                console.error(err);
            })
    }, []);

    // Second step, load product to get image of them
    // each trademark, we will get 3 image to show
    useEffect(() => {
        if (data.length > 0 && !isDataLoaded) {
            window.scrollTo(0, 0);

            let config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            let id_products = [];
            for (let i = 0; i < trademarks.length; i++) {
                id_products = [...id_products, ...trademarks[i].id_products.splice(0, 3)];
            }
    
            let body = JSON.stringify({
                id_products,
                selections: ['images', 'id_product']
            })

            // console.log('Fetch data...');

            axios.post("/api/products/get-products-with-property-by-list-id-product", body, config)
                .then(res => {
                    let products = res.data;

                    for (let i = 0; i < data.length; i++) {
                        // update all product in data
                        for (let j = 0; j < data[i].products.length; j++) {
                            let { id_product } = data[i].products[j];
                            let index = getIndexOfItemInArrayHaveSameSubObj({ id_product }, products);
                            data[i].products[j].image_url = products[index].images.smallSize[0].url;
                        }
                    }
                    // console.log("Finnal Data: \n", data);


                    setIsDataLoaded(true);
                })
                .catch(err => {
                    console.error(err);
                })
        }
    }, [trademarks]); 

    return (
        <React.Fragment >
            <NavBarSelection 
                activeItem = "Trademarks"
            />
            <DirCurrentPageBar 
                dir = {[
                    {site: "Home", link: "/"},
                    {site: "Products", link: "#"},
                    {site: "Trademarks", link: "#"}
                ]}
                titlePage = {{
                    Icon: Trademark_icon,
                    name: "Trademarks"
                }}
            />
            <div className="trademarks-page main">
                { data.length === 0 && <CircleLoading/> }
                {
                    data.map((item) => {
                        let {products, numberProducts, trademark} = item;
                        let list_image_url = products.map((product) => product.image_url);
                        // console.log(list_image_url);
                        let ClassNames = {
                            imagesContainer: list_image_url.length > 1 ? "images-container grid" : "images-container single"
                        }

                        return (
                            <Link to={"/search/" + trademark.replace(/ /g, '-')} key={trademark} >
                                <div className="trademark-card" >
                                    <div className={ClassNames.imagesContainer}>
                                        {
                                            list_image_url.map((image_url, i) => {
                                                return (
                                                    <div className="image" key={"img-i+" + i}>
                                                        {   image_url &&
                                                                <LazyLoadImage 
                                                                    src={image_url.replace("URL:", "")}
                                                                    alt={trademark}
                                                                    key={'img-i-' + i + trademark}
                                                                />
                                                        }
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>

                                    <div className="texts">
                                        <div className="trademark">{trademark}</div>
                                        <p className="number-products">{numberProducts + " products"}</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                }
            </div>
            <Footer />
        </React.Fragment>
    );
}