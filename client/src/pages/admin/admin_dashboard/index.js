import React from 'react';
import "./index.css";
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {removeVietnameseTones} from '../../../backup';
import { Link } from 'react-router-dom';

import CreateNewProduct_icon from '../../../images/svg/dashboard/create-new-product.svg';
import ProductManager_icon from '../../../images/svg/dashboard/products-manager.svg';
import Boxes_icon from '../../../images/svg/dashboard/boxes.svg';
import Orders_icon from '../../../images/svg/dashboard/orders.svg';

export default function AdminDashboardPage() {
    let history = useHistory();

    let admin_auth = useSelector(state => state.admin_auth);
    // if (!isAuthenticated)
    //     // if this user is not a admin. He cannot access this site. move him to login admin
    //     history.push('/admin/login');
    let { isAuthenticated, admin } = admin_auth;

    if (!admin) {
        admin = {
            name: "there"
        }
    }

    let cards = [
        {
            image: CreateNewProduct_icon,
            name: "Create a new product",
            describe: "You can add a new product here",
            link: "/admin/dashboard/create-product"
        },
        {
            image: ProductManager_icon,
            name:"Manager products",
            describe: "You can change, update or delete any product here",
            link: "/admin/dashboard/products"
        },
        {
            image: Orders_icon,
            name:"Orders",
            describe: "You can get all orders from users here.",
            link: "/admin/dashboard/orders"
        },
        {
            image: Boxes_icon,
            name:"All products",
            describe: "It is page which can show all product in database.",
            link: "/admin/dashboard/all-products"
        }
    ]

    return (
        <div>
            <div className="admin-dashboard-page main">
                <div className="title">Hello {removeVietnameseTones(admin.name)}. Sir, What do you want to do today?</div>

                <div className="cards">
                    {
                        cards.map((card, i) => {
                            let { image, name, describe, link } = card;

                            return (
                                <Link to = {link} key={"item-select-dashboard-" + i}>
                                    <div className="card">
                                        <img src={image} alt=""/>
                                        <div className="texts">
                                            <h4 className="name">{name}</h4>
                                            <h6 className="describe">{describe}</h6>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}