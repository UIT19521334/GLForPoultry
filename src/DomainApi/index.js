import axios from 'axios';

export default axios.create({
    // baseURL: `http://localhost:56058/`,
    headers: {
        'Content-Type': 'application/json',
    },
});
