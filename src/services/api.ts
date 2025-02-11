// src/services/api.ts
import axios from "axios";
import { BASE_URL } from "@/utils";

const api = axios.create({
  baseURL: BASE_URL,
});

const storedToken = localStorage.getItem('authToken');
if (storedToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
}

export default api;
