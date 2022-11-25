import axios from '../axios';

const getRecentlyUsersService = (limit) => {
    return axios.get(`/api/recently-users?limit=${limit}`);
}

export {
    getRecentlyUsersService
};
