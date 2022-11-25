import actionTypes from './actionTypes';
import { getAllCodeService, creatNewUserService, getAllUsers, deleteUserService, editUserService } from '../../services/userService';
import { getRecentlyUsersService } from '../../services/appService';
import { creatNewSocials, getListSocials, deleteListSocials, editListSocials } from '../../services/adminMenuService';
import { creatNewBanks, getListBanks, deleteListBanks, editListBanks, } from '../../services/adminMenuService';
import { getSocials, deleteSocials } from '../../services/adminMenuService';
import { getBanks, deleteBanks } from '../../services/adminMenuService';
import { getEmails, deleteEmails } from '../../services/adminMenuService';
import { getPhones, deletePhones } from '../../services/adminMenuService';
import { getLocations, deleteLocations } from '../../services/adminMenuService';
import { getCustoms, deleteCustoms } from '../../services/adminMenuService';
import { toast } from "react-toastify";

// export const fetchSexStart = () => ({
//     type: actionTypes.FETCH_SEX_START
// })

export const fetchSexStart = () => {

    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_SEX_START });

            let res = await getAllCodeService("sex");
            if (res && res.errCode === 0) {
                dispatch(fetchSexSuccess(res.data));
            } else {
                dispatch(fetchSexFailed());
            }
        } catch (e) {
            dispatch(fetchSexFailed());
            console.log("fetchSexStart error", e);
        }
    }

}

export const fetchSexSuccess = (sexData) => ({
    type: actionTypes.FETCH_SEX_SUCCESS,
    data: sexData
})

export const fetchSexFailed = () => ({
    type: actionTypes.FETCH_SEX_FAILED
})


export const fetchVipStart = () => {

    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("VIP");
            if (res && res.errCode === 0) {
                dispatch(fetchVipSuccess(res.data));
            } else {
                dispatch(fetchVipFailed());
            }
        } catch (e) {
            dispatch(fetchVipFailed());
            console.log("fetchVipStart error", e);
        }
    }

}

export const fetchVipSuccess = (vipData) => ({
    type: actionTypes.FETCH_VIP_SUCCESS,
    data: vipData
})

export const fetchVipFailed = () => ({
    type: actionTypes.FETCH_VIP_FAILED
})

export const fetchRoleStart = () => {

    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("ROLE");
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            } else {
                dispatch(fetchRoleFailed());
            }
        } catch (e) {
            dispatch(fetchRoleFailed());
            console.log("fetchRoleStart error", e);
        }
    }

}

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED

})

export const creatNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await creatNewUserService(data);
            if (res && res.errCode === 0) {
                toast.success("Create a new user succeed!");
                dispatch(saveUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                dispatch(saveUserFailed());
            }
        } catch (e) {
            dispatch(saveUserFailed());
            console.log("fetchRoleStart error", e);
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREAT_USER_SUCCESS,
})

export const saveUserFailed = () => ({
    type: actionTypes.CREAT_USER_FAILED
})

export const fetchAllUsersStart = () => {

    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers('ALL');
            if (res && res.errCode === 0) {
                // reverse() dao nguoc mang
                dispatch(fetchAllUsersSuccess(res.users.reverse()));
            } else {
                dispatch(fetchAllUsersFailed());
            }
        } catch (e) {
            dispatch(fetchRoleFailed());
            console.log("fetchAllUsersStart error", e);
        }
    }

}

export const fetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data
})

export const fetchAllUsersFailed = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED
})

export const deleteUserStart = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId);
            if (res && res.errCode === 0) {
                toast.success("A User Is Deleted!");
                dispatch(deleteUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                dispatch(deleteUserFailed());
            }
        } catch (e) {
            dispatch(deleteUserFailed());
            console.log("fetchDeleteStart error", e);
        }
    }

}

export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS,
})

export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED
})

