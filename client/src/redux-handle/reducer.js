import { combineReducers } from "redux";
import admin_auth from "./reducers/admin_auth";
import user_auth from "./reducers/user_auth";

export default combineReducers({
    admin_auth: admin_auth,
    user_auth: user_auth
});