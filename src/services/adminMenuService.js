import axios from '../axios';

const creatNewSocials = (data) => {
    return axios.post('/api/admin/creat-new-social', data);
}
const getListSocials = () => {
    return axios.get('/api/admin/get-list-social');
}
const deleteListSocials = (id) => {
    return axios.delete('/api/admin/delete-list-social',
        {
            data: {
                id: id
            }
        });
}
const editListSocials = (data) => {
    return axios.put('/api/admin/update-list-social', data);
}

// BANK ACTION
const creatNewBanks = (data) => {
    return axios.post('/api/admin/creat-new-bank', data);
}

const getListBanks = () => {
    return axios.get('/api/admin/get-list-bank');
}

const deleteListBanks = (id) => {
    return axios.delete('/api/admin/delete-list-bank',
        {
            data: {
                id: id
            }
        });
}
const editListBanks = (data) => {
    return axios.put('/api/admin/update-list-bank', data);
}

const getSocials = () => {
    return axios.get('/api/admin/get-Socials');
}
const deleteSocials = (id) => {
    return axios.delete('/api/admin/delete-socials',
        {
            data: {
                id: id
            }
        });
}

const getBanks = () => {
    return axios.get('/api/admin/get-banks');
}
const deleteBanks = (id) => {
    return axios.delete('/api/admin/delete-banks',
        {
            data: {
                id: id
            }
        });
}

const getEmails = () => {
    return axios.get('/api/admin/get-emails');
}
const deleteEmails = (id) => {
    return axios.delete('/api/admin/delete-emails',
        {
            data: {
                id: id
            }
        });
}
const getPhones = () => {
    return axios.get('/api/admin/get-phones');
}
const deletePhones = (id) => {
    return axios.delete('/api/admin/delete-phones',
        {
            data: {
                id: id
            }
        });
}
const getLocations = () => {
    return axios.get('/api/admin/get-locations');
}
const deleteLocations = (id) => {
    return axios.delete('/api/admin/delete-locations',
        {
            data: {
                id: id
            }
        });
}
const getCustoms = () => {
    return axios.get('/api/admin/get-customs');
}
const deleteCustoms = (id) => {
    return axios.delete('/api/admin/delete-customs',
        {
            data: {
                id: id
            }
        });
}
// MENU ADMIN NEW
const adminDashboardService = (type) => {
    return axios.post('/api/user/admin-dashboard', type);
}
export {
    creatNewSocials,
    getListSocials,
    deleteListSocials,
    editListSocials,
    creatNewBanks,
    getListBanks,
    deleteListBanks,
    editListBanks,
    getSocials,
    deleteSocials,
    getBanks,
    deleteBanks,
    getEmails,
    deleteEmails,
    getPhones,
    deletePhones,
    getLocations,
    deleteLocations,
    getCustoms,
    deleteCustoms,
    adminDashboardService,
};
