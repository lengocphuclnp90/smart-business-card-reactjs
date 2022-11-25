import actionTypes from './actionTypes';
import { toast } from "react-toastify";
import { updateProfileService } from '../../services/userService';

export const addUserSuccess = () => ({
    type: actionTypes.ADD_USER_SUCCESS
})

export const userLoginSuccess = (userInfo) => ({
    type: actionTypes.USER_LOGIN_SUCCESS,
    userInfo: userInfo
})

export const userLoginFail = () => ({
    type: actionTypes.USER_LOGIN_FAIL
})

export const processLogout = () => ({
    type: actionTypes.PROCESS_LOGOUT
})

export const updateUserInfoLocalSuccess = (newUserInfo) => ({
    type: actionTypes.UPDATE_USER_INFO_LOCAL_SUCCESS,
    newUserInfo: newUserInfo
})

export const updateProfile = (newUserInfo) => {
    return async (dispatch, getState) => {
        try {
            let newUserInfoFromServer = await updateProfileService(newUserInfo);
            if (newUserInfoFromServer) {
                dispatch(updateUserInfoLocalSuccess(newUserInfoFromServer));
            } else {
                toast.error("Cập nhật thông tin thất bại !");
                console.log("updateHideProfile error: 1");
            }
        } catch (e) {
            console.log("updateHideProfile error: 2", e);
        }
    }

}