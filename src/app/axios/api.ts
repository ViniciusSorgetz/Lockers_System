import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: "/" });
const token = cookies.get("lockersSystem-token");

export const api = axios.create({
    baseURL: "api"
});

if(token){
    api.defaults.headers["Authorization"] = `Bearer ${token}`
}