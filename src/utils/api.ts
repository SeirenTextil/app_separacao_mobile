import axios from 'axios';

export const api = axios.create({
	baseURL: 'http://10.16.0.13:5000/api/v1/',
});

