import actionTypes from '../actions/actionTypes';

const initContentOfConfirmModal = {
    isOpen: false,
    messageId: "",
    handleFunc: null,
    dataFunc: null
}

const initialState = {
    isUser: false,
    isAdmin: false,
    userInfo: [],
}

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.USER_LOGIN_SUCCESS:
            if (action.userInfo.roleid === 'R1') {
                return {
                    ...state,
                    isAdmin: true,
                    isUser: true,
                    userInfo: action.userInfo,
                }
            } else {
                return {
                    ...state,
                    isUser: true,
                    isAdmin: false,
                    userInfo: action.userInfo,
                }
            }
        case actionTypes.USER_LOGIN_FAIL:
            return {
                ...state,
                isAdmin: false,
                isUser: false,
                userInfo: null
            }
        case actionTypes.PROCESS_LOGOUT:
            return {
                ...state,
                isAdmin: false,
                isUser: false,
                userInfo: null
            }
        case actionTypes.UPDATE_USER_INFO_LOCAL_SUCCESS:
            return {
                ...state,
                userInfo: action.newUserInfo,
            }
        default:
            return state;
    }
}

export default appReducer;