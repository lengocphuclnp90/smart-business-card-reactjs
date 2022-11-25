import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";
import { path } from '../utils'
const locationHelper = locationHelperBuilder({});

export const userIsAuthenticated = connectedRouterRedirect({
    authenticatedSelector: state => state.user.isAdmin,
    wrapperDisplayName: 'UserIsAuthenticated',
    redirectPath: '/admin-login'
});

export const userIsNotAuthenticated = connectedRouterRedirect({
    // Want to redirect the user when they are authenticated
    authenticatedSelector: state => !state.user.isAdmin,
    wrapperDisplayName: 'UserIsNotAuthenticated',
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/system',
    allowRedirectBack: false
});

export const IsSignIn = connectedRouterRedirect({
    authenticatedSelector: state => state.user.isUser === false,
    wrapperDisplayName: 'IsUser',
    redirectPath: '' || path.USER_MANAGER,
    allowRedirectBack: false
});

export const IsUser = connectedRouterRedirect({
    // kiem tra xem co isUser bang true ko. 
    // Neu co thi cho chuyen huong den componet truyen vao.
    // Neu khong co thi chuyen den /login
    authenticatedSelector: state => state.user.isUser === true,
    wrapperDisplayName: 'IsUser',
    redirectPath: '/login',
});