export const editUserStart = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            if (res && res.errCode === 0) {
                toast.success("A User Is Updated!");
                dispatch(editUserSuccess());
                dispatch(fetchAllUsersStart());
                dispatch(fetchRecentyUsersStart());
            } else {
                dispatch(editUserFailed());
            }
        } catch (e) {
            dispatch(editUserFailed());
            console.log("fetchEditStart error", e);
        }
    }

}

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS,
})

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED
})
// ACTION HOME
export const fetchRecentyUsersStart = (number) => {
    return async (dispatch, getState) => {
        try {
            let res = await getRecentlyUsersService(number);
            if (res && res.errCode === 0) {
                dispatch(fetchRecentyUsersSuccess(res.users));

            } else {
                dispatch(fetchRecentyUsersFailed());
            }
        } catch (e) {
            dispatch(fetchRecentyUsersFailed());
            console.log("fetchRecentyUsersStart error", e);
        }
    }
}

export const fetchRecentyUsersSuccess = (recentlyUserData) => ({
    type: actionTypes.FETCH_RECENTLY_USERS_SUCCESS,
    recentlyUserData: recentlyUserData
})

export const fetchRecentyUsersFailed = () => ({
    type: actionTypes.FETCH_RECENTLY_USERS_FAILED
})
// ACTION LIST SOCIAL
export const creatNewListSocialStart = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await creatNewSocials(data);
            if (res && res.errCode === 0) {
                toast.success("Create a Social succeed!");
                dispatch(creatNewListSocialSuccess());
                dispatch(fetchListSocialsStart());
            } else if (res && res.errCode === 1) {
                toast.error("Trùng khóa đại diện !");
                dispatch(creatNewListSocialFailed());
            }
            else {
                dispatch(creatNewListSocialFailed());
            }
        } catch (e) {
            dispatch(creatNewListSocialFailed());
            console.log("creatNewListSocialStart error", e);
        }
    }
}

export const creatNewListSocialSuccess = () => ({
    type: actionTypes.CREAT_LIST_SOCIALS_SUCCESS,
})

export const creatNewListSocialFailed = () => ({
    type: actionTypes.CREAT_LIST_SOCIALS_FAILED
})

export const fetchListSocialsStart = () => {

    return async (dispatch, getState) => {
        try {
            let res = await getListSocials();
            if (res && res.errCode === 0) {
                dispatch(fetchListSocialsSuccess(res.listSocials.reverse()));
            } else {
                dispatch(fetchListSocialsFailed());
            }
        } catch (e) {
            dispatch(fetchListSocialsFailed());
            console.log("fetchUsersStart error", e);
        }
    }

}

export const fetchListSocialsSuccess = (data) => ({
    type: actionTypes.FETCH_LIST_SOCIALS_SUCCESS,
    listSocials: data
})

export const fetchListSocialsFailed = () => ({
    type: actionTypes.FETCH_LIST_SOCIALS_FAILED
})

export const deleteListSocialsStart = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteListSocials(id);
            if (res && res.errCode === 0) {
                toast.success("A Social Is Deleted!");
                dispatch(deleteListSocialsSuccess());
                dispatch(fetchListSocialsStart());
            } else {
                dispatch(deleteListSocialsFailed());
            }
        } catch (e) {
            dispatch(deleteListSocialsFailed());
            console.log("fetchDeleteStart error", e);
        }
    }

}

export const deleteListSocialsSuccess = () => ({
    type: actionTypes.DELETE_LIST_SOCIALS_SUCCESS,
})

export const deleteListSocialsFailed = () => ({
    type: actionTypes.DELETE_LIST_SOCIALS_FAILED
})

export const editListSocialsStart = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editListSocials(data);
            if (res && res.errCode === 0) {
                toast.success("A Social Is Updated!");
                dispatch(editListSocialsSuccess());
                dispatch(fetchListSocialsStart());
            } else {
                dispatch(editListSocialsFailed());
            }
        } catch (e) {
            dispatch(editListSocialsFailed());
            console.log("editListSocialsFailed error", e);
        }
    }

}

