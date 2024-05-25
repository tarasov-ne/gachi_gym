import axios from "axios";

var apiAxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

apiAxiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')

apiAxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token){
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

apiAxiosInstance.interceptors.response.use(
    response => {
        if(response.headers['authorization']){
            localStorage.setItem('token', response.headers['authorization']);
        }
        return response;
    }, error => {
        return Promise.reject(error);
    }
)


export default apiAxiosInstance;