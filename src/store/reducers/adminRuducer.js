import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoadingSex: false,
    sexs: [],
    vips: [],
    roles: [],
    users: [],
    recentlyUserData: [],
    listSocials: [],
    listBanks: [],
    Socials: [],
    Banks: [],
    Emails: [],
    Phones: [],
    Locations: [],
    Customs: [],
    userInfo: []
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_SEX_START:
            state.isLoadingSex = true;
            return {
                ...state,
            }
        case actionTypes.FETCH_SEX_SUCCESS:
            state.sexs = action.data;
            state.isLoadingSex = false;
            return {
                ...state,
            }
        case actionTypes.FETCH_SEX_FAILED:
            state.isLoadingSex = false;
            state.sexs = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_VIP_SUCCESS:
            state.vips = action.data;
            return {
                ...state,
            }
        case actionTypes.FETCH_VIP_FAILED:
            state.vips = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ROLE_SUCCESS:
            state.roles = action.data;
            return {
                ...state,
            }
        case actionTypes.FETCH_ROLE_FAILED:
            state.roles = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            state.users = action.users;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_USERS_FAILED:
            state.users = [];
            return {
                ...state,
            }// REDUCER HOME
        case actionTypes.FETCH_RECENTLY_USERS_SUCCESS:
            state.recentlyUserData = action.recentlyUserData;
            return {
                ...state,
            }
        case actionTypes.FETCH_RECENTLY_USERS_FAILED:
            state.recentlyUserData = [];
            return {
                ...state,
            } // REDUCER LIST SOCIAL
        case actionTypes.FETCH_LIST_SOCIALS_SUCCESS:
            state.listSocials = action.listSocials;
            return {
                ...state,
            }
        case actionTypes.FETCH_LIST_SOCIALS_FAILED:
            state.listSocials = [];
            return {
                ...state,
            }// REDUCER LIST BANK
        case actionTypes.FETCH_LIST_BANKS_SUCCESS:
            state.listBanks = action.listBanks;
            return {
                ...state,
            }
        case actionTypes.FETCH_LIST_BANKS_FAILED:
            state.listBanks = [];
            return {
                ...state,
            }// REDUCER SOCIALS
        case actionTypes.FETCH_SOCIALS_SUCCESS:
            state.Socials = action.listBanks;
            return {
                ...state,
            }
        case actionTypes.FETCH_SOCIALS_FAILED:
            state.Socials = [];
            return {
                ...state,
            }// REDUCER BANKS
        case actionTypes.FETCH_BANKS_SUCCESS:
            state.Banks = action.listBanks;
            return {
                ...state,
            }
        case actionTypes.FETCH_BANKS_FAILED:
            state.Banks = [];
            return {
                ...state,
            }// REDUCER EMAILS
        case actionTypes.FETCH_EMAILS_SUCCESS:
            state.Emails = action.listEmails;
            // console.log("ok");
            return {
                ...state,
            }
        case actionTypes.FETCH_EMAILS_FAILED:
            state.Emails = [];
            return {
                ...state,
            }
        // REDUCER PHONES
        case actionTypes.FETCH_PHONES_SUCCESS:
            state.Phones = action.listPhones;
            // console.log("ok");
            return {
                ...state,
            }
        case actionTypes.FETCH_PHONES_FAILED:
            state.Phones = [];
            return {
                ...state,
            }
        // REDUCER LOCATIONS
        case actionTypes.FETCH_LOCATIONS_SUCCESS:
            state.Locations = action.listLocations;
            // console.log("ok");
            return {
                ...state,
            }
        case actionTypes.FETCH_LOCATIONS_FAILED:
            state.Locations = [];
            return {
                ...state,
            }
        // REDUCER CUSTOMS
        case actionTypes.FETCH_CUSTOMS_SUCCESS:
            state.Customs = action.listCustoms;
            // console.log("ok");
            return {
                ...state,
            }
        case actionTypes.FETCH_CUSTOMS_FAILED:
            state.Customs = [];
            return {
                ...state,
            }
        default:
            return state;
    }
}


export default adminReducer;