import api from "./axios";

export const loginService = async (username: string, password: string) => {
  const res = await api.post("/auth/login", {
    username,
    password,
    expiresInMins: 1,
  });
  return res.data;
};