export const editListSocialsSuccess = () => ({
    type: actionTypes.EDIT_LIST_SOCIALS_SUCCESS,
})

export const editListSocialsFailed = () => ({
    type: actionTypes.EDIT_LIST_SOCIALS_FAILED
})

// ACTION BANK SOCIAL

export const creatNewListBanksStart = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await creatNewBanks(data);
            if (res && res.errCode === 0) {
                toast.success("Create a Banks succeed!");
                dispatch(creatNewListBanksSuccess());
                dispatch(fetchListBanksStart());
            } else if (res && res.errCode === 1) {
                toast.error("Trùng khóa đại diện !");
                dispatch(creatNewListBanksFailed());
            }
            else {
                dispatch(creatNewListBanksFailed());
            }
        } catch (e) {
            dispatch(creatNewListBanksFailed());
            console.log("creatNewListBanksStart error", e);
        }
    }
}

export const creatNewListBanksSuccess = () => ({
    type: actionTypes.CREAT_LIST_BANKS_SUCCESS,
})

export const creatNewListBanksFailed = () => ({
    type: actionTypes.CREAT_LIST_BANKS_FAILED
})

export const fetchListBanksStart = () => {

    return async (dispatch, getState) => {
        try {
            let res = await getListBanks();
            if (res && res.errCode === 0) {
                dispatch(fetchListBanksSuccess(res.listBanks.reverse()));
            } else {
                dispatch(fetchListBanksFailed());
            }
        } catch (e) {
            dispatch(fetchListBanksFailed());
            console.log("fetchUsersStart error", e);
        }
    }

}

export const fetchListBanksSuccess = (data) => ({
    type: actionTypes.FETCH_LIST_BANKS_SUCCESS,
    listBanks: data
})

export const fetchListBanksFailed = () => ({
    type: actionTypes.FETCH_LIST_BANKS_FAILED
})

export const deleteListBanksStart = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteListBanks(id);
            if (res && res.errCode === 0) {
                toast.success("A Banks Is Deleted!");
                dispatch(deleteListBanksSuccess());
                dispatch(fetchListBanksStart());
            } else {
                dispatch(deleteListBanksFailed());
            }
        } catch (e) {
            dispatch(deleteListBanksFailed());
            console.log("fetchDeleteStart error", e);
        }
    }

}

export const deleteListBanksSuccess = () => ({
    type: actionTypes.DELETE_LIST_BANKS_SUCCESS,
})

export const deleteListBanksFailed = () => ({
    type: actionTypes.DELETE_LIST_BANKS_FAILED
})

export const editListBanksStart = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editListBanks(data);
            if (res && res.errCode === 0) {
                toast.success("A Banks Is Updated!");
                dispatch(editListBanksSuccess());
                dispatch(fetchListBanksStart());
            } else {
                dispatch(editListBanksFailed());
            }
        } catch (e) {
            dispatch(editListBanksFailed());
            console.log("editListBanksFailed error", e);
        }
    }

}

export const editListBanksSuccess = () => ({
    type: actionTypes.EDIT_LIST_BANKS_SUCCESS,
})

export const editListBanksFailed = () => ({
    type: actionTypes.EDIT_LIST_BANKS_FAILED
})
// ACTION SOCIALS

export const fetchSocialsStart = () => {

    return async (dispatch, getState) => {
        try {
            let res = await getSocials();
            if (res && res.errCode === 0) {
                dispatch(fetchSocialsSuccess(res.Socials.reverse()));
            } else {
                dispatch(fetchSocialsFailed());
            }
        } catch (e) {
            dispatch(fetchSocialsFailed());
            console.log("fetchUsersStart error", e);
        }
    }

}

export const fetchSocialsSuccess = (data) => ({
    type: actionTypes.FETCH_SOCIALS_SUCCESS,
    listBanks: data
})

