import axios from "axios";

const baseUrl = "https://dahechimmo-backend.onrender.com/api/auth";

const login = async (username: string, password: string) => {
  const token = await axios.post(`${baseUrl}/login`, { username, password });
  return token.data;
};

const getAll = async (token: string) => {
  const properties = await axios.get(`${baseUrl}/properties`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return properties.data;
};

export default { login, getAll };
