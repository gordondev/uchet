import { $authHost, $host } from "./index";
import jwt_decode from "jwt-decode";

export const registration = async (
  email,
  password,
  division,
  name,
  surname,
  patronymic
) => {
  const { data } = await $host.post("api/user/registration", {
    email,
    password,
    division,
    name,
    surname,
    patronymic,
  });
  localStorage.setItem("token", data.accessToken);
  return jwt_decode(data.accessToken);
};

export const login = async (email, password) => {
  const { data } = await $host.post("api/user/login", { email, password });
  localStorage.setItem("token", data.accessToken);
  return jwt_decode(data.accessToken);
};

export const check = async () => {
  const { data } = await $authHost.get(
    `${process.env.REACT_APP_API_URL}/api/user/refresh`,
    { withCredentials: true }
  );
  localStorage.setItem("token", data.accessToken);
  return jwt_decode(data.accessToken);
};

export const logout = async () => {
  return $host.post("api/user/logout");
};

export const deleteAccount = async (id) => {
  await $host.delete("api/user/delete/" + id);
};

export const getImageInfo = async (id) => {
  const { data } = await $host.get("api/user/profile-image/" + id);
  return data;
};

export const updateAccount = async (id, newData) => {
  await $host.put("api/user/update/" + id, newData);
};

export const updateProfile = async (id, newData) => {
  await $host.put("api/user/admin/update/" + id, newData);
};

export const getAllUsers = async () => {
  const { data } = await $authHost.get("api/user/users/");
  return data;
};

export const blockUser = async (id, isBlocked) => {
  await $host.put("api/user/admin/block/" + id, isBlocked);
};