export const fetchSocialsFailed = () => ({
    type: actionTypes.FETCH_SOCIALS_FAILED
})

export const deleteSocialsStart = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteSocials(id);
            if (res && res.errCode === 0) {
                toast.success("A Social Is Deleted!");
                dispatch(deleteSocialsSuccess());
                dispatch(fetchSocialsStart());
            } else {
                dispatch(deleteSocialsFailed());
            }
        } catch (e) {
            dispatch(deleteSocialsFailed());
            console.log("fetchDeleteStart error", e);
        }
    }

}
export const deleteSocialsSuccess = () => ({
    type: actionTypes.DELETE_SOCIALS_SUCCESS,
})

export const deleteSocialsFailed = () => ({
    type: actionTypes.DELETE_SOCIALS_FAILED
})
// ACTION BANKS

export const fetchBanksStart = () => {

    return async (dispatch, getState) => {
        try {
            let res = await getBanks();
            if (res && res.errCode === 0) {
                dispatch(fetchBanksSuccess(res.Banks.reverse()));
            } else {
                dispatch(fetchBanksFailed());
            }
        } catch (e) {
            dispatch(fetchBanksFailed());
            console.log("fetchBanksStart error", e);
        }
    }

}

export const fetchBanksSuccess = (data) => ({
    type: actionTypes.FETCH_BANKS_SUCCESS,
    listBanks: data
})

export const fetchBanksFailed = () => ({
    type: actionTypes.FETCH_BANKS_FAILED
})

export const deleteBanksStart = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteBanks(id);
            if (res && res.errCode === 0) {
                toast.success("A Social Is Deleted!");
                dispatch(deleteBanksSuccess());
                dispatch(fetchBanksStart());
            } else {
                dispatch(deleteBanksFailed());
            }
        } catch (e) {
            dispatch(deleteBanksFailed());
            console.log("fetchDeleteStart error", e);
        }
    }

}
export const deleteBanksSuccess = () => ({
    type: actionTypes.DELETE_BANKS_SUCCESS,
})


export const deleteBanksFailed = () => ({
    type: actionTypes.DELETE_BANKS_FAILED
})
// ACTION EMAILS

export const fetchEmailsStart = () => {

    return async (dispatch, getState) => {
        try {
            let res = await getEmails();
            if (res && res.errCode === 0) {
                dispatch(fetchEmailsSuccess(res.Emails.reverse()));
            } else {
                dispatch(fetchEmailsFailed());
            }
        } catch (e) {
            dispatch(fetchEmailsFailed());
            console.log("fetchEmailsStart error", e);
        }
    }

}

export const fetchEmailsSuccess = (data) => ({
    type: actionTypes.FETCH_EMAILS_SUCCESS,
    listEmails: data
})

export const fetchEmailsFailed = () => ({
    type: actionTypes.FETCH_EMAILS_FAILED
})

export const deleteEmailsStart = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteEmails(id);
            if (res && res.errCode === 0) {
                toast.success("A Email Is Deleted!");
                dispatch(deleteEmailsSuccess());
                dispatch(fetchEmailsStart());
            } else {
                dispatch(deleteEmailsFailed());
            }
        } catch (e) {
            dispatch(deleteEmailsFailed());
            console.log("fetchDeleteStart error", e);
        }
    }

}
export const deleteEmailsSuccess = () => ({
    type: actionTypes.DELETE_EMAILS_SUCCESS,
})

export const deleteEmailsFailed = () => ({
    type: actionTypes.DELETE_EMAILS_FAILED
})

// ACTION PHONES

export const fetchPhonesStart = () => {

    return async (dispatch, getState) => {
        try {
            let res = await getPhones();
            if (res && res.errCode === 0) {
                dispatch(fetchPhonesSuccess(res.Phones.reverse()));
            } else {
                dispatch(fetchPhonesFailed());
            }
        } catch (e) {
            dispatch(fetchPhonesFailed());
            console.log("fetchPhonesStart error", e);
        }
    }

}

