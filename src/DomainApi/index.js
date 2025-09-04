import axios from 'axios';

console.log('API URL:', process.env.REACT_APP_API_URL);

export default axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: {
        'Content-Type': 'application/json',
    },
});
