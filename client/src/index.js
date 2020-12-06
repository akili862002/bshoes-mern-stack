import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// redux
import { Provider } from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import reducer from './redux-handle/reducer';

let store = createStore(reducer,  /* preloadedState, */
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// store.subscribe(() => console.log(store.getState()));
console.log("[INFO] Hello there, good to see you here. This is my website which creates by MERN Stack + Firebase.")
console.log("Perhaps It still has bugs in somewhere.\nIf you see it, please contact to me by \nFacebook: https://www.facebook.com/rengar.the \nGmail: dung862002@gmail.com\n(You can see it in Footer)\nThank you!")
console.log("[NOTE] If you wanna use responsive tool in browser then please refresh the page after doing responsive!");

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

serviceWorker.unregister();
