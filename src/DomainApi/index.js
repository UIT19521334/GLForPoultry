import axios from 'axios';

export default axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const DomainPoultry = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL_POULTRY}`,
    headers: {
        'Content-Type': 'application/json',
    },
});
