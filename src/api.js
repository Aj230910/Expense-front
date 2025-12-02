import axios from "axios";

const API = axios.create({
  baseURL: "https://expense-back-hedv.onrender.com/api/transactions",
});

export default API;