export const fetchPhonesSuccess = (data) => ({
    type: actionTypes.FETCH_PHONES_SUCCESS,
    listPhones: data
})

export const fetchPhonesFailed = () => ({
    type: actionTypes.FETCH_PHONES_FAILED
})

export const deletePhonesStart = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await deletePhones(id);
            if (res && res.errCode === 0) {
                toast.success("A Phone Is Deleted!");
                dispatch(deletePhonesSuccess());
                dispatch(fetchPhonesStart());
            } else {
                dispatch(deletePhonesFailed());
            }
        } catch (e) {
            dispatch(deletePhonesFailed());
            console.log("fetchDeleteStart error", e);
        }
    }

}
export const deletePhonesSuccess = () => ({
    type: actionTypes.DELETE_PHONES_SUCCESS,
})

export const deletePhonesFailed = () => ({
    type: actionTypes.DELETE_PHONES_FAILED
})

// ACTION LOCATIONS

export const fetchLocationsStart = () => {

    return async (dispatch, getState) => {
        try {
            let res = await getLocations();
            if (res && res.errCode === 0) {
                dispatch(fetchLocationsSuccess(res.Locations.reverse()));
            } else {
                dispatch(fetchLocationsFailed());
            }
        } catch (e) {
            dispatch(fetchLocationsFailed());
            console.log("fetchLocationsStart error", e);
        }
    }

}

export const fetchLocationsSuccess = (data) => ({
    type: actionTypes.FETCH_LOCATIONS_SUCCESS,
    listLocations: data
})

export const fetchLocationsFailed = () => ({
    type: actionTypes.FETCH_LOCATIONS_FAILED
})

export const deleteLocationsStart = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteLocations(id);
            if (res && res.errCode === 0) {
                toast.success("A Location Is Deleted!");
                dispatch(deleteLocationsSuccess());
                dispatch(fetchLocationsStart());
            } else {
                dispatch(deleteLocationsFailed());
            }
        } catch (e) {
            dispatch(deleteLocationsFailed());
            console.log("fetchDeleteStart error", e);
        }
    }

}
export const deleteLocationsSuccess = () => ({
    type: actionTypes.DELETE_LOCATIONS_SUCCESS,
})

export const deleteLocationsFailed = () => ({
    type: actionTypes.DELETE_LOCATIONS_FAILED
})

// ACTION CUSTOMS

export const fetchCustomsStart = () => {

    return async (dispatch, getState) => {
        try {
            let res = await getCustoms();
            if (res && res.errCode === 0) {
                dispatch(fetchCustomsSuccess(res.Customs.reverse()));
            } else {
                dispatch(fetchCustomsFailed());
            }
        } catch (e) {
            dispatch(fetchCustomsFailed());
            console.log("fetchCustomsStart error", e);
        }
    }

}

export const fetchCustomsSuccess = (data) => ({
    type: actionTypes.FETCH_CUSTOMS_SUCCESS,
    listCustoms: data
})

export const fetchCustomsFailed = () => ({
    type: actionTypes.FETCH_CUSTOMS_FAILED
})

export const deleteCustomsStart = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteCustoms(id);
            if (res && res.errCode === 0) {
                toast.success("A Custom Is Deleted!");
                dispatch(deleteCustomsSuccess());
                dispatch(fetchCustomsStart());
            } else {
                dispatch(deleteCustomsFailed());
            }
        } catch (e) {
            dispatch(deleteCustomsFailed());
            console.log("fetchDeleteStart error", e);
        }
    }

}
export const deleteCustomsSuccess = () => ({
    type: actionTypes.DELETE_CUSTOMS_SUCCESS,
})

export const deleteCustomsFailed = () => ({
    type: actionTypes.DELETE_CUSTOMS_FAILED
})


