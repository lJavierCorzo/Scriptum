// apiCall.js
import { API_BASE_URL } from '../config';
import axios from 'axios';

export const apiCall = (url, data, headers, method, responseType = 'json') =>
  axios({
    method,
    url: API_BASE_URL + url, 
    data,
    headers,
    responseType,
  });
