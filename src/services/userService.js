import axios from '../axios';

const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword });
}

const getAllUsers = (inputId) => {
    return axios.get(`./api/get-all-users?id=${inputId}`, { id: inputId })
}

const creatNewUserService = (data) => {
    return axios.post('/api/creat-new-user', data);
}

const deleteUserService = (userId) => {
    return axios.delete('/api/delete-user',
        {
            data: {
                id: userId
            }
        });
}
const editUserService = (inputData) => {
    return axios.put('/api/edit-user', inputData);
}

const getAllCodeService = (inputType) => {
    return axios.get(`./api/allcodes?type=${inputType}`, { type: inputType })
}
// USER MANAGER
const updateProfileService = (newUserInfo) => {
    // gửi data mới đi, và nhận về data đã update
    return axios.post('/api/user/update-Profile', newUserInfo);
}
const updateInfoService = (newInfo) => {
    // gửi data mới đi, và nhận về data đã update
    return axios.post('/api/user/update-info', newInfo);
}

const getListService = (type) => {
    return axios.post('/api/user/get-list', type);
}

const getProfile = (data) => {
    return axios.post('/api/user/get-profile', data);
}
const getCard = (data) => {
    return axios.post('/api/user/get-card', data);
}

const viewItem = (data) => {
    return axios.post('/api/user/view-item', data);
}

const getViewer = (data) => {
    return axios.post('/api/user/get-viewer', data);
}

const getHistory = (data) => {
    return axios.post('/api/user/get-history', data);
}

const sendEmailS3 = (data) => {
    return axios.post('/api/user/send-email-S3', data);
}
const checkStatusS3 = (data) => {
    return axios.post('/api/user/check-Status-S3', data);
}
const setSchedule = (data) => {
    return axios.post('/api/user/set-schedule', data);
}
const getSchedule = (data) => {
    return axios.post('/api/user/get-schedule', data);
}
const getScheduleManage = (data) => {
    return axios.post('/api/user/get-schedule-manage', data);
}
const getNews = (data) => {
    return axios.post('/api/user/get-news', data);
}
const setLanguage = (data) => {
    return axios.post('/api/user/set-Language', data);
}
const signUp = (data) => {
    return axios.post('/api/user/sign-Up', data);
}
const forget = (data) => {
    return axios.post('/api/user/forget', data);
}
export {
    handleLoginApi,
    getAllUsers,
    creatNewUserService,
    deleteUserService,
    editUserService,
    getAllCodeService,
    updateProfileService,
    updateInfoService,
    getListService,
    getProfile,
    viewItem,
    getViewer,
    getHistory,
    getCard,
    sendEmailS3,
    checkStatusS3,
    setSchedule,
    getSchedule,
    getScheduleManage,
    getNews,
    setLanguage,
    signUp,
    forget
};
