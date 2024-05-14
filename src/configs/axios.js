import axios from "axios";
import { jwtDecode } from "jwt-decode";
// import jwt_decode from "jwt-decode";

// Tạo một instance Axios
const instanceAxios = axios.create({
    baseURL: 'http://localhost:3003', // URL cơ sở của API
    timeout: 5000, // Thời gian timeout cho mỗi request là 5 giây
});

// Thêm một interceptor cho request
instanceAxios.interceptors.request.use(
    async (config) => {
        // const [access_token, refresh_token] = useToken();
        const user = JSON.parse(localStorage.getItem("account_user"));
        const access_token = user.accessToken;
        const refresh_token = user.refreshToken;
        let date = new Date();
        const decodedAccessToken = jwtDecode(access_token);
        if (decodedAccessToken.exp < date.getTime() / 1000) {
            const [newAccessToken, newRefreshToken] = await refreshToken(refresh_token);
            localStorage.setItem('account_user', JSON.stringify({ ...user, accessToken: newAccessToken, refreshToken: newRefreshToken }));
            config.headers.Authorization = `Bearer ${newAccessToken}`;
        } else {
            config.headers.Authorization = `Bearer ${access_token}`;
        }
        return config;
    },
    (error) => { return Promise.reject(error) }
);

// Hàm để refresh token
const refreshToken = async (refresh_token) => {
    try {
        const response = await axios.post('http://localhost:3003/auth/refresh_token', null, {
            headers: {
                Authorization: `Bearer ${refresh_token}`,
            },
        });
        const { accessToken, refreshToken } = response.data.data;
        return [accessToken, refreshToken];
    } catch (error) {
        localStorage.removeItem('account_user');
        console.log('Error refreshing token:', error);
        window.location.href = '/';
    }
}

export default instanceAxios;