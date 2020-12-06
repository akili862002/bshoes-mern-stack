import React, {useEffect} from 'react';
// components
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import PrivateRoute from './components/private-route';
import { loadUser } from './redux-handle/actions/user/load_data';
import { useDispatch, useSelector } from 'react-redux';

import HomePage from './pages/home/HomePage';
import UserLogInPage from './pages/user/user_login_page';
import UserRegisterPage from './pages/user/user_register_page';
import UserShoppingCartPage from './pages/user/shopping_cart_page';
import WishlistPage from './pages/user/wishlist_page';
import FillAddressInCheckoutProcess from './pages/user/checkout_process/fill-address';
import PaymentInCheckoutProcess from './pages/user/checkout_process/payment';
import ProductDetailPage from './pages/productDetail';
import SearchPage from './pages/search';
import TrademarksPage from './pages/trademarks';
import ProductsByTopicPage from './pages/products-by-topic';
import ProductsByEventPage from './pages/products-by-event';
import NotFoundPage from './pages/not_found_page';

import AdminDashboardPage from './pages/admin/admin_dashboard';
import AdminLogInPage from './pages/admin/admin_login_page';
import AdminRegisterPage from './pages/admin/admin_register_page';
import AdminCreateProductPage from './pages/admin/admin_dashboard/pages/create-product-page';
import AdminDisplayAllProductPage from './pages/admin/admin_dashboard/pages/display-all-products';


import WhiteNavBar from './components/nav-bar/WhiteNavBar';
import Hamburger_nav from './components/nav-bar/Hamburger-nav';
import { loadAdmin } from './redux-handle/actions/admin/auth';

function App() {

    let dispatch = useDispatch();
    // every time we reload the page, it gonna get user data from server!
    useEffect(() => {
        loadUser(dispatch);
        // loadAdmin(dispatch);
    }, []);

    return (
        <div className="App">
            <Router>

                <WhiteNavBar />
                <Hamburger_nav />

                <Switch>
                    <Route path='/' exact component={HomePage} />

                    {/* User - pages */}
                    <Route path='/user/login' exact component={UserLogInPage} />
                    <Route path='/user/register' exact component={UserRegisterPage} />
                    <PrivateRoute path='/user/cart' exact component={UserShoppingCartPage} />
                    <PrivateRoute path='/user/wishlist' exact component={WishlistPage} />
                    <PrivateRoute path='/user/cart/checkout/process/address' exact component={FillAddressInCheckoutProcess} />
                    <PrivateRoute path='/user/cart/checkout/process/payment' exact component={PaymentInCheckoutProcess} />
                    <Route path='/products/product-detail/:id_product' exact component={ProductDetailPage} />
                    <Route path='/products/trademarks' exact component={TrademarksPage} />
                    <Route path='/search/:search_text' exact component={SearchPage} />
                    <Route path='/products/topic/:topic' exact component={ProductsByTopicPage} />
                    <Route path='/products/event/:event' exact component={ProductsByEventPage} />

                    {/* admin - pages */}
                    <Route path='/admin/login' exact component={AdminLogInPage} />
                    <Route path='/admin/register' exact component={AdminRegisterPage} />
                    <Route path='/admin/dashboard' exact component={AdminDashboardPage} />
                    <Route path='/admin/dashboard/create-product' exact component={AdminCreateProductPage} />
                    <Route path='/admin/dashboard/all-products' exact component={AdminDisplayAllProductPage} />

                    <Route path='*' exact component={NotFoundPage} />
                    <Redirect from="/home" to ="/" />
                </Switch>

            </Router>
        </div>
    );
}

export default App;