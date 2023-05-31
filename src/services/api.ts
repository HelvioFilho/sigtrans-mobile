import axios from "axios";

const { URL } = process.env;

export const api = axios.create({
  baseURL: URL,
});
