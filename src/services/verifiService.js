import axios from '../axios';

const setStatusS3 = (data) => {
    return axios.post('/api/user/set-Status-S3', data);
}
const planSchedule = (data) => {
    return axios.post('/api/user/plan-Schedule', data);
}

export {
    setStatusS3,
    planSchedule
};
